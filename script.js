const data = {
  current: {
    temp: null,
    condition: "N/A",
    dew: null,
    humidity: null,
    pressureIn: null,
    pressureMb: null
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
  today: {
    high: 75,
    low: 51
  },
  forecast: [
    { label: "Today", high: 70, low: 44, cond: "Storm", pop: 40 },
    { label: "Mon", high: 62, low: 45, cond: "Storm", pop: 30 },
    { label: "Tue", high: 68, low: 50, cond: "Storm", pop: 20 }
  ],
  alerts: []
};

const radarConfig = {
  center: [39.6092, -85.4464],
  zoom: 9,
  radar: "KIND",
  product: "N0Q",
  frames: 6,
  animationMs: 850,
  refreshMs: 120000,
  cities: [
    { name: "Indianapolis", lat: 39.7684, lon: -86.1581 },
    { name: "Rushville", lat: 39.6092, lon: -85.4464 },
    { name: "Shelbyville", lat: 39.5214, lon: -85.7769 },
    { name: "Greensburg", lat: 39.3373, lon: -85.4836 },
    { name: "Connersville", lat: 39.6412, lon: -85.1411 },
    { name: "Franklin", lat: 39.4806, lon: -86.0549 }
  ],
  highways: [
    { name: "I-74", lat: 39.58, lon: -85.82 },
    { name: "I-70", lat: 39.78, lon: -85.94 },
    { name: "US 52", lat: 39.63, lon: -85.53 },
    { name: "SR 44", lat: 39.48, lon: -85.83 },
    { name: "SR 3", lat: 39.70, lon: -85.62 },
    { name: "SR 244", lat: 39.32, lon: -85.35 },
    { name: "US 40", lat: 39.80, lon: -85.76 },
    { name: "I-465", lat: 39.79, lon: -86.06 },
    { name: "I-65", lat: 39.32, lon: -85.98 },
    { name: "SR 9", lat: 39.67, lon: -85.61 },
    { name: "US 31", lat: 39.28, lon: -85.97 }
  ]
};

const radarState = {
  map: null,
  frameLayers: [],
  frameTimes: [],
  frameIndex: 0,
  animationTimer: null,
  refreshTimer: null,
  latestLayer: null
};

let tickerTimer = null;
let tickerIndex = 0;
let lastAlertSignature = "";
let lightningTimer = null;

function tempColor(temp) {
  if (typeof temp !== "number") return "#ffffff";
  if (temp <= 30) return "#70C0FF";
  if (temp <= 40) return "#60B0FF";
  if (temp <= 50) return "#50A0FF";
  if (temp <= 60) return "#70D0A0";
  if (temp <= 70) return "#FFC8C8";
  if (temp <= 80) return "#FFB060";
  if (temp <= 90) return "#FF9040";
  if (temp <= 100) return "#FF7040";
  return "#FF5030";
}

function applyTempColor(el, temp) {
  if (!el) return;
  el.style.color = tempColor(temp);
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

function degToCompass(num) {
  if (typeof num !== "number") return "N/A";
  const val = Math.floor((num / 22.5) + 0.5);
  const arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return arr[val % 16];
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function updateClock() {
  const now = new Date();
  const str = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short"
  });
  setText("clock", str);
}

function getRainIntensity(rate) {
  if (typeof rate !== "number" || rate <= 0) return "None";
  if (rate <= 0.03) return "Drizzle";
  if (rate <= 0.10) return "Light Rain";
  if (rate <= 0.30) return "Moderate Rain";
  if (rate <= 0.50) return "Heavy Rain";
  return "Downpour";
}

function getRainIntensityColor(rate) {
  if (typeof rate !== "number" || rate <= 0) return "#aeb8c7";
  if (rate <= 0.03) return "#b9dcff";
  if (rate <= 0.10) return "#8fd0ff";
  if (rate <= 0.30) return "#74efff";
  if (rate <= 0.50) return "#5cb8ff";
  return "#7f8cff";
}

function normalizeAlertText(text) {
  return String(text || "")
    .replace(/\s+/g, " ")
    .replace(/\n+/g, " ")
    .trim();
}

function alertBlob(alert) {
  return [
    alert.event || "",
    alert.headline || "",
    alert.description || "",
    alert.instruction || "",
    alert.severity || ""
  ].join(" ").toLowerCase();
}

function isPds(alert) {
  const blob = alertBlob(alert);
  return blob.includes("particularly dangerous situation") || blob.includes(" pds ");
}

function isDestructiveSevere(alert) {
  const blob = alertBlob(alert);
  return (alert.event || "").toLowerCase().includes("severe thunderstorm warning") &&
    (blob.includes("destructive") || (blob.includes("damage threat") && blob.includes("destructive")));
}

function isConsiderableSevere(alert) {
  const blob = alertBlob(alert);
  return (alert.event || "").toLowerCase().includes("severe thunderstorm warning") &&
    (blob.includes("considerable") || (blob.includes("damage threat") && blob.includes("considerable")));
}

function isCivilMessage(alert) {
  const event = String(alert.event || "").toLowerCase();
  return event.includes("civil danger warning") ||
    event.includes("civil emergency message") ||
    event.includes("law enforcement warning") ||
    event.includes("local area emergency") ||
    event.includes("911 telephone outage emergency") ||
    event.includes("evacuation immediate");
}

function isWinterWarning(alert) {
  const event = String(alert.event || "").toLowerCase();
  return event.includes("winter storm warning") ||
    event.includes("blizzard warning") ||
    event.includes("ice storm warning") ||
    event.includes("snow squall warning") ||
    event.includes("wind chill warning") ||
    event.includes("lake effect snow warning") ||
    event.includes("extreme cold warning");
}

function isWinterWatch(alert) {
  const event = String(alert.event || "").toLowerCase();
  return event.includes("winter storm watch") ||
    event.includes("blizzard watch") ||
    event.includes("ice storm watch") ||
    event.includes("wind chill watch") ||
    event.includes("lake effect snow watch");
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

  if (event.includes("tornado emergency")) {
    return {
      bg1: "#6f1ab1",
      bg2: "#4a0f7a",
      title1: "#7d24c7",
      title2: "#53118a",
      border: "#c58cff",
      text: "#ffffff",
      chipBg: "rgba(255,255,255,0.12)",
      chipBorder: "rgba(255,255,255,0.22)"
    };
  }

  if (event.includes("tornado warning") && isPds(alert)) {
    return {
      bg1: "#cf0000",
      bg2: "#8f0000",
      title1: "#e00000",
      title2: "#a90000",
      border: "#ff9090",
      text: "#ffffff",
      chipBg: "rgba(255,255,255,0.12)",
      chipBorder: "rgba(255,255,255,0.22)"
    };
  }

  if (event.includes("tornado warning")) {
    return {
      bg1: "#ef0000",
      bg2: "#b10000",
      title1: "#ff2222",
      title2: "#c20000",
      border: "#ff9a9a",
      text: "#ffffff",
      chipBg: "rgba(255,255,255,0.12)",
      chipBorder: "rgba(255,255,255,0.22)"
    };
  }

  if (isDestructiveSevere(alert)) {
    return {
      bg1: "#ff6a00",
      bg2: "#d33d00",
      title1: "#ff7b14",
      title2: "#e64c00",
      border: "#ffc08f",
      text: "#111111",
      chipBg: "rgba(255,255,255,0.22)",
      chipBorder: "rgba(0,0,0,0.18)"
    };
  }

  if (isConsiderableSevere(alert)) {
    return {
      bg1: "#ff8a00",
      bg2: "#e15d00",
      title1: "#ffa01f",
      title2: "#ef6d00",
      border: "#ffd08a",
      text: "#111111",
      chipBg: "rgba(255,255,255,0.22)",
      chipBorder: "rgba(0,0,0,0.18)"
    };
  }

  if (event.includes("severe thunderstorm warning")) {
    return {
      bg1: "#ffe2a6",
      bg2: "#ffc97a",
      title1: "#ffe9b8",
      title2: "#ffd694",
      border: "#ffcf8a",
      text: "#111111",
      chipBg: "rgba(0,0,0,0.05)",
      chipBorder: "rgba(0,0,0,0.12)"
    };
  }

  if (event.includes("flash flood warning")) {
    return {
      bg1: "#00a53d",
      bg2: "#007d2f",
      title1: "#16b950",
      title2: "#008736",
      border: "#8ae1aa",
      text: "#ffffff",
      chipBg: "rgba(255,255,255,0.12)",
      chipBorder: "rgba(255,255,255,0.22)"
    };
  }

  if (event.includes("flood warning") || event.includes("flood advisory")) {
    return {
      bg1: "#2f9e44",
      bg2: "#1f6d2d",
      title1: "#39b54a",
      title2: "#2a873a",
      border: "#8dd7a0",
      text: "#ffffff",
      chipBg: "rgba(255,255,255,0.12)",
      chipBorder: "rgba(255,255,255,0.22)"
    };
  }

  if (isWinterWarning(alert)) {
    return {
      bg1: "#efefef",
      bg2: "#d6d6d6",
      title1: "#f7f7f7",
      title2: "#e0e0e0",
      border: "#ffffff",
      text: "#111111",
      chipBg: "rgba(0,0,0,0.06)",
      chipBorder: "rgba(0,0,0,0.12)"
    };
  }

  if (event.includes("tornado watch")) {
    return {
      bg1: "#8c1b2a",
      bg2: "#5f111b",
      title1: "#9f2231",
      title2: "#6a1520",
      border: "#d68792",
      text: "#ffffff",
      chipBg: "rgba(255,255,255,0.12)",
      chipBorder: "rgba(255,255,255,0.22)"
    };
  }

  if (event.includes("severe thunderstorm watch")) {
    return {
      bg1: "#9f6800",
      bg2: "#764b00",
      title1: "#b87900",
      title2: "#875600",
      border: "#e0c07a",
      text: "#ffffff",
      chipBg: "rgba(255,255,255,0.12)",
      chipBorder: "rgba(255,255,255,0.22)"
    };
  }

  if (event.includes("flash flood watch") || event.includes("flood watch")) {
    return {
      bg1: "#5e7a15",
      bg2: "#445910",
      title1: "#6b8919",
      title2: "#4c6312",
      border: "#b9cf7f",
      text: "#ffffff",
      chipBg: "rgba(255,255,255,0.12)",
      chipBorder: "rgba(255,255,255,0.22)"
    };
  }

  if (isWinterWatch(alert)) {
    return {
      bg1: "#adb3ba",
      bg2: "#888f97",
      title1: "#bcc1c8",
      title2: "#949ca4",
      border: "#e8ecf0",
      text: "#111111",
      chipBg: "rgba(0,0,0,0.06)",
      chipBorder: "rgba(0,0,0,0.12)"
    };
  }

  if (isCivilMessage(alert)) {
    return {
      bg1: "#1c1c1c",
      bg2: "#000000",
      title1: "#2a2a2a",
      title2: "#101010",
      border: "#5d5d5d",
      text: "#ffffff",
      chipBg: "rgba(255,255,255,0.10)",
      chipBorder: "rgba(255,255,255,0.18)"
    };
  }

  return {
    bg1: "#fff9cc",
    bg2: "#fff1a8",
    title1: "#fffbe0",
    title2: "#fff4b8",
    border: "#fff0a0",
    text: "#111111",
    chipBg: "rgba(0,0,0,0.05)",
    chipBorder: "rgba(0,0,0,0.12)"
  };
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
  if (lower.includes("flash flood warning")) return "FLASH FLOOD WARNING";
  if (lower.includes("flood warning")) return "FLOOD WARNING";
  if (lower.includes("flood advisory")) return "FLOOD ADVISORY";
  if (lower.includes("winter storm warning")) return "WINTER STORM WARNING";
  if (lower.includes("blizzard warning")) return "BLIZZARD WARNING";
  if (lower.includes("ice storm warning")) return "ICE STORM WARNING";
  if (lower.includes("tornado watch") && isPds(alert)) return "PDS TORNADO WATCH";
  if (lower.includes("tornado watch")) return "TORNADO WATCH";
  if (lower.includes("severe thunderstorm watch")) return "SVR T-STORM WATCH";
  if (lower.includes("flash flood watch")) return "FLASH FLOOD WATCH";
  if (lower.includes("flood watch")) return "FLOOD WATCH";
  if (lower.includes("wind advisory")) return "WIND ADVISORY";
  if (lower.includes("winter weather advisory")) return "WINTER WX ADVISORY";
  if (lower.includes("civil danger warning")) return "CIVIL DANGER WARNING";
  if (lower.includes("civil emergency message")) return "CIVIL EMERGENCY MESSAGE";

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

    if (list.scrollWidth > maxWidth && list.children.length === 1) {
      list.innerHTML = "";
      list.appendChild(createChip("+"));
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

  const signature = JSON.stringify(
    sortedAlerts.map((alert) => ({
      event: alert.event || "",
      headline: alert.headline || "",
      description: alert.description || ""
    }))
  );

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
  setText(
    "lt-distance",
    typeof data.lightning.lastStrikeDistanceMiles === "number"
      ? `${data.lightning.lastStrikeDistanceMiles.toFixed(1)} mi`
      : "N/A"
  );
  setText("lt-direction", data.lightning.lastStrikeDirection || "N/A");

  setText("lt-minute", formatValue(data.lightning.minuteCount));
  setText("lt-fifteen", formatValue(data.lightning.fifteenMinuteCount));
  setText("lt-hour", formatValue(data.lightning.hourCount));
  setText("lt-midnight", formatValue(data.lightning.todayCount));

  renderLightningWarning();
}

function renderForecast() {
  for (let i = 0; i < 3; i++) {
    const item = data.forecast[i];
    if (!item) continue;

    setText(`f${i}-label`, item.label || `Day ${i + 1}`);
    setText(`f${i}-high`, typeof item.high === "number" ? `${item.high}°` : "N/A");
    setText(`f${i}-low`, typeof item.low === "number" ? `${item.low}°` : "N/A");
    setText(`f${i}-cond`, item.cond || "Forecast");
    setText(`f${i}-pop`, typeof item.pop === "number" ? `${item.pop}%` : "--");

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

function renderCurrentConditions() {
  setText("current-condition", data.current.condition || "N/A");
  setText("current-temp", formatFixed(data.current.temp, 1, "°"));
  setText("current-dew", formatValue(data.current.dew, "°"));
  setText("current-humidity", formatValue(data.current.humidity, "%"));

  const pressureText =
    (typeof data.current.pressureIn === "number" && typeof data.current.pressureMb === "number")
      ? `${data.current.pressureIn.toFixed(2)}" / ${data.current.pressureMb} MB`
      : "N/A";

  setText("current-pressure", pressureText);

  applyTempColor(document.getElementById("current-temp"), data.current.temp);
  applyTempColor(document.getElementById("current-dew"), data.current.dew);
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

  setText("today-high", `${data.today.high}°`);
  setText("today-low", `${data.today.low}°`);
  applyTempColor(document.getElementById("today-high"), data.today.high);
  applyTempColor(document.getElementById("today-low"), data.today.low);

  renderForecast();
  renderWarnings(true);
  renderLightningPanel();
  updateClock();
}

function setRadarStatus(text) {
  setText("radar-status", text);
}

function radarStampToDisplay(stamp) {
  if (!stamp || stamp === "0") return "latest";
  const m = stamp.match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})$/);
  if (!m) return stamp;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]));
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true, timeZoneName: "short" });
}

