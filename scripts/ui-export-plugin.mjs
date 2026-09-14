import { spawn } from 'node:child_process'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const MAX_BYTES = 64 * 1024 * 1024

export function encodeMp4(input, output, signal) {
  return new Promise((resolve, reject) => {
    const process = spawn('ffmpeg', [
      '-hide_banner', '-loglevel', 'error', '-nostdin',
      // Only local uploaded data may be read; never resolve remote URLs from a file.
      '-protocol_whitelist', 'file,pipe', '-f', input.endsWith('.webm') ? 'matroska,webm' : 'mov', '-threads', '2', '-i', input,
      '-map', '0:v:0', '-an', '-t', '30',
      '-vf', 'scale=1080:1350:force_original_aspect_ratio=decrease,pad=1080:1350:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=30',
      '-c:v', 'libx264', '-threads', '2', '-preset', 'fast', '-crf', '18',
      '-maxrate', '8M', '-bufsize', '16M', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', output,
    ], { stdio: ['ignore', 'ignore', 'pipe'], signal })
    let error = ''
    const timer = setTimeout(() => process.kill('SIGKILL'), 120_000)
    process.stderr.on('data', (data) => { error = `${error}${data}`.slice(-2000) })
    process.on('error', (cause) => {
      clearTimeout(timer)
      reject(new Error(cause.code === 'ENOENT'
        ? 'FFmpeg is not installed. Install it, restart npm run dev, and try again. You can download the original recording below.'
        : 'MP4 conversion was interrupted. Your original recording is still available.'))
    })
    process.on('close', (code) => {
      clearTimeout(timer)
      if (code === 0) resolve()
      else reject(new Error(error ? 'This recording could not be converted to MP4. Download the original or try a shorter recording.' : 'MP4 conversion timed out. Try a shorter recording.'))
    })
  })
}

function sendError(response, status, error) {
  if (response.destroyed) return
  response.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' })
  response.end(JSON.stringify({ error }))
}

export function createExportMiddleware() {
  let busy = false
  return async (request, response, next) => {
    if (request.url?.split('?')[0] !== '/__ui_export/mp4') return next()
    const address = request.socket.remoteAddress
    if (!['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(address)) return sendError(response, 403, 'Export conversion is local-only.')
    if (request.method !== 'POST') return sendError(response, 405, 'Use POST to convert a recording.')
    // Require a same-origin browser request and a non-simple header. No CORS
    // headers are emitted, and this middleware is absent from production builds.
    if (!request.headers.host || request.headers.origin !== `http://${request.headers.host}` || request.headers['x-ui-export'] !== '1') {
      return sendError(response, 403, 'Open Export from this local studio tab.')
    }
    const type = request.headers['content-type']?.split(';')[0]
    if (!['video/webm', 'video/mp4'].includes(type)) return sendError(response, 415, 'Upload a WebM or MP4 recording.')
    if (Number(request.headers['content-length']) > MAX_BYTES) return sendError(response, 413, 'Recording is too large. Keep it under 30 seconds.')
    if (busy) return sendError(response, 429, 'Another recording is converting. Try again in a moment.')
    busy = true
    let directory
    const controller = new AbortController()
    const abort = () => controller.abort()
    response.on('close', abort)
    request.setTimeout(30_000, () => request.destroy())
    try {
      const chunks = []
      let bytes = 0
      for await (const chunk of request) {
        bytes += chunk.length
        if (bytes > MAX_BYTES) {
          sendError(response, 413, 'Recording is too large. Keep it under 30 seconds.')
          return
        }
        chunks.push(chunk)
      }
      request.setTimeout(0)
      if (!bytes) return sendError(response, 400, 'The recording is empty.')
      const data = Buffer.concat(chunks)
      const validWebm = type === 'video/webm' && data.subarray(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3]))
      const validMp4 = type === 'video/mp4' && data.subarray(4, 8).toString() === 'ftyp'
      if (!validWebm && !validMp4) return sendError(response, 400, 'This is not a valid browser video recording.')
      directory = await mkdtemp(join(tmpdir(), 'ui-studio-export-'))
      const input = join(directory, type === 'video/webm' ? 'input.webm' : 'input.mp4')
      const output = join(directory, 'presentation.mp4')
      await writeFile(input, data)
      await encodeMp4(input, output, controller.signal)
      const result = await readFile(output)
      if (!response.destroyed) {
        response.writeHead(200, { 'Content-Type': 'video/mp4', 'Content-Length': result.length, 'Cache-Control': 'no-store' })
        response.end(result)
      }
    } catch (error) {
      sendError(response, 500, error.message || 'MP4 conversion failed. The original recording is still available.')
    } finally {
      response.removeListener('close', abort)
      busy = false
      if (directory) await rm(directory, { recursive: true, force: true }).catch(() => {})
    }
  }
}

export default function uiExportPlugin() {
  return {
    name: 'local-ui-export',
    apply: 'serve',
    configureServer(server) { server.middlewares.use(createExportMiddleware()) },
  }
}
