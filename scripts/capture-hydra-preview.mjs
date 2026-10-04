import { chromium } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import sharp from 'sharp'

const browser = await chromium.launch({ args: ['--enable-webgl', '--ignore-gpu-blocklist'] })
const directory = '/tmp/hydra-preview-frames'
try {
  await mkdir(directory, { recursive: true })
  await mkdir('public/videos', { recursive: true })
  const page = await browser.newPage({ viewport: { width: 960, height: 540 } })
  await page.clock.install({ time: new Date('2026-10-04T00:00:00Z') })
  await page.clock.pauseAt(new Date('2026-10-04T00:00:01Z'))
  await page.route('**/hydra-capture', route => route.fulfill({ contentType: 'text/html', body: '<html><head><script type="module">import RefreshRuntime from "/@react-refresh"; RefreshRuntime.injectIntoGlobalHook(window); window.$RefreshReg$=()=>{}; window.$RefreshSig$=()=>type=>type; window.__vite_plugin_react_preamble_installed__=true;</script></head><body style="margin:0"><div id="race" style="width:960px;height:540px"></div></body></html>' }))
  // Preserve pixels only for offline capture, never in the live game.
  await page.route('**/src/components/hydra/raceEngine.js*', async route => {
    const response = await route.fetch()
    const body = (await response.text())
      .replace('antialias: true,', 'preserveDrawingBuffer: true, antialias: true,')
      .replace(/renderer\.render\(scene,\s*camera\)/, 'window.__drawRace = () => renderer.render(scene, camera)')
    await route.fulfill({ response, body })
  })
  await page.goto('http://127.0.0.1:5175/hydra-capture')
  await page.evaluate(async () => {
    const { createRace } = await import('/src/components/hydra/raceEngine.js')
    const { cars } = await import('/src/components/hydra/cars.jsx')
    window.race = await createRace(document.querySelector('#race'), cars, () => {})
    window.race.quality('low')
    window.race.start()
    window.race.key('ArrowUp', true)
  })
  await page.clock.runFor(7500)
  for (let frame = 0; frame < 144; frame++) {
    await page.clock.runFor(1000 / 24)
    const image = await page.evaluate(() => { window.__drawRace(); return document.querySelector('canvas').toDataURL('image/png').split(',')[1] })
    await writeFile(directory + '/' + String(frame).padStart(4, '0') + '.png', Buffer.from(image, 'base64'))
    if (frame % 48 === 0) console.log('Captured frame', frame)
  }
  await sharp(directory + '/0000.png').webp({ quality: 85 }).toFile('public/videos/hydra-race-poster.webp')
  execFileSync('ffmpeg', ['-y','-loglevel','error','-framerate','24','-i',directory+'/%04d.png','-frames:v','144','-an','-c:v','libx264','-preset','medium','-crf','24','-pix_fmt','yuv420p','-movflags','+faststart','public/videos/hydra-race-preview.mp4'])
  console.log('Exported six seconds of gameplay at 24 fps')
} finally { await browser.close() }
