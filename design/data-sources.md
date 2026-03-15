# Data Sources

## Purpose
Track the data sources used by the dashboard and how they are expected to be used.

## Current / Planned Sources

### Tempest Personal Weather Station
Purpose:
- local station observations
- wind
- rain
- pressure
- lightning-related local data

Usage:
- Current Conditions
- station graphs
- rainfall and wind modules

### National Weather Service (NWS)
Primary endpoint:
`https://api.weather.gov/alerts/active`

Purpose:
- warnings
- watches from NWS when applicable
- text alerts
- future local severe-weather logic

Important fields:
- `id`
- `properties.event`
- `properties.areaDesc`
- `properties.expires`
- `properties.description`

Usage:
- `subscreen-warning.html`
- severe alert logic
- future local warning prioritization

### Storm Prediction Center (SPC)
Watch source:
`https://www.spc.noaa.gov/products/watch/`

Purpose:
- national severe weather watches
- future mesoscale discussion support
- future outlook support

Primary identifier:
- SPC Watch Number

Usage:
- `subscreen-watch.html`
- national severe-weather rotation entries

### Forecast Data
Current system already uses forecast-related data sources for:
- extended forecast
- daily periods
- 7-day display

## Prototype Severe Weather Rules

For the initial severe-weather prototype:

- always include the sample watch
- include all active national SPC watches, capped at 10
- include all active Indiana NWS warnings, capped at 10

## Audio Trigger Rules

Prototype sound logic:

- new watch activation → light ding
- new warning activation → stronger alert

Only trigger on **newly activated** items, not on every screen rotation.

## Known Issues To Address Later

- local-area filtering is not yet polygon-based
- SPC feeds may later move to structured JSON ingestion
- radar and mapping sources are not yet formalized in this doc
- severe-weather data priority rules still need later refinement
