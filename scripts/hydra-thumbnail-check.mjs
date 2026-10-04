import { chromium } from '@playwright/test'
import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'

const browser = await chromium.launch()
const errors = []
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('http://127.0.0.1:5175/work')
  await page.getByRole('searchbox').fill('Hydra')
  const thumbnail = page.locator('.thumb--video')
  await thumbnail.scrollIntoViewIfNeeded()
  const video = thumbnail.locator('video')
  assert.equal(await video.getAttribute('src'), null, 'video is lazy before interaction')
  await thumbnail.hover()
  await page.waitForFunction(() => document.querySelector('.thumb--video video')?.currentTime > .5)
  assert.equal(await video.evaluate(el => el.muted), true)
  assert.equal(await video.evaluate(el => el.videoWidth), 960)
  await mkdir('/tmp/hydra-check', { recursive: true })
  await page.screenshot({ path: '/tmp/hydra-check/thumbnail-desktop.png' })
  await page.mouse.move(1, 1)
  await page.waitForFunction(() => document.querySelector('.thumb--video video')?.paused)
  await thumbnail.click()
  await page.waitForURL('**/hydra')
  await page.locator('.race-stage').waitFor()
  await page.close()

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' })
  mobile.on('pageerror', error => errors.push(error.message))
  await mobile.goto('http://127.0.0.1:5175/work')
  await mobile.getByRole('searchbox').fill('Hydra')
  const mobileThumb = mobile.locator('.thumb--video')
  await mobileThumb.scrollIntoViewIfNeeded()
  await mobileThumb.hover()
  assert.equal(await mobileThumb.locator('video').getAttribute('src'), null, 'reduced motion does not load video')
  assert.equal(await mobileThumb.locator('img').evaluate(el => el.complete && el.naturalWidth > 0), true)
  await mobile.screenshot({ path: '/tmp/hydra-check/thumbnail-mobile.png' })
  assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
  await mobileThumb.tap()
  await mobile.waitForURL('**/hydra')
  assert.deepEqual(errors, [])
  console.log('Video playback, pause, mobile poster, reduced motion, and click-through passed')
} finally { await browser.close() }
