# Severe Weather Module

## Purpose
Define the behavior of the **Local Severe Weather Module** used in the screen rotation system.

This module displays **SPC watches** and **NWS warnings** as rotating screens.

The design prioritizes **reliability and clarity during live severe weather events**.

## Module Structure

Two reusable templates will be used:

- `subscreen-watch.html`
- `subscreen-warning.html`

These templates dynamically render content using query parameters.

### Watch Screen

`subscreen-watch.html?spc=<watch_number>`

Example:

`subscreen-watch.html?spc=214`

The page loads the SPC watch data for that watch number.

### Warning Screen

`subscreen-warning.html?id=<nws_alert_id>`

Example:

`subscreen-warning.html?id=NWS-IDP-PROD-4091234-3509876`

The page loads the matching NWS alert.

## Data Sources

### SPC Watches

Source:
`https://www.spc.noaa.gov/products/watch/`

Later versions may parse the SPC watch JSON feed.

Each watch is uniquely identified by:
`SPC Watch Number`

Example:
`Tornado Watch #214`

### NWS Warnings

Source:
`https://api.weather.gov/alerts/active`

Each alert includes a unique identifier:
`id`

Example:
`NWS-IDP-PROD-4091234-3509876`

This ID will be used to load the warning screen.

## Prototype Behavior (Initial Implementation)

For the first operational test:

### Always include

`Sample Watch Screen`

This ensures the module always appears in rotation even if no real events exist.

### Watches

Include:
`All active national SPC watches`

Limit:
`Maximum 10 watches`

### Warnings

Include:
`All active Indiana warnings`

Limit:
`Maximum 10 warnings`

## Rotation Behavior

Severe weather screens **do not stop the normal rotation**.

They are inserted into the normal screen sequence.

Example rotation:

- Main Screen
- Sample Watch
- Current Conditions
- National Watch #214
- Regional Temperatures
- Indiana Warning
- Extended Forecast
- National Watch #215
- Current Conditions

## Color Palette

For prototype testing:

### Watches
- Tornado Watch → red palette
- Severe Thunderstorm Watch → yellow palette

### Warnings
- Tornado Warning → red palette
- Severe Thunderstorm Warning → yellow/orange palette

For the prototype no further differentiation is required.

## Audio Alerts (Prototype)

Two alert sounds will be used.

### Watch Activation
`single soft notification`

### Warning Activation
`strong alert tone`

Audio should trigger **only when a new alert appears**, not when the screen rotates back into view.

## Screen Limits

To prevent rotation overload:

- max 10 watches
- max 10 warnings

These limits may be exceeded by one item if required for local relevance in future versions.

## Future Improvements (Not Required for Prototype)

Planned enhancements include:

- local polygon intersection detection
- radar polygon overlay
- priority weighting for nearby warnings
- countdown timers for warning expiration
- audible escalation for tornado warnings
- multi-state regional filtering
- dynamic screen ordering based on threat severity

## Known Issues

Current prototype does **not yet prioritize local counties**.

Prototype filtering uses:
`Indiana warnings only`

This will be replaced later with polygon-based local filtering.

## Related Files

- `subscreen-watch.html`
- `subscreen-warning.html`
- `rotation-controller.js`
