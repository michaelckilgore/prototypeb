# Forecast screen notes to append to project README

## 2026-03-13 approved direction for Expanded Forecast screen

- Use the approved full-width **Expanded Forecast** top bar artwork as the header base for this screen.
- Use the **real Sugar Hill Weather Network logo** asset, not a recreated logo.
- Header clock should sit a little lower and visually in line with the header design.
- Alert badge lives in the upper-right area above the clock when active, even if it overlaps the sparkle area.
- Four main forecast periods stay stacked top-to-bottom.
- Four-period body text should be smaller than the earlier oversized version and start a little lower inside each row.
- Large period-end temperatures use the **10-degree gradient** color system.
- Temperature mentions inside the sentence text stay normal text color.
- 7-day strip uses **3-letter day names**.
- 7-day strip should show: **high/low, condition icon, condition word, precip chance**.
- Bottom current conditions bar should be **shallower**, with **smaller font**, and **no scrolling ticker**.
- Keep the word **Condition** fixed at the front of the footer condition slot.
- Rotate a few condition values beside it with a **vertical wipe**.
- The forecast screen should pull data from:
  - `/api/nws-forecast-detailed`
  - `/api/tempest/current`
  - `/api/nws-alerts`
- If future chats need continuity, treat these bullets as the active approved forecast-screen direction unless replaced by newer notes.

## README workflow

- **Append** new approved design/system decisions to the README or a docs note.
- **Replace** only when you are intentionally consolidating old notes into a cleaner master version.
- Safe default: append dated sections, then clean up later.
