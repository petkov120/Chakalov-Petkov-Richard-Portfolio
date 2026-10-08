# Portfolio interaction row

> **Superseded.** The rail now lives in `src/components/stage/` (`Stage.jsx`, `wall.js`). Investment and Notepad appear in it labelled "Early flow study". The notes below describe the older `ZoomExplorations` version.

The horizontal phone row in the opening thought and `/interactions` renders the existing X redesign from the UI maker. It does not cycle screenshots or substitute a new interaction concept.

- `src/data/mind/projects.js`: `zoomExplorations` defines six demonstrations using existing maker screen IDs and controls: newest posts, profile peek, composing/publishing, creator tools, video editing, and splash.
- `src/components/mind/ZoomExplorations.jsx`: native horizontal scrolling, mouse drag, swipe, keyboard and arrow navigation, replay, visibility and pause controls.
- `src/components/mind/StudioInteractionPreview.jsx`: a presentation-only adapter importing the original `SocialUI`. Shadow DOM isolates its styling; an inert preview prevents source-component autofocus from moving the portfolio or capturing keyboard input. The original status bar supplies its own island, so the mockup adds no second island.
- `src/components/mind/interaction-rail.css`: responsive graphite phone frames and portfolio styling. Each screen retains the maker's 390 × 844 proportions.

Only nearby previews mount. Up to three central visible studies play on desktop; one plays on narrow screens. Hidden/offscreen previews and the video editor playhead pause. Reduced-motion visitors receive resting screens with explicit replay. The live demonstration's buttons are driven through the existing maker control handlers, with no changes under `src/ui/`.

Investment and Notepad currently contain placeholder canvases, so they are not presented as finished work. When those interactions are ready, add a corresponding adapter and curated sequence. An exported approved clip can also be supported later; no `ui/*/final.mp4` files were present for this change.

The existing entrance, optical typography, work shelf, case-study book, and About arrangement are preserved. The previous standalone card-removal concept is no longer the interactions archive's featured presentation; its older direct route remains available.
