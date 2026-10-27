import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { bodyThemeFor, canonicalPath, metadataFor, PUBLIC_ROUTES } from '../src/siteRoutes.js'

const projectRoot = process.cwd()
const distDir = path.join(projectRoot, 'dist')
const serverDir = path.join(projectRoot, '.prerender')
const template = await readFile(path.join(distDir, 'index.html'), 'utf8')
const { render } = await import(pathToFileURL(path.join(serverDir, 'entry-server.js')).href)
const manifestDir = path.join(distDir, '.vite')
const manifest = JSON.parse(await readFile(path.join(manifestDir, 'manifest.json'), 'utf8'))

// Route pages are React.lazy chunks, so their CSS normally arrives only after the JS runs and the
// prerendered HTML paints unstyled first. Read the route -> page wiring from App.jsx and link each
// page's CSS (and preload its JS) in the head instead.
const appSource = await readFile(path.join(projectRoot, 'src', 'App.jsx'), 'utf8')
const lazyPages = new Map([...appSource.matchAll(/const (\w+) = lazy\(\(\) => import\('\.\/(.+?)'\)\)/g)]
  .map(([, name, file]) => [name, `src/${file}.jsx`]))
const routePages = new Map([...appSource.matchAll(/^\s*'(\/[^']*)': (\w+),$/gm)]
  .map(([, route, name]) => [route, name]))

const escapeAttribute = value => value
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')

function chunkAssets(key, assets = { css: new Set(), js: new Set() }, seen = new Set()) {
  const chunk = manifest[key]
  if (!chunk || chunk.isEntry || seen.has(key)) return assets
  seen.add(key)
  assets.js.add(chunk.file)
  // Shared chunks first so the page's own rules still win the cascade, as in the client load order.
  chunk.imports?.forEach(imported => chunkAssets(imported, assets, seen))
  chunk.css?.forEach(file => assets.css.add(file))
  return assets
}

function pageAssetTags(pathname) {
  const pageName = routePages.get(pathname)
  const source = lazyPages.get(pageName)
  if (!source) return ''
  if (!manifest[source]) throw new Error(`[prerender] ${pathname}: ${source} is missing from the Vite manifest`)
  const { css, js } = chunkAssets(source)
  return [
    ...[...css].map(file => `<link rel="stylesheet" crossorigin href="/${file}">`),
    ...[...js].map(file => `<link rel="modulepreload" crossorigin href="/${file}">`),
  ].map(tag => `    ${tag}\n`).join('')
}

function documentFor(pathname, appHtml) {
  const meta = metadataFor(pathname)
  const canonical = `https://petkov.name.ng${canonicalPath(pathname)}`
  const social = [
    `<link rel="canonical" href="${canonical}" />`,
    '<meta property="og:type" content="website" />',
    `<meta property="og:title" content="${escapeAttribute(meta.title)}" />`,
    `<meta property="og:description" content="${escapeAttribute(meta.description)}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
  ].join('\n    ')

  return template
    .replace(/<title>.*?<\/title>/, `<title>${meta.title}</title>`)
    .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${escapeAttribute(meta.description)}" />`)
    .replace('</head>', `${pageAssetTags(pathname)}    ${social}\n  </head>`)
    .replace('<body>', `<body class="${bodyThemeFor(pathname)}">`)
    .replace('<div id="root"></div>', `<div id="root" data-prerendered="true" data-pathname="${pathname}">${appHtml}</div>`)
}

try {
  for (const pathname of PUBLIC_ROUTES) {
    const html = documentFor(pathname, await render(pathname))
    const output = pathname === '/'
      ? path.join(distDir, 'index.html')
      : path.join(distDir, `${pathname.slice(1)}.html`)
    await mkdir(path.dirname(output), { recursive: true })
    await writeFile(output, html)
    console.log(`prerendered ${pathname}`)
  }
} finally {
  await rm(serverDir, { recursive: true, force: true })
  await rm(manifestDir, { recursive: true, force: true })
}