function createRadarTileLayer(stamp) {
  return L.tileLayer(
    `https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/ridge::${radarConfig.radar}-${radarConfig.product}-${stamp}/{z}/{x}/{y}.png`,
    {
      pane: "radarPane",
      opacity: 0,
      maxZoom: 12,
      updateWhenIdle: false,
      updateWhenZooming: false
    }
  );
}

function clearRadarFrames() {
  if (radarState.animationTimer) {
    clearInterval(radarState.animationTimer);
    radarState.animationTimer = null;
  }

  radarState.frameLayers.forEach((layer) => {
    if (radarState.map && radarState.map.hasLayer(layer)) {
      radarState.map.removeLayer(layer);
    }
  });

  radarState.frameLayers = [];
  radarState.frameTimes = [];
  radarState.frameIndex = 0;

  if (radarState.latestLayer && radarState.map && radarState.map.hasLayer(radarState.latestLayer)) {
    radarState.map.removeLayer(radarState.latestLayer);
  }
  radarState.latestLayer = null;
}

function showRadarFrame(index) {
  radarState.frameLayers.forEach((layer, i) => {
    layer.setOpacity(i === index ? 0.9 : 0);
  });
  radarState.frameIndex = index;
  const stamp = radarState.frameTimes[index];
  setRadarStatus(`KIND • ${radarStampToDisplay(stamp)}`);
}

