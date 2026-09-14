# Mobile interaction studio

This folder is for designing the mobile interactions shown at the top of the portfolio.
The work here stays separate from the production site until an interaction is ready.

## Open the live workbench

From the repository root, run:

```bash
npm run dev
```

Then open `http://localhost:5173/ui`.

The workbench previews a 390 × 844 phone canvas. Edit the matching component in
`src/ui/projects/` and save; the browser updates automatically.

### Cursor zoom

Move the mouse over the phone to ease into a subtle 1.08× zoom of the whole device. The view follows
the pointer, then fades back to its normal framing when the pointer leaves.
Use **Cursor zoom** in the studio header to turn this effect off for editing or
to compare the presentation. Clicks and drags keep their targets stationary
until release. Touch devices and reduced-motion preferences use the normal view.

## Folder contract

Each concept contains:

- `brief.md` — the interaction story and required screens.
- `screens/` — numbered PNG or WebP exports from Figma.
- `recordings/` — draft screen recordings.
- `final.mp4` — the approved silent loop delivered to the portfolio.

Use numbered filenames so the intended sequence remains unambiguous:

```text
01-start.png
02-action.png
03-response.png
04-resolved.png
```

## Export a presentation

Click **Export** in the studio header. The phone you are already using moves
into a clean 4:5 presentation frame; your current edits and interaction state
are kept. The backdrop follows the studio's light/dark theme.

- **Download cover:** WebP or PNG, rendered at 1080 × 1350. This saves the
  current screen, including entered text and scroll position, without the pointer.
- **Record interaction:** in desktop Chrome or Edge, choose **this studio tab**
  in the browser sharing picker. After the three-second countdown, interact with
  the phone or press **Play sequence**. Use **Stop** (or Escape) when finished,
  then **Download MP4**. Recording stops automatically after 30 seconds, or if
  you switch away from the tab. The sidebar and countdown stay outside the crop.

Videos are silent H.264 MP4, 1080 × 1350, 30 fps, with fast-start metadata.
Recording captures the actual browser rendering, including the cursor zoom,
CSS motion and pointer indicator. Unlike covers, its source detail depends on
the visible tab's capture resolution. The panel warns when that source is smaller
than the output. Use a large window or high-density display for sharper video;
enlarging a low-resolution recording cannot restore detail. Keep the presentation
visible while recording. Short 8–15-second, single-interaction clips work well.

MP4 conversion runs **locally** through the Vite development server and needs
`ffmpeg` on your PATH (already installed on this workstation). No external upload
service is used. Temporary conversion files are removed after each job. If
conversion fails, you can download the original WebM/MP4 recording and convert
it later. Cover downloads also work in the built site; the local MP4 endpoint
is intentionally absent there. `/ui` itself is unlinked, not authenticated.

Cover export uses a DOM snapshot. Put imagery in `public/` to avoid cross-origin
image restrictions. Browser-only effects such as backdrop blur can differ in a
still; check the exported cover before publishing.

To verify the converter (requires FFmpeg and ffprobe):

```bash
npm run test:ui-export
```

## Screen-only portfolio recording specification

- Canvas: 390 × 844 px or another consistent modern-phone ratio.
- Duration: 6–12 seconds.
- Format: MP4, H.264, no audio.
- Frame rate: 30 or 60 fps.
- Start and end on compatible frames so the loop does not jump.
- Show one meaningful interaction per recording.
- Keep the cursor and device chrome out of the recording.

These screen-only guidelines are for the homepage's existing mobile slots.
The Export feature above creates a separate framed presentation for social
sharing, with device chrome and the interaction pointer included in videos.

When a flow is finished, place the recording at `ui/<concept>/final.mp4`. It can then be optimized and connected to the homepage gallery.

## Quality check

Before exporting, the interaction should answer four questions without explanatory text:

1. Where am I?
2. What can I do?
3. What changed after I acted?
4. How do I know the action succeeded?
