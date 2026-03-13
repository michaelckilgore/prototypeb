const DASHBOARD_ENDPOINT = "/api/dashboard";
const REGIONAL_ENDPOINT = "/api/regional-temps";

const SCREENS = ["screen-current", "screen-regional"];
const SCREEN_DURATION_MS = 10000;

let currentScreenIndex = 0;
let dashboardData = null;
let regionalData = null;

function getTempColor(tempF) {
  if (tempF == null || Number.isNaN(tempF)) return "#8fa3be";
  if (tempF <= 0) return "#7d4dff";
  if (tempF <= 10) return "#4d73ff";
  if (tempF <= 20) return "#3f9dff";
  if (tempF <= 30) return "#38cfff";
  if (tempF <= 40) return "#4ee1c1";
  if (tempF <= 50) return "#7fe27a";
  if (tempF <= 60) return "#c6e86b";
  if (tempF <= 69) return "#ffe15a";
  if (tempF <= 79) return "#ffae42";
  if (tempF <= 89) return "#ff7043";
  return "#ff4d67";
}

function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.toggle("active", screen.id === screenId);
  });
}

function startScreenRotation() {
  showScreen(SCREENS[currentScreenIndex]);

  setInterval(() => {
    currentScreenIndex = (currentScreenIndex + 1) % SCREENS.length;
    showScreen(SCREENS[currentScreenIndex]);
  }, SCREEN_DURATION_MS);
}

function formatUpdatedTime(iso) {
  if (!iso) return "Updating...";

  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Indiana/Indianapolis",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZoneName: "short",
  }).format(new Date(iso));
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function renderCurrentConditions() {
  const current = dashboardData?.current;
  if (!current) return;

  const temp = typeof current.tempF === "number" ? Math.round(current.tempF) : null;
  const tempText = temp == null ? "--°" : `${temp}°`;

  setText("currentTemp", tempText);
  setText("currentHumidity", current.humidity == null ? "--%" : `${current.humidity}%`);
  setText(
    "currentPressure",
    current.pressureInHg == null ? "--" : `${current.pressureInHg.toFixed(2)} in`
  );
  setText(
    "currentWind",
    current.windMph == null ? "--" : `${current.windMph.toFixed(1)} mph`
  );
  setText(
    "currentGust",
    current.gustMph == null ? "--" : `${current.gustMph.toFixed(1)} mph`
  );
  setText(
    "currentRainRate",
    current.rainRateInHr == null ? "0.00 in/hr" : `${current.rainRateInHr.toFixed(2)} in/hr`
  );
  setText(
    "currentRainToday",
    current.rainTodayIn == null ? "0.00 in" : `${current.rainTodayIn.toFixed(2)} in`
  );
  setText("currentUpdated", formatUpdatedTime(current.updatedAt));

  const ring = document.getElementById("currentTempRing");
  if (ring) {
    const color = getTempColor(temp);
    ring.style.background = `
      radial-gradient(circle at 50% 50%, rgba(10, 19, 32, 0.98) 55%, rgba(10, 19, 32, 0.7) 56%),
      conic-gradient(from 220deg, ${color}, #38cfff, #7fe27a, #ffe15a, #ffae42, #ff7043, ${color})
    `;
  }
}

async function fetchDashboard() {
  try {
    const res = await fetch(DASHBOARD_ENDPOINT, { cache: "no-store" });
    if (!res.ok) throw new Error(`Dashboard fetch failed: ${res.status}`);
    dashboardData = await res.json();
    renderCurrentConditions();
  } catch (error) {
    console.error("[dashboard] fetch failed:", error);
  }
}

function renderRegionalMap() {
  const asOf = regionalData?.asOfLabel || "As of: --";
  setText("regionalAsOf", asOf);

  const group = document.getElementById("regionalMarkers");
  if (!group) return;

  group.innerHTML = "";
  const cities = regionalData?.cities || [];

  cities.forEach((city) => {
    const x = city.x;
    const y = city.y;
    const temp = typeof city.tempF === "number" ? city.tempF : null;
    const fill = getTempColor(temp);

    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("class", "temp-marker-group");
    g.setAttribute("transform", `translate(${x}, ${y})`);

    const ring = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    ring.setAttribute("class", "temp-marker-ring");
    ring.setAttribute("r", "31");

    const core = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    core.setAttribute("class", "temp-marker-core");
    core.setAttribute("r", "24");
    core.setAttribute("fill", fill);

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("class", temp == null ? "temp-marker-text temp-marker-missing" : "temp-marker-text");
    text.setAttribute("x", "0");
    text.setAttribute("y", "2");
    text.textContent = temp == null ? "--" : `${Math.round(temp)}°`;

    g.appendChild(ring);
    g.appendChild(core);
    g.appendChild(text);
    group.appendChild(g);
  });
}

async function fetchRegionalTemps() {
  try {
    const res = await fetch(REGIONAL_ENDPOINT, { cache: "no-store" });
    if (!res.ok) throw new Error(`Regional fetch failed: ${res.status}`);
    regionalData = await res.json();
    renderRegionalMap();
  } catch (error) {
    console.error("[regional] fetch failed:", error);
  }
}

function scheduleRegionalRefresh() {
  fetchRegionalTemps();

  function scheduleNext() {
    const now = new Date();
    const next = new Date(now);
    next.setMinutes(1, 30, 0);
    if (next <= now) next.setHours(next.getHours() + 1);

    const delay = next.getTime() - now.getTime();

    setTimeout(async () => {
      await fetchRegionalTemps();
      scheduleNext();
    }, delay);
  }

  scheduleNext();
}

document.addEventListener("DOMContentLoaded", async () => {
  await fetchDashboard();
  await fetchRegionalTemps();

  setInterval(fetchDashboard, 30000);
  scheduleRegionalRefresh();
  startScreenRotation();
});