function startRadarAnimation() {
  if (!radarState.frameLayers.length) return;
  showRadarFrame(0);
  radarState.animationTimer = setInterval(() => {
    const next = (radarState.frameIndex + 1) % radarState.frameLayers.length;
    showRadarFrame(next);
  }, radarConfig.animationMs);
}

function extractRadarStamps(json) {
  const found = [];

  function scan(value) {
    if (value == null) return;
    if (typeof value === "string") {
      const m = value.match(/(\d{12})/);
      if (m) found.push(m[1]);
      return;
    }
    if (Array.isArray(value)) {
      value.forEach(scan);
      return;
    }
    if (typeof value === "object") {
      Object.values(value).forEach(scan);
    }
  }

  scan(json);
  return [...new Set(found)].sort().slice(-radarConfig.frames);
}

async function loadRadarLoop() {
  if (!radarState.map) return;

  try {
    const response = await fetch(
      `https://mesonet.agron.iastate.edu/json/radar.py?operation=list&radar=${radarConfig.radar}&product=${radarConfig.product}`
    );

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const json = await response.json();
    const stamps = extractRadarStamps(json);

    clearRadarFrames();

    if (!stamps.length) {
      throw new Error("No radar timestamps found");
    }

    radarState.frameTimes = stamps;
    radarState.frameLayers = stamps.map(createRadarTileLayer);

    radarState.frameLayers.forEach((layer) => layer.addTo(radarState.map));
    startRadarAnimation();
  } catch (error) {
    console.error("Radar loop load failed:", error);
    clearRadarFrames();
    radarState.latestLayer = createRadarTileLayer("0");
    radarState.latestLayer.setOpacity(0.9);
    radarState.latestLayer.addTo(radarState.map);
    setRadarStatus("KIND • latest");
  }
}

