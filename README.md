# Sugar Hill Weather Network

## Expanded forecast screen notes

- This repair version uses the approved full header bar image directly for the expanded forecast screen.
- The clock is overlaid on the right side of the header.
- The alert badge is reserved for the upper-right area.
- Forecast data loads from `/api/nws-forecast-detailed` with fallback to `http://localhost:3000/api/nws-forecast-detailed`.
- Current conditions load from `/api/tempest/current` with fallback to `http://localhost:3000/api/tempest/current`.
- Alert data loads from `/api/nws-alerts` with fallback to `http://localhost:3000/api/nws-alerts`.
- The bottom current conditions bar should always remain visible, even if current data fails.
- This uses the full approved `Expanded Forecast` header art, so it is for the forecast screen specifically.
- A reusable multi-screen header will still need a blanked title version of the bar artwork.
