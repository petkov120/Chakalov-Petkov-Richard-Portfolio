import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { createServer } from 'node:http'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'
import { after, before, test } from 'node:test'
import { createExportMiddleware } from './ui-export-plugin.mjs'

const exec = promisify(execFile)
let server
let origin
let directory
let source

before(async () => {
  directory = await mkdtemp(join(tmpdir(), 'ui-export-test-'))
  const middleware = createExportMiddleware()
  server = createServer((request, response) => middleware(request, response, () => {
    response.writeHead(404)
    response.end('Not found')
  }))
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  origin = `http://127.0.0.1:${server.address().port}`
  const input = join(directory, 'fixture.webm')
  await exec('ffmpeg', ['-v', 'error', '-f', 'lavfi', '-i', 'testsrc2=size=320x400:rate=24', '-t', '0.6', '-c:v', 'libvpx-vp9', '-threads', '2', input])
  source = await readFile(input)
})

after(async () => {
  if (server) await new Promise((resolve) => server.close(resolve))
  if (directory) await rm(directory, { recursive: true, force: true })
})

function post(body, headers = {}) {
  return fetch(`${origin}/__ui_export/mp4`, {
    method: 'POST', body,
    headers: { Origin: origin, 'X-UI-Export': '1', 'Content-Type': 'video/webm', ...headers },
  })
}

test('unrelated routes pass through and conversion requires POST', async () => {
  assert.equal((await fetch(`${origin}/unrelated`)).status, 404)
  assert.equal((await fetch(`${origin}/__ui_export/mp4`)).status, 405)
})

test('rejects cross-origin and missing custom headers', async () => {
  assert.equal((await post(source, { Origin: 'https://example.com' })).status, 403)
  assert.equal((await post(source, { 'X-UI-Export': '' })).status, 403)
})

test('rejects unsupported, empty, and invalid media without converting', async () => {
  assert.equal((await post('hello', { 'Content-Type': 'text/plain' })).status, 415)
  assert.equal((await post('')).status, 400)
  assert.equal((await post('not video')).status, 400)
})

test('recovers after a corrupt video and produces a real silent 1080 × 1350 H.264 MP4', async () => {
  const corrupt = await post(Buffer.from([0x1a, 0x45, 0xdf, 0xa3, 0, 0]))
  assert.equal(corrupt.status, 500)
  assert.match((await corrupt.json()).error, /converted/)
  const response = await post(source)
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('content-type'), 'video/mp4')
  const data = Buffer.from(await response.arrayBuffer())
  assert.ok(data.indexOf('moov') < data.indexOf('mdat'), 'faststart metadata precedes video data')
  const output = join(directory, 'output.mp4')
  await writeFile(output, data)
  const { stdout } = await exec('ffprobe', ['-v', 'error', '-show_streams', '-of', 'json', output])
  const { streams } = JSON.parse(stdout)
  assert.equal(streams.length, 1)
  assert.equal(streams[0].codec_name, 'h264')
  assert.equal(streams[0].width, 1080)
  assert.equal(streams[0].height, 1350)
  assert.equal(streams[0].pix_fmt, 'yuv420p')
  assert.equal(streams[0].r_frame_rate, '30/1')
})
