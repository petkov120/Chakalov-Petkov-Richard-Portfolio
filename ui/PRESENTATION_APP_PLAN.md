# Mobile interaction presentation app

## Working idea

A focused tool for designing, sequencing, presenting, and recording polished mobile UI interactions.

Instead of preparing static mockups in one tool, motion in another, and a portfolio presentation in a third, a designer can build a sequence of phone-sized states, connect the transitions, preview the complete story, and export a clean video.

This idea grew out of the portfolio's `/ui` workbench. Keep that workbench useful now, while treating a standalone product as a later project rather than expanding the portfolio code indefinitely.

## Product promise

Turn a set of mobile screens into a convincing interaction presentation without requiring a full production application or professional video-editing workflow.

## Primary user

Independent product designers and design engineers who need to:

- Present interaction thinking, not only finished screens.
- Create short portfolio videos.
- Demonstrate alternative states and edge cases.
- Share believable prototypes with clients or teammates.
- Control the framing and pacing of a product story.

## Core job

“I have several interface states. Help me turn them into a clear, polished interaction story that I can present or export.”

## Principles

1. The interface remains secondary to the product being presented.
2. A useful interaction story is more important than decorative motion.
3. Every transition should explain an action, response, or change of state.
4. A designer should obtain a strong result without learning video-editing software.
5. Exports should look intentional enough to place directly in a portfolio.
6. The tool should accept real designs instead of generating generic-looking UI.

## Current prototype

The portfolio already contains an early version at `/ui` with:

- A 390 × 844 phone canvas.
- Multiple project workspaces.
- Named screen states.
- Manual state navigation.
- Automatic sequence playback.
- Clickable interactions inside the X redesign.
- A clean environment that can be screen-recorded.
- Project briefs and recording folders under `ui/`.

This prototype proves the presentation model, but it is not yet a standalone authoring product.

## MVP

### 1. Project setup

- Create a project.
- Choose a phone canvas or define custom dimensions.
- Add a name, description, cover, and output aspect ratio.
- Import PNG, WebP, SVG, or MP4 assets.

### 2. Screen states

- Add, remove, duplicate, rename, and reorder states.
- Show each state as a thumbnail.
- Edit the duration of each state.
- Keep a visible distinction between screen states and transitions.

### 3. Interaction connections

- Select an element or hotspot.
- Connect it to another state.
- Support tap, long press, swipe, drag, and timed transitions.
- Define a back or dismiss action.
- Preview the interaction directly on the phone canvas.

### 4. Motion controls

- Fade, slide, scale, spring, shared-element, overlay, and dissolve.
- Duration and easing controls.
- Entry and exit motion.
- Motion blur as an optional presentation effect.
- Reduced-motion preview.

### 5. Presentation mode

- Hide all editing controls.
- Center the device on a clean stage.
- Choose a background color, gradient, grain, or image.
- Play manually or automatically.
- Restart the sequence with one action.

### 6. Export

- Export MP4 and WebM.
- Export a transparent-background video where supported.
- Choose 30 or 60 fps.
- Export a poster frame.
- Loop the beginning and ending cleanly.

## Suggested authoring model

```text
Project
└── Scene
    ├── Screen state
    ├── Hotspots
    ├── Transition out
    ├── Duration
    └── Optional narration note
```

A project contains one or more scenes. A scene represents a focused interaction such as “publish a post,” not an entire application.

## Example workflow

```text
Import feed.png
→ Import profile-preview.png
→ Draw a hotspot over the avatar
→ Connect avatar tap to profile preview
→ Set transition to overlay + spring
→ Add tap-outside dismissal
→ Preview
→ Add composer states
→ Play complete sequence
→ Export 8-second MP4
```

## Roadmap

### Phase 0 — Portfolio workbench

- Keep `/ui` stable and unlinked from public navigation.
- Finish the Investment, Notepad, and X interaction studies.
- Record real MP4s and use them in the homepage gallery.
- Note recurring authoring problems while using the workbench.

Success signal: three strong portfolio interactions can be produced without manually editing their videos afterward.

### Phase 1 — Local authoring MVP

- Move the workbench into its own application.
- Add persistent project data.
- Add asset import and screen reordering.
- Add hotspot-based navigation.
- Add a small transition library.
- Add presentation mode.
- Export through browser recording or a local rendering process.

Success signal: another designer can create and export an interaction without editing source code.

### Phase 2 — Motion and storytelling

- Timeline with scene duration.
- Shared-element transitions.
- Device gestures and cursor/touch indicators.
- Camera movement, depth, spotlight, blur, and grain effects.
- Text annotations and optional captions.
- Reusable presentation themes.

Success signal: designers can reproduce the quality of a hand-edited portfolio reel inside the product.

### Phase 3 — Sharing and collaboration

- Shareable presentation links.
- Viewer comments tied to a state or timestamp.
- Version history.
- Team libraries and reusable interaction patterns.
- Figma import or plugin workflow.

Success signal: teams use shared links during design reviews instead of sending raw screen recordings.

### Phase 4 — Productisation

- Authentication and cloud project storage.
- Templates marketplace or curated starter library.
- Usage limits and paid export tiers.
- Desktop application if local rendering provides better quality.
- Public launch site, onboarding, documentation, and examples.

## Technical direction

### Near term

- React for the editor and preview surface.
- CSS transforms and Web Animations API for common motion.
- A JSON project document for screens, hotspots, transitions, and timing.
- IndexedDB or local files for the first persistent version.
- Browser MediaRecorder for early video exports.

### Later

- Remotion or a dedicated rendering process for deterministic exports.
- Canvas or WebGL only for effects that CSS cannot render reliably.
- Figma API or plugin integration for screen imports.
- Cloud object storage for assets and exported videos.

## Important technical spike

Before committing to a rendering architecture, test the same 8-second interaction through:

1. Browser MediaRecorder.
2. Headless-browser frame capture with FFmpeg encoding.
3. Remotion.

Compare visual fidelity, font rendering, dropped frames, motion blur, export time, and deployment complexity.

## Data model sketch

```js
{
  id: 'x-publish-flow',
  canvas: { width: 390, height: 844 },
  theme: { background: '#000000' },
  scenes: [
    {
      id: 'feed',
      asset: 'feed.png',
      duration: 1200,
      hotspots: [
        {
          trigger: 'tap',
          bounds: { x: 24, y: 188, width: 44, height: 44 },
          target: 'profile-peek',
          transition: { type: 'overlay', duration: 320, easing: 'spring' }
        }
      ]
    }
  ]
}
```

## What not to build first

- A general-purpose design editor.
- Full vector drawing tools.
- An AI interface generator.
- Complex multi-user collaboration.
- A large template marketplace.
- Desktop, tablet, and web presentation modes simultaneously.
- Advanced video editing unrelated to interface demonstrations.

The first product should remain excellent at one narrow job: turning designed mobile screens into clear interaction videos.

## Open questions

- Is the main input static screen exports, live React components, or both?
- Should the first version be local-only or immediately shareable?
- Is deterministic MP4 export essential for MVP, or is presentation mode enough?
- Should motion be configured visually or through opinionated presets?
- How much device chrome should the product generate automatically?
- Are users willing to prepare separate states, or do they expect editable design layers?

## Validation plan

1. Use the workbench to complete the three current portfolio concepts.
2. Record the time and friction involved in each one.
3. Give the workbench to two other designers without explaining the code.
4. Observe which controls they expect and where the mental model fails.
5. Build only the authoring features required to remove repeated friction.

## Next decision

Finish one excellent X interaction video using the current workbench. After export, document every manual workaround. Those workarounds become the initial product backlog for the standalone MVP.
