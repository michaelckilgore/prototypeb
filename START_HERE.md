# Sugar Hill Weather Dashboard — Start Here

Read these documents first, in this order:

1. `design/developer_orientation.md`
2. `design/architecture_rules.md`
3. `design/data-sources.md`
4. `design/data-contracts.md`
5. `design/alerts_architecture.md`
6. `design/decisions.md`

## Project Summary

Sugar Hill is a TV-style local weather dashboard for Sugar Hill, Indiana.

- Frontend: static HTML/CSS/JS
- Backend: Node.js + Express
- Frontend polls backend only
- Backend polls Tempest and NWS APIs and returns simplified JSON to the client

## Current Backend Endpoints

- `/api/tempest/current`
- `/api/nws-forecast`
- `/api/nws-forecast-detailed`
- `/api/nws-alerts`
- `/api/regional-temps`
- `/api/history/temperature`
- `/api/history/pressure`
- `/api/tempest/lightning`
- `/api/spc-watches`

## First Principles

- Do not re-break Tempest parsing.
- Keep the frontend lightweight for Fire TV / Silk.
- All external polling belongs in the backend.
- Preserve screen rotation compatibility with alert/watch overrides.
- When delivering documentation updates, prefer repo-ready Markdown files over long chat dumps.
