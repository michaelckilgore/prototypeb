const data = {
  current: {
    temp: 74.2,
    condition: "Storm",
    dew: 65,
    humidity: 57,
    pressureIn: 28.97
  },
  wind: {
    speed: 12,
    gust: 18,
    directionDeg: 135
  },
  indoor: {
    temp: 67,
    humidity: 55,
    dew: 60
  },
  rainfall: {
    daily: 0.30,
    rate: 0.05
  },
  lightning: {
    last: new Date(Date.now() - 2 * 60 * 1000),
    distance: 2.5,
    direction: "↗",
    minute: 1,
    fifteen: 2,
    hour: 4,
    midnight: 9
  },
  today: {
    high: 75,
    low: 51,
    sunrise: "8:04 AM",
    sunset: "7:41 PM",
    moon: "Waning Gibbous"
  },
  forecast: [
    { high: 70, low: 44, cond: "Storm", pop: 40 },
    { high: 62, low: 45, cond: "Storm", pop: 30 },
    { high: 68, low: 50, cond: "Storm", pop: 20 }
  ],
  alerts: []
};

function tempColor(temp) {
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

function formatStrikeTime(date) {
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const suffix = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${suffix}`;
}

function formatStrikeTimePanel(date) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const suffix = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${month}/${day} ${hours}:${minutes} ${suffix}`;
}

function degToCompass(num) {
  const val = Math.floor((num / 22.5) + 0.5);
  const arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return arr[val % 16];
}

function getNextThreeDayLabels() {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();
  return [
    "Today",
    days[(today.getDay() + 1) % 7],
    days[(today.getDay() + 2) % 7]
  ];
}

function updateClock() {
  const now = new Date();
  const str = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short"
  });
  const clock = document.getElementById("clock");
  if (clock) clock.textContent = str;
}

