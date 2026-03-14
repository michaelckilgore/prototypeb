# Design Decisions

This file tracks decisions that should not be revisited unless there is a
strong reason.

Alert Bug
---------
• Always positioned in the TOP RIGHT
• May overlap the header slightly
• Must always remain visible

Clock
-----
• Display time as: "5:46 PM EDT"
• Use EDT / EST for DST clarity
• Clock should appear integrated with header graphics
• No translucent overlay panel

Forecast Screen
---------------
• Period labels use muted cyan
• Forecast rows allow up to 4 lines (including label)
• 7-day first card displays "TODAY"
• High / Low appear on the same line
• Low temperature color coded

Development Workflow
--------------------
• When files are updated, provide the COMPLETE replacement file whenever possible.
• Partial edits should only be used when the change is 1–2 lines.
• Avoid asking the developer to manually locate code blocks.

Background Direction
--------------------
• Use a lighter-top to darker-bottom gradient.
• Do not use decorative wave elements in the background.
