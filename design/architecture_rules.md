# Architecture Rules

## Rule 1 — Backend aggregation only

The frontend must never call external weather APIs directly.

All external API polling happens in the Node.js backend.

## Rule 2 — Lightweight frontend

The frontend must remain lightweight enough for Fire TV / Silk class devices.

Guidelines:
- avoid unnecessary libraries
- minimize DOM churn
- keep animations efficient
- prefer simple data contracts

## Rule 3 — Stable API contracts

Backend endpoints should preserve response shapes whenever possible. Frontend code should not have to guess field names.

## Rule 4 — Cache on the backend

The backend should cache and normalize external data so the frontend receives predictable payloads.

## Rule 5 — Screen rotation compatibility

Automatic rotation must remain compatible with alert and watch overrides.

Examples:
- warnings may interrupt normal rotation
- watch screens may be inserted dynamically
- forecast and local conditions screens should still recover cleanly after overrides

## Rule 6 — Exact route names matter

Use the real backend route names already implemented in `server.js`:

- `/api/tempest/current`
- `/api/nws-forecast`
- `/api/nws-forecast-detailed`
- `/api/nws-alerts`
- `/api/regional-temps`
- `/api/history/temperature`
- `/api/history/pressure`
- `/api/tempest/lightning`
- `/api/spc-watches`

Do not casually rename routes in discussion or implementation without updating both frontend and backend.

## Rule 7 — Preserve Tempest parsing reliability

Do not break working Tempest parsing while adding features. Tempest field extraction is a core dependency for the dashboard.

## Rule 8 — Documentation delivery preference

For substantial documentation updates, prefer creating repo-ready Markdown files rather than streaming long text into chat.

When practical, documentation handoff should be packaged in a ZIP suitable for direct upload to GitHub or local project folders.
