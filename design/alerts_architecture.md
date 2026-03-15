# Watch Screen Notes

## Current watch-screen rules

- The live watch page is also used for testing when no active watch exists.
- If no active watch exists, the most recent cached watch is shown in an expired state.
- The expired state must display a bold `EXPIRED · NO LONGER VALID` label.
- The map fallback message is:
  - `Storm Prediction Center Map`
  - `Will Be Available Shortly`
- The watch timing block shows two lines:
  - local dashboard time (EDT/EST for Sugar Hill)
  - official SPC time line from the watch text
- `PORTIONS OF` should come from SPC watch text regional wording, not county parsing.
- County names are already shown on the SPC map and should not normally be duplicated in the right panel.
- The `PORTIONS OF` text is intentionally smaller than the primary-threat text because regional wording can be long.
- A very small layout-build label is shown at the top center during development to confirm the current page is loaded.
- Long design-doc text should not be streamed in chat when repo-ready `.md` files can be provided instead.
