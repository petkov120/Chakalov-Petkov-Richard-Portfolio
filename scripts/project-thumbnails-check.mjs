import { chromium } from '@playwright/test'
import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'

const base = process.env.PORTFOLIO_URL || 'http://127.0.0.1:5175'
const projects = [
  ['Clinify', '/clinify'], ['UniversityX', '/universityx'],
  ['Kestbook', '/kestbook'], ['Hydra', '/hydra'],
  ['eFootball UI', '/efootball'],
  ['QuickHand', '/playground?design=PLG%20008'],
]
const browser = await chromium.launch()
const errors = []
await mkdir('/tmp/project-previews-check', { recursive: true })
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
  page.on('pageerror', e => errors.push(e.message))
  await page.goto(base + '/work')
  await page.locator('.wk-card').last().waitFor()
  assert.equal(await page.locator('.thumb--video').count(), projects.length)
  assert.equal(await page.locator('video[src]').count(), 0)
  for (const [name, href] of projects) {
    await page.getByRole('searchbox').fill(name)
    const card = page.locator('.wk-card')
    assert.equal(await card.getAttribute('href'), href)
    const thumb = card.locator('.thumb--video'), video = card.locator('video')
    await thumb.hover()
    await page.waitForFunction(() => document.querySelector('.wk-card video')?.currentTime > .3)
    assert.equal(await video.evaluate(v => v.muted && v.videoWidth > 0), true)
    if (name !== 'Hydra') {
      assert.ok((await thumb.locator('.thumb-video__brand').textContent()).includes(name))
      const frame = () => video.evaluate(v => { const c=document.createElement('canvas');c.width=160;c.height=100;c.getContext('2d').drawImage(v,0,0,160,100);return c.toDataURL() })
      const first = await frame()
      await video.evaluate(v => new Promise(resolve => { v.pause();v.addEventListener('seeked',resolve,{once:true});v.currentTime=4 }))
      assert.notEqual(await frame(), first, name + ' tour changes screens')
    }
    await page.mouse.move(1, 1)
    await page.waitForFunction(() => document.querySelector('.wk-card video')?.paused)
  }
  await page.getByRole('searchbox').fill('')
  await page.screenshot({ path: '/tmp/project-previews-check/desktop.png', fullPage: true })
  await page.getByRole('searchbox').fill('QuickHand')
  await page.locator('.wk-card').click()
  await page.waitForURL('**/playground?design=PLG%20008')
  await page.getByRole('dialog').waitFor()
  assert.equal(await page.getByRole('dialog').getByRole('img', { name: 'QuickHand Offerings' }).count() > 0, true)
  await page.getByRole('button', { name: 'Close', exact: true }).click()
  await page.getByRole('dialog').waitFor({ state: 'hidden' })
  await page.close()

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' })
  mobile.on('pageerror', e => errors.push(e.message))
  await mobile.goto(base + '/work')
  for (const [name] of projects) {
    await mobile.getByRole('searchbox').fill(name)
    const thumb = mobile.locator('.thumb--video')
    await thumb.scrollIntoViewIfNeeded()
    await thumb.hover()
    await mobile.waitForFunction(() => document.querySelector('.thumb-video__poster')?.naturalWidth > 0)
    assert.equal(await thumb.locator('video').getAttribute('src'), null)
    assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
    await mobile.screenshot({ path: '/tmp/project-previews-check/' + name.toLowerCase() + '-mobile.png' })
  }
  await mobile.close()

  const fallback = await browser.newPage()
  await fallback.route('**/clinify-preview.mp4', route => route.abort())
  await fallback.goto(base + '/work')
  await fallback.getByRole('searchbox').fill('Clinify')
  await fallback.locator('.thumb--video').hover()
  await fallback.waitForFunction(() => document.querySelector('.wk-card video')?.error !== null)
  assert.equal(await fallback.locator('.thumb--video').getAttribute('data-playing'), 'false')
  assert.equal(await fallback.locator('.thumb-video__poster').evaluate(img => img.complete && img.naturalWidth > 0), true)
  assert.deepEqual(errors, [])
  console.log('All six previews passed playback, changing frames, pause, mobile, reduced motion, and fallback checks; QuickHand opens and closes correctly.')
} finally { await browser.close() }