function addRadarLabels() {
  radarConfig.cities.forEach((city) => {
    L.marker([city.lat, city.lon], {
      interactive: false,
      icon: L.divIcon({
        className: "radar-city-label",
        html: city.name,
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      })
    }).addTo(radarState.map);
  });

  radarConfig.highways.forEach((route) => {
    L.marker([route.lat, route.lon], {
      interactive: false,
      icon: L.divIcon({
        className: "radar-highway-label",
        html: route.name,
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      })
    }).addTo(radarState.map);
  });

  L.marker(radarConfig.center, {
    interactive: false,
    icon: L.divIcon({
      className: "",
      html: '<div class="radar-station-dot"></div>',
      iconSize: [10, 10],
      iconAnchor: [5, 5]
    })
  }).addTo(radarState.map);

  L.marker([radarConfig.center[0] + 0.02, radarConfig.center[1] + 0.02], {
    interactive: false,
    icon: L.divIcon({
      className: "radar-station-label",
      html: "Sugar Hill",
      iconSize: [0, 0],
      iconAnchor: [0, 0]
    })
  }).addTo(radarState.map);
}

function initRadar() {
  const mapEl = document.getElementById("radar-map");
  if (!mapEl) return;

  radarState.map = L.map(mapEl, {
    zoomControl: false,
    attributionControl: false,
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    keyboard: false,
    touchZoom: false
  }).setView(radarConfig.center, radarConfig.zoom);

  radarState.map.createPane("basePane");
  radarState.map.createPane("countyPane");
  radarState.map.createPane("radarPane");

  radarState.map.getPane("basePane").style.zIndex = 200;
  radarState.map.getPane("countyPane").style.zIndex = 400;
  radarState.map.getPane("radarPane").style.zIndex = 500;

  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
    {
      pane: "basePane",
      subdomains: "abcd",
      maxZoom: 19
    }
  ).addTo(radarState.map);

  L.tileLayer.wms(
    "https://tigerweb.geo.census.gov/arcgis/services/TIGERweb/tigerWMS_Current/MapServer/WmsServer",
    {
      layers: "82",
      format: "image/png",
      transparent: true,
      opacity: 0.5,
      pane: "countyPane"
    }
  ).addTo(radarState.map);

  addRadarLabels();
  loadRadarLoop();

  radarState.refreshTimer = setInterval(loadRadarLoop, radarConfig.refreshMs);

  setTimeout(() => radarState.map.invalidateSize(), 200);
}

