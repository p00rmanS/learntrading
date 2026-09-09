# The Tape Reader's Notebook

An interactive trading-education notebook: candles, market structure, indicators, risk management, and psychology — with a demo trade journal, a position-size calculator, a trading-plan form, and a knowledge-check quiz built in.

## Project structure

```
index.html              content + markup for all 32 lessons
src/
  styles/
    main.css            Tailwind directives + design tokens (@layer base)
                         + component styles: cards, notes, forms, quiz (@layer components)
  js/
    main.js             entry point — wires up the four interactive features
    journal.js           demo trade journal (Section 26, localStorage)
    riskCalculator.js    position size calculator (Section 17)
    plan.js               trading plan form (Section 25, localStorage)
    quiz.js               knowledge-check scoring (Section 31)
public/
  images/                the reference charts/diagrams used throughout
```

Design tokens (colors, fonts) live as CSS custom properties in `src/styles/main.css` under `@layer base`, with light/dark variants handled via `prefers-color-scheme` and an optional `data-theme` override. Layout- and utility-level styling (grids, spacing, tags) uses Tailwind classes directly in `index.html`; multi-property, reusable UI patterns (`.card`, `.note`, `.quiz-q`, `.journal-form`, etc.) stay as named component classes under `@layer components` — the standard Tailwind recommendation for anything more than a one-off utility combo.

## Running it

```bash
npm install
npm run dev       # dev server with hot reload, http://localhost:5173
npm run build     # outputs a single self-contained dist/index.html
npm run preview   # serve the production build locally
```

The production build uses `vite-plugin-singlefile` to inline the compiled CSS, JS, and images into one `dist/index.html` — useful if you want to hand the whole notebook to someone (or publish it somewhere) as a single file, without maintaining a separate bundled copy by hand.

## Notes for future edits

- All 32 lesson sections live directly in `index.html` as `<section id="...">` blocks, in reading order, linked from the `<nav class="rail">` table of contents near the top.
- Diagrams are hand-authored inline `<svg>` — no charting library. They use `currentColor` and the CSS custom properties so they stay legible in both themes.
- The journal, plan, and quiz all persist to `localStorage` under distinct keys (`tape_reader_journal_v1`, `tape_reader_plan_v1`, no persistence for quiz scores currently) — private to whichever browser opens the page.
