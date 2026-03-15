
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
