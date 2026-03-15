
# Alert System Architecture

Two completely separate alert layers must exist.

LOCAL ALERT LAYER
- Used by main dashboard
- Shows alerts for Sugar Hill location only

SEVERE WEATHER MODULE
- Used by rotating severe weather screens
- Indiana Tornado Warnings
- Indiana Severe Thunderstorm Warnings
- National SPC Watches

These must never share the same filtering logic.


## Watch map fallback

When a new SPC watch is issued, the watch number and text can appear before the SPC overview map is published. The watch screen should keep the map frame visible and show centered fallback text instead of a blank or broken image:

- Storm Prediction Center Map
- Will Be Available Shortly

The client should retry the SPC map URL every 30 seconds until the map loads, then fade the map in without changing the panel layout.
