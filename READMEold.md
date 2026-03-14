# Prototype B

## Current screen rotation
1. `index.html` main screen
2. `subscreen-current.html`
3. `subscreen-regional-map.html`
4. `subscreen-forecast.html`

Testing rotation timing is currently set to **5 seconds per screen**.

## Forecast subscreen design rules
The forecast screen is intentionally locked to this direction for now:

- Header uses **Sugar Hill Reporting Station** with **Expanded Forecast** as the main title.
- Time belongs in the header box on this screen.
- Four forecast periods run **top to bottom** as the main feature.
- The 7-day forecast strip stays **shallower** than the period section.
- The forecast icons should stay **large**.
- The forecast temperature can be emphasized as a large value, so it does **not** need special color treatment inside the body text.
- There is **no right-side current conditions box** on the forecast screen.
- Current conditions stay **at the bottom only** on the forecast screen.
- The current-conditions wipe on the forecast screen should **continue where it left off** instead of restarting at the top when the screen returns.
- The note under the 7-day strip should read: **Forecast confidence decreases with time.**

## General styling notes
- Keep the subscreens in a shared broadcast style.
- Do **not** use beveled boxes at this time.
- Keep the design sexy, but not over the top.
