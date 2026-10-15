# AIDX Website Specification

## Purpose

Present AIDX as an AI-driven digital transformation partner that helps teams improve everyday work with practical, human-centered AI. The site should help prospective customers understand the approach and take a first step toward a conversation.

## Audience

Leaders and teams exploring how AI can improve their operations, workflows, and decision-making. The site should be clear to readers who are not AI specialists.

## Core message

AI should make work more useful and more human. AIDX helps organizations move from ideas to measurable progress by starting with people, designing around real workflows, and applying responsible oversight.

## Page structure

1. **Navigation** — AIDX identity and links to the platform, approach, about, and contact sections, with a clear contact action.
2. **Hero** — A concise value proposition, supporting description, primary contact action, link to the platform section, and a visual preview of AI-assisted team work.
3. **Principles strip** — Reinforce that solutions are built around people, real workflows, and business impact.
4. **Capabilities** — Explain human-centered AI, connected operations, and responsible progress in three concise feature cards.
5. **Approach** — Show a three-step process: start with people, design for impact, and learn and grow.
6. **Contact call to action** — Invite visitors to begin a conversation and identify a next step.
7. **Footer** — Repeat AIDX branding and provide a concise closing statement.

## Experience requirements

- Build the page as a responsive, single-page React application.
- Use semantic sections, accessible names for landmarks, and visible keyboard focus styles.
- Keep navigation and calls to action usable on touch and keyboard.
- Respect the user's reduced-motion preference.
- Maintain a calm, polished visual style with purple accents, clear typography, generous spacing, and readable contrast.
- Keep the language direct and avoid unsupported performance claims or fabricated customer proof.

## Technical constraints

- Frontend stack: React, TypeScript, and Vite.
- Keep page composition in `src/App.tsx`, reusable interface elements in `src/components/`, and global presentation rules in `src/styles.css`.
- The frontend must type-check and produce a production build using the repository's existing npm scripts.
- The existing project also includes Maven and Spring AI configuration; this landing-page specification does not define backend behavior or AI integrations.

## Out of scope

- User accounts, authentication, and personalized dashboards.
- Live AI agents, model selection, or workflow execution.
- Contact form submission or CRM integration.
- Pricing, customer testimonials, case studies, or quantified outcomes until verified content is provided.
