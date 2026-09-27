# The Tape Reader's Notebook

An interactive trading-education notebook: candles, market structure, indicators, risk management, and psychology — with a demo trade journal, a position-size calculator, a trading-plan form, and a knowledge-check quiz built in. Presented as a paginated e-book reader, one lesson per screen.

## Project structure

```
index.html              content + markup for all 116 lessons, one <section> per <div class="page">
src/
  styles/
    main.css            Tailwind directives + design tokens (@layer base)
                         + component styles: reader shell, cards, notes, forms, quiz, TOC drawer (@layer components)
  js/
    main.js             entry point — wires up all interactive features
    reader.js            paginated e-book navigation: edge clicks, swipe, TOC drawer + filter, resume bookmark
    progress.js           per-lesson "mark read" state + progress bar (localStorage)
    theme.js               light/dark theme toggle (localStorage)
    journal.js              demo trade journal (Section 26, localStorage)
    riskCalculator.js       position size calculator (Section 17)
    plan.js                  trading plan form (Section 25, localStorage)
    quiz.js                   knowledge-check scoring (Section 31)
  images/                the reference charts/diagrams used throughout
```

Design tokens (colors, fonts) live as CSS custom properties in `src/styles/main.css` under `@layer base`, with light/dark variants handled via `prefers-color-scheme` and an optional `data-theme` override. Layout- and utility-level styling (grids, spacing, tags) uses Tailwind classes directly in `index.html`; multi-property, reusable UI patterns (`.card`, `.note`, `.quiz-q`, `.journal-form`, `.toc-drawer`, etc.) stay as named component classes under `@layer components` — the standard Tailwind recommendation for anything more than a one-off utility combo.

## Running it

```bash
npm install
npm run dev       # dev server with hot reload, http://localhost:5173
npm run build     # outputs a single self-contained dist/index.html
npm run preview   # serve the production build locally
```

The production build uses `vite-plugin-singlefile` to inline the compiled CSS, JS, and images into one `dist/index.html` — useful if you want to hand the whole notebook to someone (or publish it somewhere) as a single file, without maintaining a separate bundled copy by hand.

## Deploying

It's a static site: build command `npm run build`, publish directory `dist` (a single self-contained `index.html`, images included). No server, environment variables or redirects needed.

- **Netlify** — import the GitHub repo; `netlify.toml` already sets the build command, publish directory and Node 22.
- **Vercel** — import the repo and keep the auto-detected **Vite** preset (build `npm run build`, output `dist`).
- **Lovable** — not a fit: it only supports React/TypeScript/Vite projects, and this one is vanilla JS.

## Notes for future edits

- Every lesson lives in `index.html` as a `<section id="...">` wrapped in its own `<div class="page">`, in reading order, linked from the `<ol id="tocList">` drawer (opened via the "Contents" button, filterable by title). Adding a lesson means: a new `.page`/`.section` block with the next sequential `<span class="num">`, a matching `<li>` in `#tocList`, and (if it's the last lesson before the glossary) bumping the glossary's own number and the `0 / N read` label in the drawer — `progress.js` computes the live count itself, so only that one static label needs updating by hand.
- Cross-references between lessons ("Section NN") are plain text, not links — they don't get renumbered automatically, so double-check them (and the glossary's "N" numbers) any time lessons are inserted or reordered rather than appended at the end.
- Diagrams are hand-authored inline `<svg>` — no charting library. They use `currentColor` and the CSS custom properties so they stay legible in both themes.
- The journal, plan, quiz, reading-progress, and last-page bookmark all persist to `localStorage` under distinct keys (`tape_reader_journal_v1`, `tape_reader_plan_v1`, `tape_reader_progress_v1`, `tape_reader_page_v1`, `tape_reader_theme_v1`, `tape_reader_hint_seen_v1`; no persistence for quiz scores) — private to whichever browser opens the page.
