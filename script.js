const data = {
  current: {
    temp: null,
    feelsLike: null,
    tempTrend: "steady",
    tempRapid: false,
    condition: "N/A",
    dew: null,
    humidity: null,
    pressureIn: null,
    pressureMb: null,
    pressureTrend: "steady",
    pressureRapidDrop: false,
    todayHigh: null,
    todayLow: null
  },
  wind: {
    speed: null,
    gust: null,
    directionDeg: null
  },
  rainfall: {
    daily: null,
    rate: null
  },
  lightning: {
    lastStrikeEpoch: null,
    lastStrikeDistanceMiles: null,
    lastStrikeDirection: null,
    minuteCount: null,
    fifteenMinuteCount: null,
    hourCount: null,
    todayCount: null,
    countsRadiusMiles: 10,
    disclaimer: "Lightning data is subject to interference and detection limits."
  },
  forecast: [
    { high: 70, low: 44, cond: "Storm", pop: 40 },
    { high: 62, low: 45, cond: "Storm", pop: 30 },
    { high: 68, low: 50, cond: "Storm", pop: 20 }
  ],
  alerts: [],
  history: {
    temperature: [],
    pressure: [],
    startOfDayMs: null,
    endOfDayMs: null,
    pressureStartMs: null,
    pressureEndMs: null
  },
  regionalTemps: {
    updatedAt: null,
    asOfLabel: "As of: --",
    cities: []
  }
};

let tickerTimer = null;
let tickerIndex = 0;
let lastAlertSignature = "";
let lightningTimer = null;

let subscreenConditionSetIndex = 0;
let subscreenConditionTimer = null;
let activeConditionLine = null;

const SCREEN_ROTATE_MS = 10000;
const SCREEN_FADE_MS = 250;
const CONDITION_ROTATE_MS = 5000;

const REGIONAL_CITY_LATLON = {
  "chicago": { lat: 41.8781, lon: -87.6298 },
  "south-bend": { lat: 41.6764, lon: -86.2520 },
  "fort-wayne": { lat: 41.0793, lon: -85.1394 },
  "lafayette": { lat: 40.4167, lon: -86.8753 },
  "muncie": { lat: 40.1934, lon: -85.3864 },
  "indianapolis": { lat: 39.7684, lon: -86.1581 },
  "rushville": { lat: 39.6092, lon: -85.4464 },
  "cincinnati": { lat: 39.1031, lon: -84.5120 },
  "louisville": { lat: 38.2527, lon: -85.7585 },
  "evansville": { lat: 37.9716, lon: -87.5711 }
};

const REGIONAL_MAP_BOUNDS = {
  width: 900,
  height: 700,
  westLon: -88.20,
  eastLon: -84.10,
  northLat: 42.20,
  southLat: 37.60
};

function projectRegionalLatLon(lat, lon) {
  const { width, height, westLon, eastLon, northLat, southLat } = REGIONAL_MAP_BOUNDS;
  const x = ((lon - westLon) / (eastLon - westLon)) * width;
  const y = ((northLat - lat) / (northLat - southLat)) * height;
  return { x: Math.round(x), y: Math.round(y) };
}

function tempColor(temp) {
  if (typeof temp !== "number") return "#ffffff";
  if (temp <= 29) return "#70C0FF";
  if (temp <= 39) return "#60B0FF";
  if (temp <= 49) return "#50A0FF";
  if (temp <= 59) return "#70D0A0";
  if (temp <= 69) return "#FFC8C8";
  if (temp <= 79) return "#FFB060";
  if (temp <= 89) return "#FF9040";
  if (temp <= 99) return "#FF7040";
  return "#FF5030";
}

function tempBandStops() {
  return [
    { start: -20, end: 29, color: "#70C0FF" },
    { start: 30, end: 39, color: "#60B0FF" },
    { start: 40, end: 49, color: "#50A0FF" },
    { start: 50, end: 59, color: "#70D0A0" },
    { start: 60, end: 69, color: "#FFC8C8" },
    { start: 70, end: 79, color: "#FFB060" },
    { start: 80, end: 89, color: "#FF9040" },
    { start: 90, end: 99, color: "#FF7040" },
    { start: 100, end: 140, color: "#FF5030" }
  ];
}

function hexToRgb(hex) {
  const normalized = hex.replace("#", "");
  const value = normalized.length === 3 ? normalized.split("").map((c) => c + c).join("") : normalized;
  const num = parseInt(value, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHex({ r, g, b }) {
  const toHex = (n) => n.toString(16).padStart(2, "0");
  return `#${toHex(Math.round(r))}${toHex(Math.round(g))}${toHex(Math.round(b))}`;
}

function interpolateColor(c1, c2, ratio) {
  const a = hexToRgb(c1);
  const b = hexToRgb(c2);
  return rgbToHex({
    r: a.r + (b.r - a.r) * ratio,
    g: a.g + (b.g - a.g) * ratio,
    b: a.b + (b.b - a.b) * ratio
  });
}

function getBlendedTempColor(temp) {
  if (typeof temp !== "number") return "#7be7ff";
  const stops = tempBandStops();
  for (let i = 0; i < stops.length; i++) {
    const stop = stops[i];
    if (temp >= stop.start && temp <= stop.end) {
      const next = stops[i + 1];
      const prev = stops[i - 1];
      if (next && temp >= stop.end - 1) {
        const ratio = (temp - (stop.end - 1)) / 2;
        return interpolateColor(stop.color, next.color, Math.max(0, Math.min(ratio, 1)));
      }
      if (prev && temp <= stop.start + 1) {
        const ratio = 1 - ((temp - (stop.start - 1)) / 2);
        return interpolateColor(prev.color, stop.color, Math.max(0, Math.min(ratio, 1)));
      }
      return stop.color;
    }
  }
  return tempColor(temp);
}

function applyTempColor(el, temp) {
  if (el) el.style.color = tempColor(temp);
}

function formatValue(value, suffix = "") {
  return typeof value === "number" ? `${value}${suffix}` : "N/A";
}

function formatFixed(value, digits = 1, suffix = "") {
  return typeof value === "number" ? `${value.toFixed(digits)}${suffix}` : "N/A";
}

function formatEpochToPanel(epoch) {
  if (typeof epoch !== "number") return "N/A";
  const date = new Date(epoch * 1000);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const suffix = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${month}/${day} ${hours}:${minutes} ${suffix}`;
}

function formatStrikeTime(epoch) {
  if (typeof epoch !== "number") return "N/A";
  const date = new Date(epoch * 1000);
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const suffix = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${suffix}`;
}

function formatShortTime(date) {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });
}

