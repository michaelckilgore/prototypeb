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
    last: new Date(2026, 2, 8, 14, 15),
    distance: 2.5,
    direction: "↗",
    minute: 0,
    fifteen: 1,
    hour: 3,
    midnight: 8
  },
  today: {
    high: 75,
    low: 51,
    sunrise: "8:04 AM",
    sunset: "7:41 PM",
    moon: "Waning Gibbous",
    tempsSinceMidnight: [51, 52, 53, 55, 57, 60, 63, 68, 72, 74, 75, 74]
  },
  forecast: [
    { high: 70, low: 44, cond: "Storm" },
    { high: 62, low: 45, cond: "Storm" },
    { high: 68, low: 50, cond: "Storm" }
  ],
  alerts: [
    {
      type: "Severe Thunderstorm Warning",
      text: "Severe Thunderstorm Warning for Rush County until 1:30 PM EDT. At 12:45 PM EDT, National Weather Service Doppler Radar indicated a severe thunderstorm near Homer moving east at 30 mph. The storm will be near Rushville around 1:05 PM."
    }
  ]
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
  el.style.backgroundImage = "none";
  el.style.webkitBackgroundClip = "border-box";
  el.style.backgroundClip = "border-box";
  el.style.webkitTextFillColor = "";
  el.style.color = tempColor(temp);
}

function formatStrikeTime(date) {
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
  const alerts = data.alerts || [];
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
  activeList.innerHTML = "";

  const list = document.createElement("div");
  list.className = "alert-list";

  alerts.forEach(alert => {
    const chip = document.createElement("div");
    chip.className = "alert-chip";
    chip.textContent = alert.type;
    list.appendChild(chip);
  });

  activeList.appendChild(list);

  const priorityTypes = new Set([
    "Tornado Warning",
    "Tornado Emergency",
    "Severe Thunderstorm Warning"
  ]);

  const priorityAlerts = alerts.filter(a => priorityTypes.has(a.type));

  if (priorityAlerts.length === 0) {
    priorityBar.style.display = "none";
    return;
  }

  priorityBar.style.display = "grid";
  priorityTrack.textContent = priorityAlerts.map(a => a.text).join("   •   ");
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

function formatAxisHour(date) {
  let h = date.getHours();
  const suffix = h >= 12 ? "p" : "a";
  h = h % 12 || 12;
  return `${h}${suffix}`;
}

function updateGraphXAxisLabels(labels) {
  const xScale = document.querySelector(".x-scale");
  if (!xScale) return;

  const spans = xScale.querySelectorAll("span");
  spans.forEach((span, index) => {
    span.textContent = labels[index] || "";
  });
}

function buildRolling24HourLabels(startMs) {
  const labels = [];
  for (let i = 0; i < 6; i++) {
    const ms = startMs + (i * 4 * 60 * 60 * 1000);
    labels.push(formatAxisHour(new Date(ms)));
  }
  return labels;
}

function buildRolling24HourSeries() {
  const temps = Array.isArray(data.today.tempsSinceMidnight)
    ? data.today.tempsSinceMidnight
    : [];

  const now = new Date();
  const endMs = now.getTime();
  const startMs = endMs - (24 * 60 * 60 * 1000);

  if (!temps.length) {
    return {
      startMs,
      endMs,
      points: [],
      axisLabels: buildRolling24HourLabels(startMs)
    };
  }

  if (temps.length === 1) {
    return {
      startMs,
      endMs,
      points: [{ timeMs: endMs, temp: temps[0] }],
      axisLabels: buildRolling24HourLabels(startMs)
    };
  }

  const stepMs = (endMs - startMs) / (temps.length - 1);

  const points = temps.map((temp, i) => ({
    timeMs: startMs + (stepMs * i),
    temp
  }));

  return {
    startMs,
    endMs,
    points,
    axisLabels: buildRolling24HourLabels(startMs)
  };
}

function sizeCanvasForDisplay(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(10, Math.round(rect.width * dpr));
  const height = Math.max(10, Math.round(rect.height * dpr));

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
}

function renderTodayGraph() {
  const canvas = document.getElementById("today-graph");
  if (!canvas) return;

  sizeCanvasForDisplay(canvas);

  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);

  const padding = { top: 12, right: 10, bottom: 16, left: 8 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  const chartBottom = height - padding.bottom;

  const series = buildRolling24HourSeries();
  const { startMs, endMs, points, axisLabels } = series;

  updateGraphXAxisLabels(axisLabels);

  if (!points.length) return;

  const minT = data.today.low;
  const maxT = data.today.high;
  const range = Math.max(1, maxT - minT);

  function timeToX(timeMs) {
    return padding.left + ((timeMs - startMs) / (endMs - startMs)) * chartW;
  }

  function tempToY(temp) {
    return padding.top + chartH - ((temp - minT) / range) * chartH;
  }

  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 1;

  for (let i = 0; i <= 4; i++) {
    const y = padding.top + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
  }

  for (let i = 0; i < 6; i++) {
    const x = padding.left + (chartW / 5) * i;
    ctx.beginPath();
    ctx.moveTo(x, padding.top);
    ctx.lineTo(x, chartBottom);
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];

    const x1 = timeToX(p1.timeMs);
    const x2 = timeToX(p2.timeMs);
    const y1 = tempToY(p1.temp);
    const y2 = tempToY(p2.temp);

    const grad = ctx.createLinearGradient(x1, y1, x2, y2);
    grad.addColorStop(0, tempColor(p1.temp));
    grad.addColorStop(1, tempColor(p2.temp));

    ctx.strokeStyle = grad;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.moveTo(timeToX(points[0].timeMs), chartBottom);

  points.forEach((point) => {
    ctx.lineTo(timeToX(point.timeMs), tempToY(point.temp));
  });

  ctx.lineTo(timeToX(points[points.length - 1].timeMs), chartBottom);
  ctx.closePath();

  const fill = ctx.createLinearGradient(0, padding.top, 0, chartBottom);
  fill.addColorStop(0, "rgba(255,208,128,0.28)");
  fill.addColorStop(0.5, "rgba(255,176,96,0.14)");
  fill.addColorStop(1, "rgba(255,255,255,0.04)");
  ctx.fillStyle = fill;
  ctx.fill();

  const lastPoint = points[points.length - 1];
  const lastX = timeToX(lastPoint.timeMs);
  const lastY = tempToY(lastPoint.temp);

  ctx.beginPath();
  ctx.arc(lastX, lastY, Math.max(3, width * 0.008), 0, Math.PI * 2);
  ctx.fillStyle = tempColor(lastPoint.temp);
  ctx.fill();
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

  setText("lt-last", formatStrikeTime(data.lightning.last));
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
  setText("graph-max", `${data.today.high}°`);
  setText("graph-min", `${data.today.low}°`);

  applyTempColor(document.getElementById("today-high"), data.today.high);
  applyTempColor(document.getElementById("today-low"), data.today.low);

  renderTodayGraph();
  renderForecast();
  renderWarnings();
  updateClock();
}

renderAll();
setInterval(updateClock, 1000);
window.addEventListener("resize", renderTodayGraph);
