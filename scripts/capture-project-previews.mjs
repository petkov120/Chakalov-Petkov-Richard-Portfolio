import { mkdir, stat } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import sharp from 'sharp'

// Screen tours use the original design assets, with no simulated app interactions.
const accents = { clinify: '#3b82f6', universityx: '#a33ab5', kestbook: '#c9a46c', quickhand: '#ff6a2b', efootball: '#43d46b' }
const W = 1200, H = 900, WIN = { x: 170, y: 195, w: 860, h: 510, bar: 26 }

// A dark stage with an accent glow, and the screen set in a rounded window with a soft shadow.
async function compose(source, accent, file) {
  const bg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs>
    <radialGradient id="a" cx="78%" cy="8%" r="70%"><stop offset="0" stop-color="${accent}" stop-opacity=".55"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></radialGradient>
    <radialGradient id="b" cx="6%" cy="100%" r="60%"><stop offset="0" stop-color="${accent}" stop-opacity=".25"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></radialGradient></defs>
    <rect width="100%" height="100%" fill="#0f1012"/><rect width="100%" height="100%" fill="url(#a)"/><rect width="100%" height="100%" fill="url(#b)"/></svg>`)
  const scaled = await sharp('public/images/' + source).resize(WIN.w).png().toBuffer()
  const meta = await sharp(scaled).metadata()
  const shot = await sharp(scaled).extract({ left: 0, top: 0, width: WIN.w, height: Math.min(meta.height, WIN.h - WIN.bar) }).png().toBuffer()
  const winH = Math.min(meta.height, WIN.h - WIN.bar) + WIN.bar, winY = WIN.y + Math.round((WIN.h - winH) / 2)
  const frame = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${WIN.w}" height="${winH}"><rect width="100%" height="100%" rx="14" fill="#fff"/><rect width="100%" height="${WIN.bar}" rx="0" fill="#f1f1f2" clip-path="inset(0 round 14px 14px 0 0)"/>
    <circle cx="20" cy="15" r="5" fill="#ff5f57"/><circle cx="38" cy="15" r="5" fill="#febc2e"/><circle cx="56" cy="15" r="5" fill="#28c840"/></svg>`)
  const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${WIN.w}" height="${winH}"><rect width="100%" height="100%" rx="14" fill="#fff"/></svg>`)
  const window = await sharp(frame).composite([{ input: shot, top: WIN.bar, left: 0 }]).png().toBuffer()
  const rounded = await sharp(window).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer()
  const pad = 80
  const shadow = await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${WIN.w + pad * 2}" height="${WIN.h + pad * 2}"><rect x="${pad}" y="${pad}" width="${WIN.w}" height="${winH}" rx="14" fill="#000" fill-opacity=".6"/></svg>`)).blur(28).png().toBuffer()
  await sharp(bg).composite([{ input: shadow, top: winY + 28 - pad, left: WIN.x - pad }, { input: rounded, top: winY, left: WIN.x }]).png().toFile(file)
}

const tours = {
  clinify: ['clinify/calling-overview.png', 'clinify/calling-ui.png', 'clinify/member-communications.png'],
  universityx: ['universityx/new-ai-tutor-interface.webp', 'universityx/new-quiz-interaction.webp', 'universityx/new-lesson-completion.webp'],
  kestbook: ['kestbook-new-ledger-replacement/01-dashboard.png', 'kestbook-new-ledger-replacement/04-properties.png', 'kestbook-new-ledger-replacement/06-people.png'],
  quickhand: ['playground/quickhand-onboard-2.webp', 'playground/quickhand-onboarding-grid.webp', 'playground/quickhand-carpenter-profile.webp'],
  efootball: ['efootball/home-screen.webp', 'efootball/team-select.webp', 'efootball/line-up-screen.webp'],
}
await mkdir('public/videos', { recursive: true })
await mkdir('/tmp/project-preview-frames', { recursive: true })
for (const [name, screens] of Object.entries(tours)) {
  if (process.argv[2] && process.argv[2] !== name) continue
  const frames = []
  for (const [index, screen] of screens.entries()) {
    const frame = '/tmp/project-preview-frames/' + name + '-' + index + '.png'
    await compose(screen, accents[name], frame)
    frames.push(frame)
  }
  await sharp(frames[0]).webp({ quality: 88 }).toFile('public/videos/' + name + '-poster.webp')
  const inputs = [...frames, frames[0]].flatMap(frame => ['-i', frame])
  const filters = [0, 1, 2, 3].map(i => '[' + i + ':v]zoompan=z=\'min(1+0.0009*on,1.07)\':x=\'iw/2-(iw/zoom/2)\':y=\'ih/2-(ih/zoom/2)\':d=' + (i === 3 ? 9 : 72) + ':s=1200x900:fps=24,setsar=1,format=yuv420p[v' + i + ']')
  filters.push('[v0][v1]xfade=transition=fade:duration=0.35:offset=2.65[a]', '[a][v2]xfade=transition=fade:duration=0.35:offset=5.3[b]', '[b][v3]xfade=transition=fade:duration=0.35:offset=7.95[out]')
  const output = 'public/videos/' + name + '-preview.mp4'
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...inputs, '-filter_complex_threads', '1', '-filter_complex', filters.join(';'), '-map', '[out]', '-t', '8.3', '-an', '-c:v', 'libx264', '-threads', '2', '-crf', '25', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', output])
  console.log(name + ': ' + Math.round((await stat(output)).size / 1024) + ' KB')
}