function formatMinutesUntil(dateString) {
  if (!dateString) return "";
  const expires = new Date(dateString);
  const now = new Date();
  const diffMs = expires.getTime() - now.getTime();
  const diffMin = Math.max(0, Math.round(diffMs / 60000));
  return `Expires in ${diffMin} min • ${formatShortTime(expires)}`;
}

function degToCompass(num) {
  if (typeof num !== "number") return "N/A";
  const val = Math.floor((num / 22.5) + 0.5);
  const arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return arr[val % 16];
}

function getNextThreeDayLabels() {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();
  return ["Today", days[(today.getDay() + 1) % 7], days[(today.getDay() + 2) % 7]];
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function updateClock() {
  const now = new Date();
  const str = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true, timeZoneName: "short" });
  setText("clock", str);
  setText("subscreen-clock", str);
  setText("regional-clock", str);
}

function getRainIntensity(rate) {
  if (typeof rate !== "number" || rate <= 0) return "None";
  if (rate <= 0.03) return "Drizzle";
  if (rate <= 0.1) return "Light Rain";
  if (rate <= 0.3) return "Moderate Rain";
  if (rate <= 0.5) return "Heavy Rain";
  return "Downpour";
}

function getRainIntensityColor(rate) {
  if (typeof rate !== "number" || rate <= 0) return "#aeb8c7";
  if (rate <= 0.03) return "#b9dcff";
  if (rate <= 0.1) return "#8fd0ff";
  if (rate <= 0.3) return "#74efff";
  if (rate <= 0.5) return "#5cb8ff";
  return "#7f8cff";
}

function normalizeAlertText(text) {
  return String(text || "").replace(/\s+/g, " ").replace(/\n+/g, " ").trim();
}

function alertBlob(alert) {
  return [alert.event || "", alert.headline || "", alert.description || "", alert.instruction || "", alert.severity || ""].join(" ").toLowerCase();
}

function isPds(alert) {
  const blob = alertBlob(alert);
  return blob.includes("particularly dangerous situation") || blob.includes(" pds ");
}

function isDestructiveSevere(alert) {
  const blob = alertBlob(alert);
  return String(alert.event || "").toLowerCase().includes("severe thunderstorm warning") && (blob.includes("destructive") || (blob.includes("damage threat") && blob.includes("destructive")));
}

function isConsiderableSevere(alert) {
  const blob = alertBlob(alert);
  return String(alert.event || "").toLowerCase().includes("severe thunderstorm warning") && (blob.includes("considerable") || (blob.includes("damage threat") && blob.includes("considerable")));
}

function isCivilMessage(alert) {
  const event = String(alert.event || "").toLowerCase();
  return event.includes("civil danger warning") || event.includes("civil emergency message") || event.includes("law enforcement warning") || event.includes("local area emergency") || event.includes("911 telephone outage emergency") || event.includes("evacuation immediate");
}

function isWinterWarning(alert) {
  const event = String(alert.event || "").toLowerCase();
  return event.includes("winter storm warning") || event.includes("blizzard warning") || event.includes("ice storm warning") || event.includes("snow squall warning") || event.includes("wind chill warning") || event.includes("lake effect snow warning") || event.includes("extreme cold warning");
}

function isWinterWatch(alert) {
  const event = String(alert.event || "").toLowerCase();
  return event.includes("winter storm watch") || event.includes("blizzard watch") || event.includes("ice storm watch") || event.includes("wind chill watch") || event.includes("lake effect snow watch");
}

function getAlertPriority(alert) {
  const event = String(alert.event || "").toLowerCase();
  if (event.includes("tornado emergency")) return 1;
  if (event.includes("tornado warning") && isPds(alert)) return 2;
  if (event.includes("tornado warning")) return 3;
  if (isDestructiveSevere(alert)) return 4;
  if (isConsiderableSevere(alert)) return 5;
  if (event.includes("severe thunderstorm warning")) return 6;
  if (event.includes("flash flood warning")) return 7;
  if (event.includes("flood warning")) return 8;
  if (event.includes("flood advisory")) return 9;
  if (isWinterWarning(alert)) return 10;
  if (event.includes("tornado watch") && isPds(alert)) return 11;
  if (event.includes("tornado watch")) return 12;
  if (event.includes("severe thunderstorm watch")) return 13;
  if (event.includes("flash flood watch")) return 14;
  if (event.includes("flood watch")) return 15;
  if (isWinterWatch(alert)) return 16;
  if (isCivilMessage(alert)) return 18;
  return 17;
}

function getAlertTheme(alert) {
  const event = String(alert.event || "").toLowerCase();
  if (event.includes("tornado emergency")) return { bg1: "#6f1ab1", bg2: "#4a0f7a", title1: "#7d24c7", title2: "#53118a", border: "#c58cff", text: "#ffffff", chipBg: "rgba(255,255,255,0.12)", chipBorder: "rgba(255,255,255,0.22)" };
  if (event.includes("tornado warning") && isPds(alert)) return { bg1: "#cf0000", bg2: "#8f0000", title1: "#e00000", title2: "#a90000", border: "#ff9090", text: "#ffffff", chipBg: "rgba(255,255,255,0.12)", chipBorder: "rgba(255,255,255,0.22)" };
  if (event.includes("tornado warning")) return { bg1: "#ef0000", bg2: "#b10000", title1: "#ff2222", title2: "#c20000", border: "#ff9a9a", text: "#ffffff", chipBg: "rgba(255,255,255,0.12)", chipBorder: "rgba(255,255,255,0.22)" };
  if (isDestructiveSevere(alert)) return { bg1: "#ff6a00", bg2: "#d33d00", title1: "#ff7b14", title2: "#e64c00", border: "#ffc08f", text: "#111111", chipBg: "rgba(255,255,255,0.22)", chipBorder: "rgba(0,0,0,0.18)" };
  if (isConsiderableSevere(alert)) return { bg1: "#ff8a00", bg2: "#e15d00", title1: "#ffa01f", title2: "#ef6d00", border: "#ffd08a", text: "#111111", chipBg: "rgba(255,255,255,0.22)", chipBorder: "rgba(0,0,0,0.18)" };
  if (event.includes("severe thunderstorm warning")) return { bg1: "#fff3b7", bg2: "#ffea96", title1: "#fff7c8", title2: "#fff0ae", border: "#ffefb0", text: "#111111", chipBg: "rgba(0,0,0,0.05)", chipBorder: "rgba(0,0,0,0.12)" };
  return { bg1: "#fff9cc", bg2: "#fff1a8", title1: "#fffbe0", title2: "#fff4b8", border: "#fff0a0", text: "#111111", chipBg: "rgba(0,0,0,0.05)", chipBorder: "rgba(0,0,0,0.12)" };
}

