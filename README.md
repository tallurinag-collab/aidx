# aidx
AI Driven Digital Transformation

## Frontend

The landing page is built with React, TypeScript, and Vite. React components live in `src/components`, with the app entry point in `src/main.tsx`.

```bash
npm install
npm run dev
```

Run `npm run build` to create the production bundle in `dist/`.
Run `npm run typecheck` to check TypeScript without creating a build.

## Project structure

- `index.html` — Vite HTML entry point
- `src/App.tsx` — page composition
- `src/components/` — navigation, page sections, and reusable cards
- `src/styles.css` — global styles and responsive layout
- `tsconfig.json` — TypeScript compiler settings
- `pom.xml` — Maven and Spring AI configuration

The frontend uses React 19, TypeScript, and Vite 8. Node.js 20.19+ or 22.12+ is required by Vite.
