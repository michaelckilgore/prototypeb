# Decisions Log

## Decision — Frontend calls backend only

Reason:
- simpler client
- cleaner CORS behavior
- easier caching
- easier provider changes later

## Decision — Keep backend memory-cache based for V1

Reason:
- simple to implement
- fast enough for current use
- good for local development

Consequence:
- history resets on server restart until persistent storage is added

## Decision — Use exact backend route names

Reason:
- reduces confusion
- prevents drift between discussion and code
- makes future chats and docs more reliable

## Decision — Keep `/api/spc-watches` route name

Reason:
- preserves client compatibility
- allows backend logic to evolve without forcing immediate frontend route changes

## Decision — Full replacement file workflow preferred

Reason:
- reduces partial-edit confusion
- easier to deploy into the working project
- matches current project workflow

## Decision — Documentation delivery preference

User preference:
- do not stream long design-document text into the chat window
- provide documentation as repo-ready `.md` files
- when practical, package documentation in a ZIP file for direct upload to GitHub or the project folder

This preference should be followed for substantial documentation work on this project.