function getShortAlertLabel(alert) {
  const event = String(alert.event || "");
  const lower = event.toLowerCase();
  if (lower.includes("tornado emergency")) return "TORNADO EMERGENCY";
  if (lower.includes("tornado warning") && isPds(alert)) return "PDS TORNADO WARNING";
  if (lower.includes("tornado warning")) return "TORNADO WARNING";
  if (isDestructiveSevere(alert)) return "DESTRUCTIVE SVR T-STORM WARNING";
  if (isConsiderableSevere(alert)) return "CONSIDERABLE SVR T-STORM WARNING";
  if (lower.includes("severe thunderstorm warning")) return "SVR T-STORM WARNING";
  return event.toUpperCase() || "ALERT";
}

function getTickerMessage(alert) {
  const label = getShortAlertLabel(alert);
  const headline = normalizeAlertText(alert.headline);
  const description = normalizeAlertText(alert.description);
  if (headline) return headline;
  if (description) return `${label}: ${description}`;
  return label;
}

function getSortedAlerts(alerts) {
  return [...alerts].sort((a, b) => {
    const pa = getAlertPriority(a);
    const pb = getAlertPriority(b);
    if (pa !== pb) return pa - pb;
    return getShortAlertLabel(a).localeCompare(getShortAlertLabel(b));
  });
}

function applyAlertTheme(alerts) {
  const activeBar = document.getElementById("active-alerts-bar");
  const priorityBar = document.getElementById("priority-alerts-bar");
  const activeTitle = activeBar ? activeBar.querySelector(".alert-title") : null;
  const priorityTitle = priorityBar ? priorityBar.querySelector(".alert-title") : null;
  const activeList = document.getElementById("active-alerts-list");
  const priorityTrack = document.getElementById("priority-alerts-track");
  if (!activeBar || !priorityBar || !activeTitle || !priorityTitle || !activeList || !priorityTrack) return;
  const theme = getAlertTheme(alerts[0]);
  [activeBar, priorityBar].forEach((bar) => {
    bar.style.borderColor = theme.border;
    bar.style.background = `linear-gradient(180deg, ${theme.bg1}, ${theme.bg2})`;
    bar.style.boxShadow = `0 0 14px ${theme.border}33`;
  });
  [activeTitle, priorityTitle].forEach((title) => {
    title.style.background = `linear-gradient(180deg, ${theme.title1}, ${theme.title2})`;
    title.style.color = theme.text;
    title.style.borderRight = `1px solid ${theme.border}`;
  });
  activeList.style.color = theme.text;
  priorityTrack.style.color = theme.text;
}

function clearTicker() {
  if (tickerTimer) {
    clearTimeout(tickerTimer);
    tickerTimer = null;
  }
  const priorityTrack = document.getElementById("priority-alerts-track");
  if (priorityTrack) {
    priorityTrack.style.animation = "none";
    priorityTrack.textContent = "";
  }
}

function startTickerCycle(sortedAlerts) {
  clearTicker();
  const priorityTrack = document.getElementById("priority-alerts-track");
  if (!priorityTrack || !sortedAlerts.length) return;
  tickerIndex = 0;
  function runNext() {
    if (!sortedAlerts.length) return;
    const alert = sortedAlerts[tickerIndex % sortedAlerts.length];
    const message = getTickerMessage(alert);
    const duration = Math.max(12, Math.min(32, message.length * 0.14 + 8));
    priorityTrack.style.animation = "none";
    priorityTrack.textContent = message;
    priorityTrack.style.paddingLeft = "100%";
    void priorityTrack.offsetWidth;
    priorityTrack.style.animation = `ticker ${duration}s linear 1`;
    tickerTimer = setTimeout(() => {
      tickerIndex = (tickerIndex + 1) % sortedAlerts.length;
      runNext();
    }, duration * 1000 + 250);
  }
  runNext();
}

function renderActiveAlertChips(sortedAlerts) {
  const activeList = document.getElementById("active-alerts-list");
  if (!activeList) return;
  const theme = getAlertTheme(sortedAlerts[0]);
  activeList.innerHTML = "";
  activeList.style.overflow = "hidden";
  activeList.style.whiteSpace = "nowrap";
  const list = document.createElement("div");
  list.className = "alert-list";
  list.style.display = "flex";
  list.style.flexWrap = "nowrap";
  list.style.gap = "8px";
  list.style.alignItems = "center";
  list.style.width = "max-content";
  activeList.appendChild(list);
  const createChip = (text) => {
    const chip = document.createElement("div");
    chip.className = "alert-chip";
    chip.textContent = text;
    chip.style.whiteSpace = "nowrap";
    chip.style.padding = "4px 10px";
    chip.style.borderRadius = "999px";
    chip.style.background = theme.chipBg;
    chip.style.border = `1px solid ${theme.chipBorder}`;
    chip.style.color = theme.text;
    chip.style.fontWeight = "800";
    chip.style.fontSize = "13px";
    chip.style.lineHeight = "1";
    return chip;
  };
  const maxWidth = activeList.clientWidth || activeList.offsetWidth || 0;
  if (maxWidth <= 0) {
    sortedAlerts.forEach((alert) => list.appendChild(createChip(getShortAlertLabel(alert))));
    return;
  }
  let usedOverflow = false;
  for (let i = 0; i < sortedAlerts.length; i++) {
    const chip = createChip(getShortAlertLabel(sortedAlerts[i]));
    list.appendChild(chip);
    if (list.scrollWidth > maxWidth) {
      list.removeChild(chip);
      usedOverflow = i < sortedAlerts.length;
      break;
    }
  }
  if (usedOverflow) {
    const plusChip = createChip("+");
    list.appendChild(plusChip);
    while (list.scrollWidth > maxWidth && list.children.length > 1) {
      list.removeChild(list.children[list.children.length - 2]);
    }
  }
}

function renderWarnings(forceRestartTicker = false) {
  const activeBar = document.getElementById("active-alerts-bar");
  const activeList = document.getElementById("active-alerts-list");
  const priorityBar = document.getElementById("priority-alerts-bar");
  const priorityTrack = document.getElementById("priority-alerts-track");
  if (!activeBar || !activeList || !priorityBar || !priorityTrack) return;
  if (!Array.isArray(data.alerts) || data.alerts.length === 0) {
    activeBar.style.display = "none";
    priorityBar.style.display = "none";
    activeList.innerHTML = "";
    priorityTrack.textContent = "";
    clearTicker();
    return;
  }
  const sortedAlerts = getSortedAlerts(data.alerts);
  activeBar.style.display = "grid";
  priorityBar.style.display = "grid";
  applyAlertTheme(sortedAlerts);
  renderActiveAlertChips(sortedAlerts);
  const signature = JSON.stringify(sortedAlerts.map((alert) => ({ event: alert.event || "", headline: alert.headline || "", description: alert.description || "" })));
  if (forceRestartTicker || signature !== lastAlertSignature) {
    lastAlertSignature = signature;
    startTickerCycle(sortedAlerts);
  }
}

