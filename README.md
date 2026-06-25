# Side Quest

A lightweight Vite + React single-page app that feels like a cozy indie-game digital postcard. The quest room lets visitors choose a creative class, pick a generated soundtrack vibe, save a tiny sketch, collect mood fragments, and unlock a final Designer Artifact card.

## Features

- Cozy pixel-inspired quest room with four interactive objects.
- Character class picker with playful stats.
- Music vibe picker with soft generated Web Audio tones.
- Touch-friendly canvas sketch tool with brush controls.
- Hidden Python-ish helper easter eggs placed around the site.
- Local progress persistence with `localStorage`.
- Final artifact card with copy, palette copy, sketch download, and reset actions.
- Responsive layout for desktop and mobile.
- GitHub Pages deployment workflow.

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deployment

The app is configured for GitHub Pages with Vite `base: './'`.

Deployment is handled by `.github/workflows/deploy.yml`. On every push to `main`, GitHub Actions installs dependencies, builds the app, uploads `dist`, and deploys it to GitHub Pages.

All quest progress stays local in the browser.