function pressureMb(inches) {
  return Math.round(inches * 33.8639);
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function getRainIntensity(rate) {
  if (rate <= 0) return "No Rain";
  if (rate <= 0.03) return "Drizzle";
  if (rate <= 0.10) return "Light Rain";
  if (rate <= 0.30) return "Moderate Rain";
  if (rate <= 0.50) return "Heavy Rain";
  return "Downpour";
}

function getRainIntensityColor(rate) {
  if (rate <= 0) return "#aeb8c7";
  if (rate <= 0.03) return "#b9dcff";
  if (rate <= 0.10) return "#8fd0ff";
  if (rate <= 0.30) return "#74efff";
  if (rate <= 0.50) return "#5cb8ff";
  return "#7f8cff";
}

function updateRainfallPanel() {
  const dailyEl = document.getElementById("rain-daily");
  const rateEl = document.getElementById("rain-rate");
  const intensityEl = document.getElementById("rain-intensity");
  const fillEl = document.getElementById("rain-meter-fill");

  if (dailyEl) dailyEl.textContent = `${data.rainfall.daily.toFixed(2)}"`;
  if (rateEl) rateEl.textContent = `${data.rainfall.rate.toFixed(2)}"/hr`;

  applyTempColor(dailyEl, data.rainfall.daily * 100);
  applyTempColor(rateEl, data.rainfall.rate * 100);

  if (intensityEl) {
    intensityEl.textContent = getRainIntensity(data.rainfall.rate);
    intensityEl.style.color = getRainIntensityColor(data.rainfall.rate);
  }

  if (fillEl) {
    const maxRate = 0.5;
    const pct = Math.max(0, Math.min(data.rainfall.rate / maxRate, 1)) * 100;
    fillEl.style.width = `${pct}%`;
  }
}

function renderWarnings() {
  const alerts = Array.isArray(data.alerts) ? data.alerts : [];
  const activeBar = document.getElementById("active-alerts-bar");
  const activeList = document.getElementById("active-alerts-list");
  const priorityBar = document.getElementById("priority-alerts-bar");
  const priorityTrack = document.getElementById("priority-alerts-track");

  if (!activeBar || !activeList || !priorityBar || !priorityTrack) return;

  if (alerts.length === 0) {
    activeBar.style.display = "none";
    priorityBar.style.display = "none";
    return;
  }

  activeBar.style.display = "grid";
  priorityBar.style.display = "grid";
  activeList.innerHTML = "";

  const list = document.createElement("div");
  list.className = "alert-list";

  alerts.forEach((alert) => {
    const chip = document.createElement("div");
    chip.className = "alert-chip";
    chip.textContent = alert.event || "Alert";
    list.appendChild(chip);
  });

  activeList.appendChild(list);

  const priorityOrder = [
    "Tornado Emergency",
    "Tornado Warning",
    "Severe Thunderstorm Warning",
    "Flash Flood Warning",
    "Flood Warning",
    "Flash Flood Advisory",
    "Flood Advisory",
    "Wind Advisory"
  ];

  const sortedAlerts = [...alerts].sort((a, b) => {
    const ai = priorityOrder.indexOf(a.event || "");
    const bi = priorityOrder.indexOf(b.event || "");
    const aRank = ai === -1 ? 999 : ai;
    const bRank = bi === -1 ? 999 : bi;
    return aRank - bRank;
  });

  const tickerText = sortedAlerts.map((alert) => {
    if (alert.headline && alert.headline.trim()) return alert.headline.trim();
    if (alert.description && alert.description.trim()) return alert.description.trim().replace(/\s+/g, " ");
    return alert.event || "Alert";
  });

  priorityTrack.textContent = tickerText.join("   •   ");
}

function renderLightningWarning() {
  const warn = document.getElementById("lightning-warning");
  if (!warn) return;

  const strike = data.lightning.last;
  const distance = Number(data.lightning.distance);
  const ageMinutes = (Date.now() - strike.getTime()) / 60000;

  if (ageMinutes <= 5 && distance <= 3) {
    warn.style.display = "block";
    const time = formatStrikeTime(strike);
    warn.textContent = `Recent lightning strike at ${time} at a distance of ${distance} mi ${data.lightning.direction} from west side of Rushville. Use caution.`;
  } else {
    warn.style.display = "none";
    warn.textContent = "";
  }
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
  const deg = data.wind.directionDeg;
  arrow.style.transform = `rotate(${deg - 90}deg)`;
}

function renderAll() {
  setText("current-condition", data.current.condition);
  setText("current-temp", `${data.current.temp.toFixed(1)}°`);
  setText("current-dew", `${data.current.dew}°`);
  setText("current-humidity", `${data.current.humidity}%`);
  setText("current-pressure", `${data.current.pressureIn.toFixed(2)}" / ${pressureMb(data.current.pressureIn)} MB`);

  applyTempColor(document.getElementById("current-temp"), data.current.temp);
  applyTempColor(document.getElementById("current-dew"), data.current.dew);
  applyTempColor(document.getElementById("current-humidity"), data.current.humidity);
  applyTempColor(document.getElementById("current-pressure"), data.current.pressureIn);

  setText("wind-speed", `${data.wind.speed} mph`);
  setText("wind-gust", `${data.wind.gust} mph`);
  setText("wind-dir-text", degToCompass(data.wind.directionDeg));
  applyTempColor(document.getElementById("wind-speed"), data.wind.speed);
  applyTempColor(document.getElementById("wind-gust"), data.wind.gust);
  applyTempColor(document.getElementById("wind-dir-text"), 60);
  renderWindArrow();

  setText("indoor-temp", `${data.indoor.temp}°`);
  setText("indoor-humidity", `${data.indoor.humidity}%`);
  setText("indoor-dew", `${data.indoor.dew}°`);
  applyTempColor(document.getElementById("indoor-temp"), data.indoor.temp);
  applyTempColor(document.getElementById("indoor-humidity"), data.indoor.humidity);
  applyTempColor(document.getElementById("indoor-dew"), data.indoor.dew);

  updateRainfallPanel();

  setText("lt-last", formatStrikeTimePanel(data.lightning.last));
  setText("lt-distance", `${data.lightning.distance} mi`);
  setText("lt-direction", data.lightning.direction);
  setText("lt-minute", String(data.lightning.minute));
  setText("lt-fifteen", String(data.lightning.fifteen));
  setText("lt-hour", String(data.lightning.hour));
  setText("lt-midnight", String(data.lightning.midnight));

  applyTempColor(document.getElementById("lt-last"), 70);
  applyTempColor(document.getElementById("lt-distance"), 45);
  applyTempColor(document.getElementById("lt-direction"), 60);
  applyTempColor(document.getElementById("lt-minute"), 40);
  applyTempColor(document.getElementById("lt-fifteen"), 50);
  applyTempColor(document.getElementById("lt-hour"), 60);
  applyTempColor(document.getElementById("lt-midnight"), 70);

  setText("today-high", `${data.today.high}°`);
  setText("today-low", `${data.today.low}°`);
  setText("today-sunrise", data.today.sunrise);
  setText("today-sunset", data.today.sunset);
  setText("today-moon", data.today.moon);

  applyTempColor(document.getElementById("today-high"), data.today.high);
  applyTempColor(document.getElementById("today-low"), data.today.low);

  renderForecast();
  renderWarnings();
  renderLightningWarning();
  updateClock();
}

async function updateLiveTemperatureOnly() {
  try {
    const response = await fetch("http://localhost:3000/api/tempest/current-temp");

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const live = await response.json();

    if (typeof live.roundedTempF === "number") {
      data.current.temp = live.roundedTempF;
      setText("current-temp", `${data.current.temp.toFixed(1)}°`);
      applyTempColor(document.getElementById("current-temp"), data.current.temp);
    }
  } catch (error) {
    console.error("Failed to load live temperature:", error);
  }
}

async function updateLiveNwsAlerts() {
  try {
    const response = await fetch("http://localhost:3000/api/nws-alerts");

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const live = await response.json();

    if (Array.isArray(live.alerts)) {
      data.alerts = live.alerts;
      renderWarnings();
    } else {
      data.alerts = [];
      renderWarnings();
    }
  } catch (error) {
    console.error("Failed to load NWS alerts:", error);
    data.alerts = [];
    renderWarnings();
  }
}

renderAll();
updateLiveTemperatureOnly();
updateLiveNwsAlerts();

setInterval(updateClock, 1000);
setInterval(updateLiveTemperatureOnly, 30000);
setInterval(updateLiveNwsAlerts, 60000);