function ensureLightningMeta() {
  const panel = document.getElementById("lightning-warning")?.closest(".panel");
  const history = document.querySelector(".lightning-history");
  if (!panel || !history) return;
  let note = panel.querySelector(".lightning-counts-note");
  if (!note) {
    note = document.createElement("div");
    note.className = "lightning-counts-note";
    note.style.fontSize = "11px";
    note.style.fontWeight = "700";
    note.style.color = "#a9c7ff";
    note.style.margin = "10px 0 6px 2px";
    history.parentNode.insertBefore(note, history);
  }
  let disclaimer = panel.querySelector(".lightning-disclaimer");
  if (!disclaimer) {
    disclaimer = document.createElement("div");
    disclaimer.className = "lightning-disclaimer";
    disclaimer.style.fontSize = "10px";
    disclaimer.style.color = "#98a8bf";
    disclaimer.style.marginTop = "10px";
    disclaimer.style.lineHeight = "1.3";
    history.parentNode.appendChild(disclaimer);
  }
  note.textContent = `Strike Counts — Within ${data.lightning.countsRadiusMiles} Miles`;
  disclaimer.textContent = data.lightning.disclaimer;
}

function renderLightningWarning() {
  const warn = document.getElementById("lightning-warning");
  if (!warn) return;
  const strikeEpoch = data.lightning.lastStrikeEpoch;
  const distance = data.lightning.lastStrikeDistanceMiles;
  if (typeof strikeEpoch === "number" && typeof distance === "number" && distance <= 3) {
    warn.style.display = "block";
    warn.textContent = `Recent lightning strike at ${formatStrikeTime(strikeEpoch)} at a distance of ${distance.toFixed(1)} mi. Use caution.`;
  } else {
    warn.style.display = "none";
    warn.textContent = "";
  }
}

function renderLightningPanel() {
  ensureLightningMeta();
  setText("lt-last", formatEpochToPanel(data.lightning.lastStrikeEpoch));
  setText("lt-distance", typeof data.lightning.lastStrikeDistanceMiles === "number" ? `${data.lightning.lastStrikeDistanceMiles.toFixed(1)} mi` : "N/A");
  setText("lt-direction", data.lightning.lastStrikeDirection || "N/A");
  setText("lt-minute", formatValue(data.lightning.minuteCount));
  setText("lt-fifteen", formatValue(data.lightning.fifteenMinuteCount));
  setText("lt-hour", formatValue(data.lightning.hourCount));
  setText("lt-midnight", formatValue(data.lightning.todayCount));
  renderLightningWarning();
}

function renderForecast() {
  const labels = getNextThreeDayLabels();
  for (let i = 0; i < 3; i++) {
    const item = data.forecast[i];
    if (!item) continue;
    setText(`f${i}-label`, labels[i]);
    setText(`f${i}-high`, `${item.high}°`);
    setText(`f${i}-low`, `${item.low}°`);
    setText(`f${i}-cond`, item.cond);
    setText(`f${i}-pop`, `${item.pop}%`);
    applyTempColor(document.getElementById(`f${i}-high`), item.high);
    applyTempColor(document.getElementById(`f${i}-low`), item.low);
  }
}

function renderWindArrow() {
  const arrow = document.getElementById("wind-arrow");
  if (!arrow) return;
  if (typeof data.wind.directionDeg !== "number") {
    arrow.style.opacity = "0.25";
    arrow.style.transform = "rotate(-90deg)";
    return;
  }
  arrow.style.opacity = "1";
  arrow.style.transform = `rotate(${data.wind.directionDeg - 90}deg)`;
}

function renderTrendArrow(el, direction, rapid, kind) {
  if (!el) return;
  el.textContent = "";
  el.className = kind === "temp" ? "temp-trend" : "pressure-trend";
  if (direction !== "up" && direction !== "down") return;
  el.textContent = direction === "up" ? "▲" : "▼";
  if (kind === "temp") {
    el.classList.add("temp-trend-visible");
    el.classList.add(direction === "up" ? "temp-trend-up" : "temp-trend-down");
    if (rapid) el.classList.add("temp-trend-rapid");
    return;
  }
  el.classList.add("pressure-trend-visible");
  el.classList.add(direction === "up" ? "pressure-trend-up" : "pressure-trend-down");
  if (direction === "down" && rapid) el.classList.add("pressure-trend-rapid-down");
}

function renderCurrentConditions() {
  setText("current-condition", data.current.condition || "N/A");
  setText("current-temp", formatFixed(data.current.temp, 1, "°"));
  setText("current-feels-like", typeof data.current.feelsLike === "number" ? `Feels Like ${data.current.feelsLike}°` : "Feels Like N/A");
  setText("current-dew", formatValue(data.current.dew, "°"));
  setText("current-humidity", formatValue(data.current.humidity, "%"));
  const pressureText = (typeof data.current.pressureIn === "number" && typeof data.current.pressureMb === "number") ? `${data.current.pressureIn.toFixed(2)}" / ${data.current.pressureMb} MB` : "N/A";
  setText("current-pressure-text", pressureText);
  applyTempColor(document.getElementById("current-temp"), data.current.temp);
  applyTempColor(document.getElementById("current-dew"), data.current.dew);
  renderTrendArrow(document.getElementById("current-temp-trend"), data.current.tempTrend, data.current.tempRapid, "temp");
  renderTrendArrow(document.getElementById("current-pressure-trend"), data.current.pressureTrend, data.current.pressureRapidDrop, "pressure");
}

function renderWindPanel() {
  setText("wind-speed", formatValue(data.wind.speed, " mph"));
  setText("wind-gust", formatValue(data.wind.gust, " mph"));
  setText("wind-dir-text", degToCompass(data.wind.directionDeg));
  renderWindArrow();
}

function renderRainPanel() {
  const dailyValue = typeof data.rainfall.daily === "number" ? data.rainfall.daily : 0;
  const rateValue = typeof data.rainfall.rate === "number" ? data.rainfall.rate : 0;
  setText("rain-daily", `${dailyValue.toFixed(2)}"`);
  setText("rain-rate", `${rateValue.toFixed(2)}"/hr`);
  const intensity = getRainIntensity(rateValue);
  const intensityEl = document.getElementById("rain-intensity");
  if (intensityEl) {
    intensityEl.textContent = intensity;
    intensityEl.style.color = getRainIntensityColor(rateValue);
  }
  const fillEl = document.getElementById("rain-meter-fill");
  if (fillEl) {
    const maxRate = 0.5;
    const pct = Math.max(0, Math.min(rateValue / maxRate, 1)) * 100;
    fillEl.style.width = `${pct}%`;
  }
}

