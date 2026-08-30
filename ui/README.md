# Mobile interaction studio

This folder is for designing the mobile interactions shown at the top of the portfolio.
The work here stays separate from the production site until an interaction is ready.

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

## Recording specification

- Canvas: 390 × 844 px or another consistent modern-phone ratio.
- Duration: 6–12 seconds.
- Format: MP4, H.264, no audio.
- Frame rate: 30 or 60 fps.
- Start and end on compatible frames so the loop does not jump.
- Show one meaningful interaction per recording.
- Keep the cursor and device chrome out of the recording.

When a flow is finished, place the recording at `ui/<concept>/final.mp4`. It can then be optimized and connected to the homepage gallery.

## Quality check

Before exporting, the interaction should answer four questions without explanatory text:

1. Where am I?
2. What can I do?
3. What changed after I acted?
4. How do I know the action succeeded?