async function updateLiveTempestCurrent() {
  try {
    const response = await fetch("http://localhost:3000/api/tempest/current");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const live = await response.json();

    data.current.temp = typeof live.tempF === "number" ? live.tempF : null;
    data.current.dew = typeof live.dewF === "number" ? live.dewF : null;
    data.current.humidity = typeof live.humidity === "number" ? live.humidity : null;
    data.current.pressureIn = typeof live.pressureIn === "number" ? live.pressureIn : null;
    data.current.pressureMb = typeof live.pressureMb === "number" ? live.pressureMb : null;

    data.wind.speed = typeof live.windSpeed === "number" ? live.windSpeed : null;
    data.wind.gust = typeof live.windGust === "number" ? live.windGust : null;
    data.wind.directionDeg = typeof live.windDir === "number" ? live.windDir : null;

    data.rainfall.daily = typeof live.rainDailyIn === "number" ? live.rainDailyIn : null;
    data.rainfall.rate = typeof live.rainRateInHr === "number" ? live.rainRateInHr : null;

    renderCurrentConditions();
    renderWindPanel();
    renderRainPanel();
  } catch (error) {
    console.error("Failed to load live Tempest current data:", error);

    data.current.temp = null;
    data.current.dew = null;
    data.current.humidity = null;
    data.current.pressureIn = null;
    data.current.pressureMb = null;
    data.wind.speed = null;
    data.wind.gust = null;
    data.wind.directionDeg = null;
    data.rainfall.daily = null;
    data.rainfall.rate = null;

    renderCurrentConditions();
    renderWindPanel();
    renderRainPanel();
  }
}