function renderAll() {
  renderCurrentConditions();
  renderWindPanel();
  renderRainPanel();
  setText("today-high", typeof data.current.todayHigh === "number" ? `${Math.round(data.current.todayHigh)}°` : "N/A");
  setText("today-low", typeof data.current.todayLow === "number" ? `${Math.round(data.current.todayLow)}°` : "N/A");
  applyTempColor(document.getElementById("today-high"), data.current.todayHigh);
  applyTempColor(document.getElementById("today-low"), data.current.todayLow);
  renderForecast();
  renderWarnings(true);
  renderLightningPanel();
  updateClock();
}

async function updateLiveTempestCurrent() {
  try {
    const response = await fetch("http://localhost:3000/api/tempest/current");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const live = await response.json();
    data.current.temp = typeof live.tempF === "number" ? live.tempF : null;
    data.current.feelsLike = typeof live.feelsLikeF === "number" ? live.feelsLikeF : null;
    data.current.tempTrend = live.tempTrend || "steady";
    data.current.tempRapid = Boolean(live.tempRapid);
    data.current.condition = live.condition || "N/A";
    data.current.dew = typeof live.dewF === "number" ? live.dewF : null;
    data.current.humidity = typeof live.humidity === "number" ? live.humidity : null;
    data.current.pressureIn = typeof live.pressureIn === "number" ? live.pressureIn : null;
    data.current.pressureMb = typeof live.pressureMb === "number" ? live.pressureMb : null;
    data.current.pressureTrend = live.pressureTrend || "steady";
    data.current.pressureRapidDrop = Boolean(live.pressureRapidDrop);
    data.current.todayHigh = typeof live.todayHighF === "number" ? live.todayHighF : null;
    data.current.todayLow = typeof live.todayLowF === "number" ? live.todayLowF : null;
    data.wind.speed = typeof live.windSpeed === "number" ? live.windSpeed : null;
    data.wind.gust = typeof live.windGust === "number" ? live.windGust : null;
    data.wind.directionDeg = typeof live.windDir === "number" ? live.windDir : null;
    data.rainfall.daily = typeof live.rainDailyIn === "number" ? live.rainDailyIn : null;
    data.rainfall.rate = typeof live.rainRateInHr === "number" ? live.rainRateInHr : null;
    renderCurrentConditions();
    renderWindPanel();
    renderRainPanel();
    renderCenterConditionsPanel();
  } catch (error) {
    console.error("Failed to load live Tempest current data:", error);
  }
}

async function updateGraphHistory() {
  try {
    const [tempResp, pressureResp] = await Promise.all([fetch("http://localhost:3000/api/history/temperature"), fetch("http://localhost:3000/api/history/pressure")]);
    if (!tempResp.ok || !pressureResp.ok) throw new Error("History fetch failed");
    const tempJson = await tempResp.json();
    const pressureJson = await pressureResp.json();
    data.history.temperature = Array.isArray(tempJson.points) ? tempJson.points : [];
    data.history.startOfDayMs = tempJson.startOfDayMs;
    data.history.endOfDayMs = tempJson.endOfDayMs;
    if (typeof tempJson.todayHighF === "number") data.current.todayHigh = tempJson.todayHighF;
    if (typeof tempJson.todayLowF === "number") data.current.todayLow = tempJson.todayLowF;
    data.history.pressure = Array.isArray(pressureJson.points) ? pressureJson.points : [];
    data.history.pressureStartMs = pressureJson.startMs;
    data.history.pressureEndMs = pressureJson.endMs;
    drawTempGraph();
    drawPressureGraph();
    drawTempRing();
    renderCenterConditionsPanel();
  } catch (error) {
    console.error("Failed to load graph history:", error);
  }
}

function scheduleLightningRefresh(ms) {
  if (lightningTimer) clearTimeout(lightningTimer);
  lightningTimer = setTimeout(updateLiveLightning, ms);
}

async function updateLiveLightning() {
  try {
    const response = await fetch("http://localhost:3000/api/tempest/lightning");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const live = await response.json();
    data.lightning.lastStrikeEpoch = typeof live.lastStrikeEpoch === "number" ? live.lastStrikeEpoch : null;
    data.lightning.lastStrikeDistanceMiles = typeof live.lastStrikeDistanceMiles === "number" ? live.lastStrikeDistanceMiles : null;
    data.lightning.lastStrikeDirection = live.lastStrikeDirection || null;
    data.lightning.minuteCount = typeof live.minuteCount === "number" ? live.minuteCount : null;
    data.lightning.fifteenMinuteCount = typeof live.fifteenMinuteCount === "number" ? live.fifteenMinuteCount : null;
    data.lightning.hourCount = typeof live.hourCount === "number" ? live.hourCount : null;
    data.lightning.todayCount = typeof live.todayCount === "number" ? live.todayCount : null;
    data.lightning.countsRadiusMiles = typeof live.countsRadiusMiles === "number" ? live.countsRadiusMiles : 10;
    data.lightning.disclaimer = live.disclaimer || "Lightning data is subject to interference and detection limits.";
    renderLightningPanel();
    const nextMs = live.fastPolling ? 3000 : 30000;
    scheduleLightningRefresh(nextMs);
  } catch (error) {
    console.error("Failed to load live lightning data:", error);
    scheduleLightningRefresh(30000);
  }
}

async function updateLiveNwsAlerts() {
  try {
    const response = await fetch("http://localhost:3000/api/nws-alerts");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const live = await response.json();
    data.alerts = Array.isArray(live.alerts) ? live.alerts : [];
    renderWarnings(false);
    renderSubscreenAlert();
  } catch (error) {
    console.error("Failed to load NWS alerts:", error);
    data.alerts = [];
    renderWarnings(false);
    renderSubscreenAlert();
  }
}

async function loadRegionalTemps() {
  const layer = document.getElementById("regional-temps-layer");
  if (!layer) return;
  try {
    const response = await fetch("http://localhost:3000/api/regional-temps");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const regional = await response.json();
    data.regionalTemps.updatedAt = regional.updatedAt || null;
    data.regionalTemps.asOfLabel = regional.asOfLabel || "As of: --";
    data.regionalTemps.cities = Array.isArray(regional.cities) ? regional.cities : [];
    setText("regional-asof", data.regionalTemps.asOfLabel);
    layer.innerHTML = "";
    data.regionalTemps.cities.forEach((city) => {
      if (typeof city.tempF !== "number") return;
      const ll = REGIONAL_CITY_LATLON[city.id];
      if (!ll) return;
      const projected = projectRegionalLatLon(ll.lat, ll.lon);
      const el = document.createElement("div");
      el.className = "regional-temp";
      el.style.left = `${projected.x}px`;
      el.style.top = `${projected.y}px`;
      el.style.color = getBlendedTempColor(city.tempF);
      el.textContent = `${city.tempF}°`;
      layer.appendChild(el);
    });
  } catch (error) {
    console.error("Regional temp load failed", error);
  }
}

