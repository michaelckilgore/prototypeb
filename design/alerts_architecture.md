# Alerts and Watch Architecture

## Watch Screen Runtime Rules

- Use `subscreen-watch.html` for both live and test watch display.
- The separate sample watch page has been retired.
- If an active watch exists, the watch screen shows the current live watch.
- If no active watch exists, the watch screen shows the most recent cached watch with a very clear expired state.
- The expired state must be labeled exactly:
  - `EXPIRED · NO LONGER VALID`
- This expired display is for testing and layout review only.

## SPC Map Handling

- Preferred map image is the SPC watch overview graphic.
- If the SPC map image is not yet available, show the text fallback:
  - `Storm Prediction Center Map`
  - `Will Be Available Shortly`
- Retry failed SPC map loads automatically.

## Area Text Policy

- Default watch screen area text should use the SPC regional wording such as `PORTIONS OF CENTRAL ILLINOIS`.
- County lists are not the default watch-screen presentation because counties already appear on the SPC map.
- County-based watch text can be revisited later for Indiana-specific watches if needed.

## UI Preference

- Long design-doc text should not be streamed into the chat window.
- Repo-ready `.md` files in a ZIP are preferred for design-doc updates.
