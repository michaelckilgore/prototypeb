# Module Architecture

## Purpose
Define how modules fit into the dashboard without requiring a full project restructuring.

A module is a reusable unit made up of:

- a screen template
- a data source
- optional trigger logic
- optional rotation logic

## Current Module Examples

Existing or emerging modules include:

- Main Dashboard
- Current Conditions
- Extended Forecast
- Regional Temperatures
- Severe Weather

## Severe Weather Module Pattern

The Severe Weather system should use:

- one reusable watch template
- one reusable warning template

Files:

- `subscreen-watch.html`
- `subscreen-warning.html`

Dynamic content is passed in through identifiers, not separate hard-coded files.

### Watch Pattern

`subscreen-watch.html?spc=<watch_number>`

### Warning Pattern

`subscreen-warning.html?id=<nws_alert_id>`

## Rotation Integration

Modules should be inserted into rotation as needed.

They should not require rewriting the entire rotation system.

Preferred model:

- base screens always rotate
- optional modules are inserted only when active
- inactive modules should not appear

## File Strategy

Avoid creating separate HTML files for every event.

Preferred strategy:

- one template per module type
- dynamic content loaded by identifier
- future data-driven insertion into rotation

## Recommended Near-Term Structure

Without fully restructuring the repo yet, new modules should still follow this concept:

- one HTML template
- one script for data/rendering if needed
- one data source or local JSON input
- one design doc

## Known Issues To Address Later

- Full module directory structure is not locked down yet
- Rotation logic still needs to support cleaner dynamic insertion
- Last-screen-to-first-screen rotation wrap is still a known issue
- Shared module conventions should be standardized after immediate severe-weather testing
