# Portfolio

Editorial portfolio site. Vite + React + Tailwind. Deploys to Vercel.

## Run locally

```bash
npm install
npm run dev
```

Opens at http://localhost:5173

## Project map

- **`src/pages/MindPortfolioPage.jsx`** — homepage, positioning, about, and contact
- **`src/data/mind/profile.js`** — roles, dates, skills and links; the About section and `/resume` both read it
- **`src/pages/ResumePage.jsx`** — `/resume`, a printable resume (Download PDF prints the page)
- **`src/data/mind/projects.js`** — homepage case studies and interactive projects
- **`src/data/clinifyEvidence.js`** — Clinify case-study content
- **`src/data/universityxEvidence.js`** — UniversityX case-study content
- **`src/components/mind/`** — homepage sections, interactions, and styling
- **`src/pages/`** — route-level pages
- **`src/App.jsx`** — routes and page themes
- **`index.html`** — title, metadata, fonts, and favicon

### Add images

1. Drop image files into `public/images/`
2. Reference them in the relevant file under `src/data/` like:
   ```js
   images: [
     { src: '/images/schedule-batch.png', alt: 'Schedule Batch flow', caption: 'Step 1 of 4: channel selection' },
   ]
   ```
3. Optional dark/light variants for one screenshot slot:
   ```js
   images: [
     {
       srcLight: '/images/member-search-light.png',
       srcDark: '/images/member-search-dark.png',
       alt: 'Member Search flow',
       caption: 'ID-first lookup',
     },
   ]
   ```

Case-study image objects support descriptive alt text and captions. Keep those populated when adding new evidence.

### Change the visual system

The homepage system lives in `src/components/mind/home.css` and `src/components/mind/entrance.css`; the gallery rail in `src/components/stage/`. Shared palette and font tokens also live in `tailwind.config.js`.

### Change the fonts

In `index.html`, swap the Google Fonts URL.
In `tailwind.config.js`, update the `fontFamily` block.

Current pairing: Instrument Serif (display), Inter (body), JetBrains Mono (small caps), and the collage handwriting face defined in CSS.

## Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Follow the prompts. First deploy creates the project; subsequent `vercel --prod` pushes go live.

Or push to GitHub and import the repo at vercel.com.

## Build for production

```bash
npm run build
```

Outputs to `dist/`.
