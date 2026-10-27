import { Writable } from 'node:stream'
import { renderToPipeableStream } from 'react-dom/server'
import App from './App.jsx'

export function render(pathname) {
  return new Promise((resolve, reject) => {
    let html = ''
    let settled = false
    let renderError = null
    const sink = new Writable({
      write(chunk, _encoding, callback) {
        html += chunk.toString()
        callback()
      },
    })

    sink.on('finish', () => {
      settled = true
      if (renderError) reject(renderError)
      else resolve(html)
    })
    sink.on('error', reject)

    const stream = renderToPipeableStream(<App initialPathname={pathname} />, {
      onAllReady() {
        stream.pipe(sink)
      },
      onShellError(error) {
        settled = true
        reject(error)
      },
      onError(error) {
        renderError ??= error
        if (!settled) console.error(`[prerender] ${pathname}:`, error)
      },
    })

    setTimeout(() => {
      if (!settled) stream.abort(new Error(`Timed out while prerendering ${pathname}`))
    }, 30_000).unref()
  })
}
