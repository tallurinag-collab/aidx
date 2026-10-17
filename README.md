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

## Travel orders and app server

The Spring Boot app serves the built website on port `8080` and handles travel order HTTP requests:

- `POST /api/orders` validates traveler details and trip dates, then returns `201 Created` with an order ID and `RECEIVED` status.
- `GET /api/orders/{id}` returns an order created by the running app instance.
- `GET /actuator/health` is used by the AKS startup probe; readiness and liveness probes use the corresponding Actuator endpoints.

To run locally, start the Spring Boot app with Java 21 and Maven in one terminal (`mvn spring-boot:run`), then run `npm run dev` in another. Vite forwards `/api` calls to `http://localhost:8080`.

The trip page’s **Place order** action submits a travel booking request to the app server. The current implementation is a demo: orders are held in memory on one app instance, are lost when it restarts, and do not charge a payment method or confirm provider availability. Use durable shared storage and a booking/payment provider before accepting real customer orders.

The Docker image builds the website and Spring Boot server together, then serves both from port `8080`.

## Project structure

- `index.html` — Vite HTML entry point
- `src/App.tsx` — page composition
- `src/components/` — navigation, page sections, and reusable cards
- `src/styles.css` — global styles and responsive layout
- `tsconfig.json` — TypeScript compiler settings
- `pom.xml` — Maven and Spring AI configuration

The frontend uses React 19, TypeScript, and Vite 8. Node.js 20.19+ or 22.12+ is required by Vite.
