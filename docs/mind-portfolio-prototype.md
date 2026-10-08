# Welcome to my mind — first vertical prototype

> **Current flow (Oct 2026).** The entrance states who this is and what shipped, with "See the work" and a "Skip intro" link; it plays once per visit (sessionStorage). The gallery rail (`src/components/stage/`) is grouped, not interleaved: live work, then prototypes, then side projects, so Clinify is first. Every piece carries its work type on the card. `/work` renders the same list from `buildWall`. Nav About goes to `/#about` (facts block); the manga story stays at `/about`. Sections below that describe `CaseStudyBook`, `ZoomTextScene` and the alternating overview are historical.

## Scope and protected code

The public portfolio now has an independent implementation in `src/pages/MindPortfolioPage.jsx` and `src/components/mind/`. The `/ui` interaction maker, `src/ui/`, `ui/`, its export scripts, dependencies, and Vite configuration are outside this change. Existing case-study evidence, images, fonts, the playground, and legacy pages are preserved.

## Existing stack and architecture

- React 18.3, Vite 5, Tailwind 3, plain CSS; no motion or WebGL dependencies added.
- The existing pathname route map remains in `src/App.jsx`. New portfolio routes use the same page shell.
- `/` is the entrance; `/#work` bypasses it. `/interactions` is the first archive view.
- `/work/clinify?page=3` opens the book at a logical page, without onboarding. Page turns replace the current history entry. Opening a book or review creates one entry; Back closes it.
- `/interactions/card-removal` opens the independent interaction review.
- Existing `/clinify`, `/universityx`, `/playground`, `/notes`, and `/ui` continue to resolve.

## Experience and components

`EntranceScene` builds a floating paper collage around the supplied halftone computer. Notes and Figma, Cursor, and VS Code logo tiles drift independently, react to pointer movement, and lift when clicked. Both Enter and the computer measure the yellow screen and move the camera through it; the actual portfolio mounts behind the entrance during the transition. The portfolio remains inert until the entrance completes, then receives keyboard focus. Pause motion stops ambient and click animation; reduced motion uses a short fade. The sharper supplied transparent computer-and-brain artwork lives in `public/images/entrance/mind-computer.png`. It is displayed intact; its screen reveals the live yellow tunnel on hover, keyboard focus, or entry. The Figma logo is SVG; Cursor and VS Code logos reuse the installed applications’ branding assets. `ZoomTextScene` derives movement from native scroll progress and measures the focal word. Its choreography is reusable for EXISTED and HUMAN. The overview alternates a thought, a live interaction, another thought, a closed book, and a quieter continuation/About section.

`CardDemo` is a new portfolio-only concept. It demonstrates removal and persistent undo while sufficiently visible. Manual use stops the automatic loop. Hidden and reduced-motion states do not run the demonstration. It uses real DOM controls, not a recording of the interaction maker.

`BookObject` composes a cover, spine, back board, and page block in CSS perspective. `CaseStudyBook` provides pickup/opening, DOM spreads, hinged page turns, a close/return sequence, and a simple reader option. The reader module loads on demand. `src/data/mind/projects.js` adapts real Clinify evidence into six editorial pages; it does not invent outcomes.

## Motion and technology

- Semantic text, navigation, annotations, scroll scenes, and the interaction remain DOM/CSS.
- Scroll updates use requestAnimationFrame; geometry recalculates with ResizeObserver.
- Book state distinguishes lifting, reading, closing, and returning; page-turn state prevents competing turns.
- Timing constants and CSS timing variables are shared within the new portfolio system.
- The current physical-book prototype uses CSS hinges and shading. It does not simulate deformable paper geometry. A later refinement can use a single lazy-loaded WebGL book renderer for curved paper and lighting, while retaining the current DOM content and controls.
- No video is needed for this first live interaction. Future recorded studies still need muted inline autoplay, visibility arbitration, blocked-autoplay controls, posters, and failure handling.

## Responsive and fallback strategy

Phones use a vertical entrance collage with an independently scrollable onboarding surface, shorter typographic travel, a front-facing book, and one page at a time. The screen zoom preserves the onboarding scroll position when its camera origin is measured. Short landscape viewports also use a single page. Pointer hover enhancement is capability-gated and optional. Previous/Next controls remain available alongside swipe and keyboard arrows.

Native dialogs handle modal focus boundaries. Opening and closing preserve focus and the work context. Reduced motion uses static typographic sections, direct interaction state changes, and a simple book presentation. The explicit simple reader removes the physical cover and turning sheet. All book copy remains semantic DOM content, including when CSS 3D is unavailable.

## Performance risks and next scope

The prototype adds no 3D engine or video payload. Main risks are existing application-wide imports, oversized screenshots, very large transformed glyphs, and future book textures/video. Do not add several active canvases or preload every case study. A future curved-page implementation should render only the active book and dispose resources when closed.

This is the first complete interaction-language prototype, not the conversion of every existing project. UniversityX and the other existing pages retain their original presentation. Next: review the experience, refine optical/book choreography, then expand the content model and case-study library. Validate on physical Safari/iOS/Android devices before production release; headless Chrome cannot establish mobile GPU performance or touch-browser behavior.
