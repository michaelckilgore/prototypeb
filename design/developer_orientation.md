# Developer Orientation

## What this project is

The Sugar Hill Weather Dashboard is a broadcast-style weather display intended for a large-screen environment. It is optimized for readability, fast severe-weather recognition, and lightweight browser performance.

## High-level architecture

### Frontend
- Static HTML/CSS/JavaScript
- Renders the dashboard screens
- Rotates screens automatically
- Calls only internal backend endpoints

### Backend
- Node.js + Express
- Polls external weather APIs on intervals
- Normalizes raw API responses
- Caches data in memory
- Serves simplified JSON endpoints to the frontend

## Main data feeds

### Tempest
Used for live local observations including:
- temperature
- dew point
- humidity
- pressure
- wind
- rainfall
- future lightning integration

### NWS
Used for:
- forecast periods
- local alerts
- regional station observations
- nationwide severe watch detection

## Current backend behavior

- Tempest polled every 30 seconds
- Forecast polled every 5 minutes
- Local alerts polled every 60 seconds
- Regional temperatures polled every 5 minutes
- Daily high/low tracked in memory by local Indiana day

## What is currently solid

- Tempest current conditions
- NWS forecast retrieval
- local NWS alerts
- regional temperatures
- SPC watch detection
- backend caching model

## What is still incomplete

- lightning endpoint implementation
- temperature history storage
- pressure history storage
- richer SPC watch objects
- advanced warning / emergency screens
- radar integration

## How to work safely in this repo

- Prefer full replacement files for code changes.
- Avoid architectural drift between frontend route names and backend route names.
- Keep UI choices compatible with TV display constraints.
- Document important decisions in `design/decisions.md`.
