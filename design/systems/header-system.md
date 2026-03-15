# Header System

The header appears on all subscreens and contains:

• Logo
• Screen Title
• Clock
• Alert Bug

Logo Placement
--------------
The logo should sometimes appear on the LEFT and sometimes on the RIGHT.

Layouts do not need to strictly alternate, but different screens should
vary the logo placement to help reduce burn-in risk.

The main screen should currently use the logo on the LEFT.

Example layouts:

Layout A
LOGO — TITLE — CLOCK

Layout B
CLOCK — TITLE — LOGO

Alert Bug
---------
• Always TOP RIGHT
• Positioned above the header layer
• May slightly overlap header graphics

Clock
-----
• Displays local time with EDT/EST
• Integrated into header graphic area
• Should align vertically with header text

Header Safe Zone
----------------
Content areas must begin below the header to ensure the logo and title
are never overlapped by screen elements.

Header Title Length Rules
-------------------------
• Header titles should prefer a single line.
• If necessary, titles may reduce in size and wrap to two lines.
• Header height should remain fixed.
• If a requested title looks too long, flag it before implementation.

Known Issues To Address Soon
----------------------------
• Header system is not fully locked down yet.
• Header art, title placement, logo placement, and clock alignment still need refinement.
• Shared header behavior across Main, Current Conditions, Extended Forecast, and Regional screens needs to be standardized soon.
• Decorative header treatment should use actual loaded art assets where applicable.
• Avoid introducing custom or improvised sparkle/twinkle effects unless explicitly approved.
