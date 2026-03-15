
/* Sugar Hill Dashboard Script.js (rotation-fixed version) */
/* NOTE: This file assumes the rest of your original script.js logic remains unchanged.
   The only change is the rotation path removing the sample watch screen. */

function getNextScreenHref() {
  const path = window.location.pathname.toLowerCase();

  if (path.endsWith("index.html") || path.endsWith("/")) return "subscreen-current.html";
  if (path.endsWith("subscreen-current.html")) return "subscreen-regional-map.html";
  if (path.endsWith("subscreen-regional-map.html")) return "subscreen-watch.html";
  if (path.endsWith("subscreen-watch.html")) return "subscreen-forecast.html";
  if (path.endsWith("subscreen-forecast.html")) return "index.html";

  return "subscreen-current.html";
}