function createSvgEl(name, attrs = {}) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", name);
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
  return el;
}

function getSmoothPath(points) {
  if (!points.length) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? i : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

function drawTempGraph() {
  const svg = document.getElementById("temp-graph");
  if (!svg) return;
  svg.innerHTML = "";
  const width = 860;
  const height = 360;
  const pad = { top: 20, right: 20, bottom: 42, left: 46 };
  const chartW = width - pad.left - pad.right;
  const chartH = height - pad.top - pad.bottom;
  const points = data.history.temperature || [];
  if (!points.length || !data.history.startOfDayMs || !data.history.endOfDayMs) return;
  const startMs = data.history.startOfDayMs;
  const endMs = data.history.endOfDayMs;
  const valid = points.filter((p) => typeof p.value === "number");
  if (!valid.length) return;
  const minVal = Math.floor((Math.min(...valid.map((p) => p.value)) - 2) / 2) * 2;
  const maxVal = Math.ceil((Math.max(...valid.map((p) => p.value)) + 2) / 2) * 2;
  const x = (ms) => pad.left + ((ms - startMs) / (endMs - startMs || 1)) * chartW;
  const y = (val) => pad.top + ((maxVal - val) / (maxVal - minVal || 1)) * chartH;
  const defs = createSvgEl("defs");
  const strokeGrad = createSvgEl("linearGradient", { id: "tempStrokeGradient", x1: "0%", y1: "0%", x2: "100%", y2: "0%" });
  strokeGrad.append(createSvgEl("stop", { offset: "0%", "stop-color": "#6fd0ff" }), createSvgEl("stop", { offset: "42%", "stop-color": "#eaf7ff" }), createSvgEl("stop", { offset: "78%", "stop-color": "#ffb060" }), createSvgEl("stop", { offset: "100%", "stop-color": "#ff7a45" }));
  const fillGrad = createSvgEl("linearGradient", { id: "tempFillGradient", x1: "0%", y1: "0%", x2: "0%", y2: "100%" });
  fillGrad.append(createSvgEl("stop", { offset: "0%", "stop-color": "#84c9ff", "stop-opacity": ".22" }), createSvgEl("stop", { offset: "55%", "stop-color": "#84c9ff", "stop-opacity": ".08" }), createSvgEl("stop", { offset: "100%", "stop-color": "#84c9ff", "stop-opacity": "0" }));
  defs.append(strokeGrad, fillGrad);
  svg.appendChild(defs);
  for (let i = 0; i <= 4; i++) {
    const val = minVal + ((maxVal - minVal) * i / 4);
    svg.appendChild(createSvgEl("line", { x1: pad.left, y1: y(val), x2: width - pad.right, y2: y(val), class: "graph-grid-line" }));
    const label = createSvgEl("text", { x: pad.left - 8, y: y(val) + 4, "text-anchor": "end", class: "graph-axis-label" });
    label.textContent = `${Math.round(val)}°`;
    svg.appendChild(label);
  }
  for (let hour = 0; hour <= 24; hour += 3) {
    const ms = startMs + hour * 60 * 60 * 1000;
    svg.appendChild(createSvgEl("line", { x1: x(ms), y1: pad.top, x2: x(ms), y2: pad.top + chartH, class: "graph-grid-line" }));
    const label = createSvgEl("text", { x: x(ms), y: height - 14, "text-anchor": "middle", class: "graph-axis-label-small" });
    if (hour === 0 || hour === 24) label.textContent = "12a";
    else if (hour < 12) label.textContent = `${hour}a`;
    else if (hour === 12) label.textContent = "12p";
    else label.textContent = `${hour - 12}p`;
    svg.appendChild(label);
  }
  const plotPoints = valid.map((p) => ({ x: x(p.epochMs), y: y(p.value), value: p.value, epochMs: p.epochMs }));
  const lineD = getSmoothPath(plotPoints);
  const first = plotPoints[0];
  const last = plotPoints[plotPoints.length - 1];
  const fillD = `${lineD} L ${last.x} ${pad.top + chartH} L ${first.x} ${pad.top + chartH} Z`;
  svg.appendChild(createSvgEl("path", { d: fillD, class: "graph-temp-fill" }));
  svg.appendChild(createSvgEl("path", { d: lineD, class: "graph-temp-line" }));
  const highPoint = plotPoints.reduce((a, b) => b.value > a.value ? b : a);
  const lowPoint = plotPoints.reduce((a, b) => b.value < a.value ? b : a);
  drawGraphCallout(svg, highPoint.x, highPoint.y, `HIGH ${Math.round(highPoint.value)}°`, formatShortTime(new Date(highPoint.epochMs)), "high");
  drawGraphCallout(svg, lowPoint.x, lowPoint.y, `LOW ${Math.round(lowPoint.value)}°`, formatShortTime(new Date(lowPoint.epochMs)), "low");
  svg.appendChild(createSvgEl("circle", { cx: last.x, cy: last.y, r: 6, class: "graph-point-now" }));
  const nowText = createSvgEl("text", { x: last.x - 8, y: last.y - 14, "text-anchor": "end", class: "graph-label-text-sub" });
  nowText.textContent = "NOW";
  svg.appendChild(nowText);
}

function drawPressureGraph() {
  const svg = document.getElementById("pressure-graph");
  if (!svg) return;
  svg.innerHTML = "";
  const width = 860;
  const height = 360;
  const pad = { top: 20, right: 20, bottom: 42, left: 60 };
  const chartW = width - pad.left - pad.right;
  const chartH = height - pad.top - pad.bottom;
  const points = data.history.pressure || [];
  if (!points.length || !data.history.pressureStartMs || !data.history.pressureEndMs) return;
  const startMs = data.history.pressureStartMs;
  const endMs = data.history.pressureEndMs;
  const valid = points.filter((p) => typeof p.value === "number");
  if (!valid.length) return;
  const minVal = Math.min(...valid.map((p) => p.value));
  const maxVal = Math.max(...valid.map((p) => p.value));
  const paddedMin = Number((minVal - 0.02).toFixed(2));
  const paddedMax = Number((maxVal + 0.02).toFixed(2));
  const x = (ms) => pad.left + ((ms - startMs) / (endMs - startMs || 1)) * chartW;
  const y = (val) => pad.top + ((paddedMax - val) / (paddedMax - paddedMin || 1)) * chartH;
  for (let i = 0; i <= 4; i++) {
    const val = paddedMin + ((paddedMax - paddedMin) * i / 4);
    svg.appendChild(createSvgEl("line", { x1: pad.left, y1: y(val), x2: width - pad.right, y2: y(val), class: "graph-grid-line" }));
    const label = createSvgEl("text", { x: pad.left - 8, y: y(val) + 4, "text-anchor": "end", class: "graph-axis-label" });
    label.textContent = `${val.toFixed(2)}`;
    svg.appendChild(label);
  }
  for (let i = 0; i <= 6; i++) {
    const ms = startMs + ((endMs - startMs) * i / 6);
    svg.appendChild(createSvgEl("line", { x1: x(ms), y1: pad.top, x2: x(ms), y2: pad.top + chartH, class: "graph-grid-line" }));
    const label = createSvgEl("text", { x: x(ms), y: height - 14, "text-anchor": "middle", class: "graph-axis-label-small" });
    label.textContent = new Date(ms).toLocaleTimeString([], { hour: "numeric", hour12: true }).toLowerCase().replace(" ", "");
    svg.appendChild(label);
  }
  const plotPoints = valid.map((p) => ({ x: x(p.epochMs), y: y(p.value), value: p.value, epochMs: p.epochMs }));
  const lineD = getSmoothPath(plotPoints);
  svg.appendChild(createSvgEl("path", { d: lineD, class: "graph-pressure-line" }));
  const last = plotPoints[plotPoints.length - 1];
  svg.appendChild(createSvgEl("circle", { cx: last.x, cy: last.y, r: 6, class: "graph-point-now" }));
  const nowText = createSvgEl("text", { x: last.x - 8, y: last.y - 14, "text-anchor": "end", class: "graph-label-text-sub" });
  nowText.textContent = "NOW";
  svg.appendChild(nowText);
}

function drawGraphCallout(svg, cx, cy, main, sub, type) {
  const boxWidth = Math.max(124, main.length * 7 + 22);
  const boxHeight = 38;
  const bx = Math.min(Math.max(cx + 12, 16), 860 - boxWidth - 10);
  const by = type === "high" ? cy - 52 : cy - 18;
  svg.appendChild(createSvgEl("rect", { x: bx, y: by, width: boxWidth, height: boxHeight, class: "graph-label-box" }));
  svg.appendChild(createSvgEl("circle", { cx, cy, r: 6, class: type === "high" ? "graph-point-high" : "graph-point-low" }));
  const t1 = createSvgEl("text", { x: bx + 10, y: by + 15, class: "graph-label-text-main" });
  t1.textContent = main;
  svg.appendChild(t1);
  const t2 = createSvgEl("text", { x: bx + 10, y: by + 28, class: "graph-label-text-sub" });
  t2.textContent = sub;
  svg.appendChild(t2);
}

function drawTempRing() {
  const svg = document.getElementById("temp-ring-svg");
  if (!svg) return;
  svg.innerHTML = "";
  const center = 180;
  const radius = 126;
  const stroke = 18;
  const high = typeof data.current.todayHigh === "number" ? data.current.todayHigh : data.current.temp;
  const low = typeof data.current.todayLow === "number" ? data.current.todayLow : data.current.temp;
  const current = typeof data.current.temp === "number" ? data.current.temp : null;
  if (typeof current !== "number" || typeof high !== "number" || typeof low !== "number") return;
  const startAngle = 135;
  const endAngle = 405;
  const span = endAngle - startAngle;
  let pct = 0.5;
  if (high !== low) pct = (current - low) / (high - low);
  pct = Math.max(0, Math.min(1, pct));
  const activeEnd = startAngle + span * pct;
  const color = getBlendedTempColor(current);
  svg.appendChild(createArcPath(center, center, radius, startAngle, endAngle, "temp-ring-base", stroke));
  const activeArc = createArcPath(center, center, radius, startAngle, activeEnd, "temp-ring-active", stroke);
  activeArc.setAttribute("stroke", color);
  svg.appendChild(activeArc);
  setText("ring-high-temp", `${Math.round(high)}°`);
  setText("ring-low-temp", `${Math.round(low)}°`);
  setText("ring-current-temp", `${current.toFixed(1)}°`);
  setText("ring-feels-like", typeof data.current.feelsLike === "number" ? `Feels Like ${data.current.feelsLike}°` : "Feels Like N/A");
  const trendEl = document.getElementById("ring-temp-trend");
  if (trendEl) {
    trendEl.textContent = "";
    trendEl.className = "ring-temp-trend";
    if (data.current.tempTrend === "up") {
      trendEl.textContent = "▲";
      trendEl.classList.add("visible", "up");
    } else if (data.current.tempTrend === "down") {
      trendEl.textContent = "▼";
      trendEl.classList.add("visible", "down");
    }
  }
}

function polarToCartesian(cx, cy, r, angleDeg) {
  const angleRad = (angleDeg - 90) * Math.PI / 180;
  return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) };
}

