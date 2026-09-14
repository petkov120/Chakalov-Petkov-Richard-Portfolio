export const EXPORT_WIDTH = 1080
export const EXPORT_HEIGHT = 1350
export const MAX_SECONDS = 30

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
}

export async function captureCover(element, format) {
  await document.fonts.ready
  await Promise.all([...element.querySelectorAll('img')].map((img) => img.decode().catch(() => {})))
  const { domToBlob } = await import('modern-screenshot')
  const blob = await domToBlob(element, {
    width: EXPORT_WIDTH / 2,
    height: EXPORT_HEIGHT / 2,
    scale: 2,
    type: `image/${format}`,
    quality: 0.97,
    style: { transform: 'none' },
    filter: (node) => !node.classList?.contains('ui-studio__finger'),
    features: { restoreScrollPosition: true },
    // Fail visibly rather than downloading a cover with missing imagery.
    fetch: { placeholderImage: () => { throw new Error('An image could not be exported. Use a local image in public/ and try again.') } },
  })
  if (!blob) throw new Error('The cover could not be created. Please try again.')
  return blob
}

export function canRecord() {
  return Boolean(navigator.mediaDevices?.getDisplayMedia && window.CropTarget?.fromElement && window.MediaRecorder)
}

// No recording starts before cropTo resolves: other tabs and full-screen
// sharing are rejected, never saved as an accidental desktop recording.
export async function prepareRecording(element, onEnded) {
  if (!canRecord()) throw new Error('Video recording needs desktop Chrome or Edge. Cover downloads still work here.')
  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: { displaySurface: 'browser', width: { ideal: 2560 }, height: { ideal: 1600 }, frameRate: { ideal: 30, max: 30 } },
    audio: false,
    preferCurrentTab: true,
    selfBrowserSurface: 'include',
    surfaceSwitching: 'exclude',
    monitorTypeSurfaces: 'exclude',
  })
  const track = stream.getVideoTracks()[0]
  const video = document.createElement('video')
  let timer
  let output
  let recorder
  let settled = false
  let resolveResult
  let rejectResult
  const result = new Promise((resolve, reject) => { resolveResult = resolve; rejectResult = reject })
  // A preparation failure can happen before the caller subscribes to result.
  result.catch(() => {})
  const cleanup = () => {
    clearInterval(timer)
    track.removeEventListener('ended', ended)
    stream.getTracks().forEach((item) => item.stop())
    output?.getTracks().forEach((item) => item.stop())
    video.pause()
    video.srcObject = null
  }
  const ended = () => onEnded()

  try {
    if (track.getSettings().displaySurface !== 'browser' || typeof track.cropTo !== 'function') {
      throw new Error('Choose this studio tab in the sharing picker, rather than a window or screen.')
    }
    try {
      await track.cropTo(await window.CropTarget.fromElement(element))
    } catch {
      throw new Error('Choose this studio tab so the recording can be cropped to your phone presentation.')
    }
    track.contentHint = 'detail'
    video.muted = true
    video.playsInline = true
    video.srcObject = stream
    // Subscribe before play(): a still screen may deliver just one frame.
    // Registering afterwards can miss that frame and stall preparation.
    const firstFrame = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('The shared tab did not produce a frame. Keep it visible and try again.')), 8000)
      video.requestVideoFrameCallback(() => { clearTimeout(timeout); resolve() })
    })
    await Promise.all([video.play(), firstFrame])

    const canvas = document.createElement('canvas')
    canvas.width = EXPORT_WIDTH
    canvas.height = EXPORT_HEIGHT
    const context = canvas.getContext('2d', { alpha: false })
    const background = getComputedStyle(element).backgroundColor
    const draw = () => {
      if (video.readyState < 2) return
      context.fillStyle = background
      context.fillRect(0, 0, canvas.width, canvas.height)
      const scale = Math.min(canvas.width / video.videoWidth, canvas.height / video.videoHeight)
      const width = video.videoWidth * scale
      const height = video.videoHeight * scale
      context.drawImage(video, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height)
    }
    draw()
    output = canvas.captureStream(30)
    const mimeType = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/mp4;codecs=avc1.42001E']
      .find((type) => MediaRecorder.isTypeSupported(type))
    if (!mimeType) throw new Error('This browser has no supported video encoder. Try desktop Chrome.')
    recorder = new MediaRecorder(output, { mimeType, videoBitsPerSecond: 12_000_000 })
    const chunks = []
    recorder.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data) }
    recorder.onerror = () => {
      settled = true
      cleanup()
      rejectResult(new Error('Recording failed. Try a shorter clip or close other busy tabs.'))
    }
    recorder.onstop = () => {
      cleanup()
      if (settled) return
      settled = true
      const blob = new Blob(chunks, { type: recorder.mimeType })
      if (blob.size) resolveResult(blob)
      else rejectResult(new Error('No video was captured. Try recording again.'))
    }
    track.addEventListener('ended', ended)

    return {
      result,
      source: { width: video.videoWidth, height: video.videoHeight },
      start() {
        if (track.readyState !== 'live') throw new Error('Tab sharing ended. Start a new recording.')
        timer = setInterval(draw, 1000 / 30)
        recorder.start(250)
      },
      stop() { if (recorder.state === 'recording') recorder.stop() },
      cancel() {
        settled = true
        if (recorder.state === 'recording') recorder.stop()
        cleanup()
        resolveResult(null)
      },
    }
  } catch (error) {
    cleanup()
    throw error
  }
}

export async function convertToMp4(blob, signal) {
  const response = await fetch('/__ui_export/mp4', {
    method: 'POST',
    headers: { 'Content-Type': blob.type.split(';')[0], 'X-UI-Export': '1' },
    body: blob,
    signal,
  })
  if (!response.ok || !response.headers.get('content-type')?.includes('video/mp4')) {
    const message = response.headers.get('content-type')?.includes('application/json')
      ? (await response.json()).error : null
    throw new Error(message || 'MP4 conversion is available with npm run dev and FFmpeg installed. Your original recording is still available below.')
  }
  return response.blob()
}
