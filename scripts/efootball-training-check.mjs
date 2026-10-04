import { chromium } from '@playwright/test'
import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import sharp from 'sharp'

const browser = await chromium.launch({ args: ['--enable-webgl', '--ignore-gpu-blocklist'] })
const baseURL = process.env.EFOOTBALL_URL || 'http://127.0.0.1:5176/efootball'
const output = '/tmp/efootball-check'
await mkdir(output, { recursive: true })
const errors = [], models = []
const read = page => page.locator('.ef-training__mount').evaluate(node => node.__football())
const wait = (page, predicate) => page.waitForFunction(predicate, null, { timeout: 30000 })
async function open(options) {
  const page = await browser.newPage(options)
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
  page.on('request', request => { if (request.url().includes('/models/efootball')) models.push(request.url()) })
  await page.goto(baseURL)
  await page.locator('.ef-training__stage').scrollIntoViewIfNeeded()
  await page.getByRole('button', { name: 'Inspect player', exact: true }).waitFor()
  await wait(page, () => !!document.querySelector('.ef-training__mount')?.__football)
  return page
}
async function pixels(page, name) {
  const buffer = await page.locator('.ef-training__stage').screenshot({ path: `${output}/${name}.png` })
  const stats = await sharp(buffer).stats()
  assert.ok(stats.channels[0].stdev > 20, 'canvas has varied rendered pixels')
}
try {
  const desktop = await open({ viewport: { width: 1440, height: 1100 } })
  const stage = desktop.locator('.ef-training__stage')
  await pixels(desktop, 'desktop-ready')
  assert.equal((await read(desktop)).bones, 17)
  await desktop.getByRole('button', { name: 'Inspect player', exact: true }).click()
  await desktop.waitForTimeout(1600)
  await pixels(desktop, 'desktop-player')
  await desktop.getByRole('button', { name: 'Return to game', exact: true }).click()
  await stage.focus()
  await desktop.keyboard.down('KeyW')
  await wait(desktop, () => document.querySelector('.ef-training__mount').__football().player[2] < 0)
  const running = await read(desktop)
  await pixels(desktop, 'desktop-running')
  await desktop.keyboard.up('KeyW')
  await wait(desktop, () => document.querySelector('.ef-training__mount').__football().goals === 1)
  assert.equal((await read(desktop)).shots, 1)
  await pixels(desktop, 'desktop-goal')
  await desktop.getByRole('button', { name: 'Reset training' }).click()
  assert.equal((await read(desktop)).goals, 0)
  await desktop.keyboard.down('KeyD')
  await wait(desktop, () => document.querySelector('.ef-training__mount').__football().player[0] > 2)
  await desktop.keyboard.up('KeyD')
  await wait(desktop, () => document.querySelector('.ef-training__mount').__football().message === 'Wide')
  assert.equal((await read(desktop)).goals, 0)
  await desktop.getByRole('button', { name: 'Reset training' }).click()
  await desktop.keyboard.down('KeyW')
  await wait(desktop, () => document.querySelector('.ef-training__mount').__football().charge > 0.2)
  await desktop.evaluate(() => window.dispatchEvent(new Event('blur')))
  await desktop.keyboard.up('KeyW')
  await desktop.waitForTimeout(500)
  assert.equal((await read(desktop)).shots, 0, 'blur cancels movement without an accidental shot')
  await desktop.close()

  const mobile = await open({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 })
  await pixels(mobile, 'mobile-ready')
  assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'no horizontal overflow')
  const bounds = await mobile.locator('.ef-training__stage').boundingBox()
  const cdp = await mobile.context().newCDPSession(mobile)
  const origin = { x: bounds.x + 70, y: bounds.y + bounds.height - 140 }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [origin] })
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: origin.x, y: origin.y - 56 }] })
  await wait(mobile, () => document.querySelector('.ef-training__mount').__football().player[2] < 0)
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await wait(mobile, () => document.querySelector('.ef-training__mount').__football().goals === 1)
  await pixels(mobile, 'mobile-goal')
  await mobile.getByRole('button', { name: 'Inspect player', exact: true }).click()
  await mobile.waitForTimeout(1600)
  await pixels(mobile, 'mobile-player')
  assert.deepEqual(errors, [])
  assert.ok(models.every(url => url.endsWith('efootball-forward.glb')))
  console.log(JSON.stringify({ desktop: running, mobile: await read(mobile), errors, models: [...new Set(models)], screenshots: output }, null, 2))
  await mobile.goto(baseURL.replace('/efootball', '/work'))
  await mobile.waitForTimeout(200)
  assert.equal(await mobile.locator('.ef-training canvas').count(), 0, 'scene is removed on navigation')
} finally { await browser.close() }