function createArcPath(cx, cy, r, startAngle, endAngle, className, strokeWidth) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return createSvgEl("path", { d: ["M", start.x, start.y, "A", r, r, 0, largeArcFlag, 0, end.x, end.y].join(" "), class: className, "stroke-width": strokeWidth });
}

function renderCenterConditionsPanel() {
  if (!document.getElementById("ring-current-temp")) return;
  drawTempRing();
  setText("center-dew", formatValue(data.current.dew, "°"));
  setText("center-humidity", formatValue(data.current.humidity, "%"));
  setText("center-wind", `${degToCompass(data.wind.directionDeg)} ${formatValue(data.wind.speed)}G${formatValue(data.wind.gust)}`);
  setText("center-pressure", typeof data.current.pressureIn === "number" ? `${data.current.pressureIn.toFixed(2)}" ${data.current.pressureTrend === "up" ? "▲" : data.current.pressureTrend === "down" ? "▼" : ""}` : "N/A");
  const pressureTrendEl = document.getElementById("subscreen-pressure-trend");
  if (pressureTrendEl) {
    pressureTrendEl.textContent = data.current.pressureTrend === "up" ? "▲" : data.current.pressureTrend === "down" ? "▼" : "";
  }
}

function getSubscreenConditionSets() {
  const tempArrow = data.current.tempTrend === "up" ? `<span class="subscreen-condition-up">▲</span>` : data.current.tempTrend === "down" ? `<span class="subscreen-condition-down">▼</span>` : "";
  const pressureArrow = data.current.pressureTrend === "up" ? `<span class="subscreen-condition-pressure-up">▲</span>` : data.current.pressureTrend === "down" ? `<span class="subscreen-condition-pressure-down">▼</span>` : "";
  const lightningText = typeof data.lightning.hourCount === "number" ? `${data.lightning.hourCount} within 10 mi` : "None within 10 mi";
  return [
    `
      <span class="subscreen-condition-temp">${formatFixed(data.current.temp, 1, "°")} ${tempArrow}</span>
      <span class="subscreen-condition-sep">|</span>
      <span>Feels ${formatValue(data.current.feelsLike, "°")}</span>
      <span class="subscreen-condition-sep">|</span>
      <span>Wind ${degToCompass(data.wind.directionDeg)} ${formatValue(data.wind.speed)}G${formatValue(data.wind.gust)}</span>
      <span class="subscreen-condition-sep">|</span>
      <span>Humidity ${formatValue(data.current.humidity, "%")}</span>
      <span class="subscreen-condition-sep">|</span>
      <span>Pressure ${typeof data.current.pressureIn === "number" ? `${data.current.pressureIn.toFixed(2)}"` : "N/A"} ${pressureArrow}</span>
    `,
    `
      <span>Dewpoint ${formatValue(data.current.dew, "°")}</span>
      <span class="subscreen-condition-sep">|</span>
      <span>Rain Today ${typeof data.rainfall.daily === "number" ? `${data.rainfall.daily.toFixed(2)}"` : `0.00"`}</span>
      <span class="subscreen-condition-sep">|</span>
      <span>Rain Rate ${typeof data.rainfall.rate === "number" ? `${data.rainfall.rate.toFixed(2)}"/hr` : `0.00"/hr`}</span>
      <span class="subscreen-condition-sep">|</span>
      <span>Lightning ${lightningText}</span>
    `
  ];
}

function showSubscreenConditionSet(index) {
  const track = document.getElementById("subscreen-conditions-track");
  if (!track) return;
  const sets = getSubscreenConditionSets();
  const html = sets[index % sets.length];
  const nextLine = document.createElement("div");
  nextLine.className = "subscreen-condition-line";
  nextLine.innerHTML = html;
  track.appendChild(nextLine);
  requestAnimationFrame(() => {
    nextLine.classList.add("is-active");
    if (activeConditionLine) {
      activeConditionLine.classList.remove("is-active");
      activeConditionLine.classList.add("is-exit");
      setTimeout(() => {
        if (activeConditionLine && activeConditionLine.parentNode) activeConditionLine.parentNode.removeChild(activeConditionLine);
      }, 420);
    }
    activeConditionLine = nextLine;
  });
}

function startSubscreenConditionRotation() {
  const track = document.getElementById("subscreen-conditions-track");
  if (!track) return;
  track.innerHTML = "";
  activeConditionLine = null;
  subscreenConditionSetIndex = 0;
  showSubscreenConditionSet(subscreenConditionSetIndex);
  if (subscreenConditionTimer) clearInterval(subscreenConditionTimer);
  subscreenConditionTimer = setInterval(() => {
    subscreenConditionSetIndex = (subscreenConditionSetIndex + 1) % getSubscreenConditionSets().length;
    showSubscreenConditionSet(subscreenConditionSetIndex);
  }, CONDITION_ROTATE_MS);
}

function renderSubscreenAlert() {
  const ribbon = document.getElementById("subscreen-alert-ribbon");
  const text = document.getElementById("subscreen-alert-text");
  if (!ribbon || !text) return;
  const eligible = (Array.isArray(data.alerts) ? data.alerts : []).filter((alert) => {
    const event = String(alert.event || "").toLowerCase();
    return event.includes("tornado emergency") || event.includes("tornado warning") || event.includes("severe thunderstorm warning");
  });
  if (!eligible.length) {
    ribbon.style.display = "none";
    text.textContent = "";
    return;
  }
  const highest = getSortedAlerts(eligible)[0];
  const theme = getAlertTheme(highest);
  ribbon.style.display = "block";
  ribbon.style.background = `linear-gradient(180deg, ${theme.bg1}, ${theme.bg2})`;
  ribbon.style.borderColor = theme.border;
  text.style.color = theme.text;
  text.textContent = `⚠ ${getShortAlertLabel(highest)} • ${normalizeAlertText(highest.area || "Rush County")} • ${formatMinutesUntil(highest.expires)}`;
}

function getNextScreenHref() {
  const path = window.location.pathname.toLowerCase();
  if (path.endsWith("subscreen-current.html")) return "subscreen-regional-map.html";
  if (path.endsWith("subscreen-regional-map.html")) return "index.html";
  return "subscreen-current.html";
}

function schedulePageRotation() {
  setTimeout(() => {
    document.body.classList.add("page-fade-out");
    setTimeout(() => {
      window.location.href = getNextScreenHref();
    }, SCREEN_FADE_MS);
  }, SCREEN_ROTATE_MS);
}

window.addEventListener("resize", () => {
  renderWarnings(true);
  drawTempGraph();
  drawPressureGraph();
  drawTempRing();
  loadRegionalTemps();
});

function initMainDashboardPage() {
  renderAll();
  updateClock();
  updateLiveTempestCurrent();
  updateGraphHistory();
  updateLiveNwsAlerts();
  updateLiveLightning();
  setInterval(updateClock, 1000);
  setInterval(updateLiveTempestCurrent, 30000);
  setInterval(updateGraphHistory, 60000);
  setInterval(updateLiveNwsAlerts, 60000);
  schedulePageRotation();
}

function initSubscreenCurrentPage() {
  updateClock();
  renderCenterConditionsPanel();
  drawTempGraph();
  drawPressureGraph();
  drawTempRing();
  updateLiveTempestCurrent();
  updateGraphHistory();
  updateLiveNwsAlerts();
  updateLiveLightning();
  startSubscreenConditionRotation();
  setInterval(updateClock, 1000);
  setInterval(updateLiveTempestCurrent, 30000);
  setInterval(updateGraphHistory, 60000);
  setInterval(updateLiveNwsAlerts, 60000);
  schedulePageRotation();
}

function initRegionalMapPage() {
  updateClock();
  loadRegionalTemps();
  setInterval(updateClock, 1000);
  setInterval(loadRegionalTemps, 60000);
  schedulePageRotation();
}

document.addEventListener("DOMContentLoaded", () => {
  const isRegionalMap = !!document.querySelector(".regional-map-shell");
  const isSubscreen = !!document.querySelector(".subscreen-current-v2") && !isRegionalMap;
  if (isRegionalMap) {
    initRegionalMapPage();
    return;
  }
  if (isSubscreen) {
    initSubscreenCurrentPage();
    return;
  }
  initMainDashboardPage();
});
