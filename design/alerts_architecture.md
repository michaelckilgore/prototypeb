# Alerts Architecture

## Local alerts

Local alerts are loaded from the NWS active alerts endpoint using the configured home point.

Current backend process:
1. query active alerts for the home point
2. extract properties from each feature
3. reduce each alert to a simplified object for the frontend

Current alert fields returned to frontend:
- event
- headline
- description
- area
- expires
- ends

## SPC watch detection

The route name is intentionally kept as `/api/spc-watches` for client compatibility.

The backend currently detects watches by querying NWS nationwide active alerts for:
- Tornado Watch
- Severe Thunderstorm Watch

## Watch number extraction

Watch numbers are extracted by scanning these fields:
- headline
- description
- event
- VTEC
- WMOidentifier

Current pattern matching supports forms such as:
- `Tornado Watch 123`
- `Severe Thunderstorm Watch 456`
- `Watch 789`
- `WW 321`
- VTEC style fragments such as `.A.0123.`

## Current watch response

The backend returns:
- a sorted list of active watch numbers

This is sufficient for a basic watch-rotation system but is not yet a rich watch model.

## Future alert-system goals

- severe thunderstorm warning screen logic
- tornado warning screen logic
- tornado emergency treatment
- richer watch objects
- local vs regional severity prioritization
- cleaner override handling in screen rotation