async function updateLiveForecast() {
  try {
    const response = await fetch("http://localhost:3000/api/nws-forecast");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const live = await response.json();
    const periods = Array.isArray(live.periods) ? live.periods : [];

    if (periods.length) {
      data.forecast = periods.slice(0, 3).map((p, index) => ({
        label: p.label || (index === 0 ? "Today" : `Day ${index + 1}`),
        high: typeof p.high === "number" ? p.high : null,
        low: typeof p.low === "number" ? p.low : null,
        cond: p.cond || "Forecast",
        pop: typeof p.pop === "number" ? p.pop : null
      }));
    }

    renderForecast();
  } catch (error) {
    console.error("Failed to load live forecast:", error);
    renderForecast();
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

    data.lightning.lastStrikeEpoch =
      typeof live.lastStrikeEpoch === "number" ? live.lastStrikeEpoch : null;
    data.lightning.lastStrikeDistanceMiles =
      typeof live.lastStrikeDistanceMiles === "number" ? live.lastStrikeDistanceMiles : null;
    data.lightning.lastStrikeDirection = live.lastStrikeDirection || null;
    data.lightning.minuteCount =
      typeof live.minuteCount === "number" ? live.minuteCount : null;
    data.lightning.fifteenMinuteCount =
      typeof live.fifteenMinuteCount === "number" ? live.fifteenMinuteCount : null;
    data.lightning.hourCount =
      typeof live.hourCount === "number" ? live.hourCount : null;
    data.lightning.todayCount =
      typeof live.todayCount === "number" ? live.todayCount : null;
    data.lightning.countsRadiusMiles =
      typeof live.countsRadiusMiles === "number" ? live.countsRadiusMiles : 10;
    data.lightning.disclaimer =
      live.disclaimer || "Lightning data is subject to interference and detection limits.";

    renderLightningPanel();

    const nextMs = live.fastPolling ? 3000 : 30000;
    scheduleLightningRefresh(nextMs);
  } catch (error) {
    console.error("Failed to load live lightning data:", error);

    data.lightning.lastStrikeEpoch = null;
    data.lightning.lastStrikeDistanceMiles = null;
    data.lightning.lastStrikeDirection = null;
    data.lightning.minuteCount = null;
    data.lightning.fifteenMinuteCount = null;
    data.lightning.hourCount = null;
    data.lightning.todayCount = null;

    renderLightningPanel();
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
  } catch (error) {
    console.error("Failed to load NWS alerts:", error);
    data.alerts = [];
    renderWarnings(false);
  }
}

window.addEventListener("resize", () => {
  renderWarnings(true);
  if (radarState.map) {
    setTimeout(() => radarState.map.invalidateSize(), 100);
  }
});

renderAll();
updateClock();
updateLiveTempestCurrent();
updateLiveForecast();
updateLiveNwsAlerts();
updateLiveLightning();
initRadar();

setInterval(updateClock, 1000);
setInterval(updateLiveTempestCurrent, 30000);
setInterval(updateLiveForecast, 300000);
setInterval(updateLiveNwsAlerts, 60000);
