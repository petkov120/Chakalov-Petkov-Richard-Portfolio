import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { bodyThemeFor, canonicalPath, metadataFor, PUBLIC_ROUTES } from '../src/siteRoutes.js'

const projectRoot = process.cwd()
const distDir = path.join(projectRoot, 'dist')
const serverDir = path.join(projectRoot, '.prerender')
const template = await readFile(path.join(distDir, 'index.html'), 'utf8')
const { render } = await import(pathToFileURL(path.join(serverDir, 'entry-server.js')).href)

const escapeAttribute = value => value
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')

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
    .replace('</head>', `    ${social}\n  </head>`)
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
}
