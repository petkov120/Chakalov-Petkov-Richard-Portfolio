# Portfolio

Editorial portfolio site. Vite + React + Tailwind. Deploys to Vercel.

## Run locally

```bash
npm install
npm run dev
```

Opens at http://localhost:5173

## Customize

Everything you need to edit is in three places:

- **`index.html`** — page title, meta description
- **`src/components/Hero.jsx`** — your name, nav links
- **`src/data/chapters.js`** — case study text (edit prose here)
- **`src/components/About.jsx`** — about section
- **`src/components/Footer.jsx`** — email, social links
- **`src/components/OtherWork.jsx`** — secondary projects

### Add images

1. Drop image files into `public/images/`
2. Reference them in `src/data/chapters.js` like:
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

Each image gets a soft border, white background card, and optional caption.

### Change the colors

In `tailwind.config.js`, the palette is:

- `paper` (background, warm off-white)
- `ink` (primary text, near-black)
- `muted` (secondary text)
- `rule` (border lines)
- `accent` (the rust-red on the email link)

Change any value, save, refresh.

### Change the fonts

In `index.html`, swap the Google Fonts URL.
In `tailwind.config.js`, update the `fontFamily` block.

Current pairing: Instrument Serif (display) + Inter (body) + JetBrains Mono (small caps / labels).

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
