# Screen Registry

This document lists all screens in the Sugar Hill Weather Dashboard and their role in the rotation.

## Core Screens

### index.html
Primary dashboard screen.
Shows:
- current conditions summary
- alerts
- core weather metrics

### subscreen-current.html
Detailed current conditions panel.
Includes:
- temperature ring
- wind
- rainfall
- pressure

### subscreen-regional-map.html
Regional temperature map.

Displays:
- nearby city temperatures
- “as of” timestamp

### subscreen-forecast.html
Expanded forecast screen.

Displays:
- next 4 forecast periods
- 7-day summary strip
- alert banner

### subscreen-severe.html
Local severe weather screen.

Purpose:
- display high-impact warnings
- provide a focused severe weather layout

This screen may eventually override normal rotation priority.

## Future Screens

Planned modules:

- sports scoreboard
- stock ticker
- radar view
- storm-tracking panel

Future screens should be added here before implementation so the rotation manager can include them safely.
