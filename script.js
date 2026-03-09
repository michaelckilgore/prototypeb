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
  ]
};

function tempGradientStops(temp) {
  const intervals = [
    { max: 30, top: "#A0E0FF", bottom: "#70C0FF" },
    { max: 40, top: "#90D4FF", bottom: "#60B0FF" },
    { max: 50, top: "#80C8FF", bottom: "#50A0FF" },
    { max: 60, top: "#A0FFD0", bottom: "#70D0A0" },
    { max: 70, top: "#FFE0E0", bottom: "#FFC8C8" },
    { max: 80, top: "#FFD080", bottom: "#FFB060" },
    { max: 90, top: "#FFC050", bottom: "#FF9040" },
    { max: 100, top: "#FFA040", bottom: "#FF7040" },
    { max: 110, top: "#FF8040", bottom: "#FF5030" },
    { max: 120, top: "#FF6040", bottom: "#FF3020" }
  ];
  for (const item of intervals) {
    if (temp <= item.max) return item;
  }
  return intervals[intervals.length - 1];
}

function applyTempGradient(el, temp) {
  const colors = tempGradientStops(temp);
  el.style.backgroundImage = `linear-gradient(180deg, ${colors.top} 0%, ${colors.bottom} 100%)`;
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
  const arr = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
  return arr[val % 16];
}

function getNextThreeDayLabels() {
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
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
  document.getElementById("clock").textContent = str;
}

function pressureMb(inches) {
  return Math.round(inches * 33.8639);
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function renderForecast() {
  const labels = getNextThreeDayLabels();

  for (let i = 0; i < 3; i++) {
    const item = data.forecast[i];
    setText(`f${i}-label`, labels[i]);
    setText(`f${i}-high`, `${item.high}°`);
    setText(`f${i}-low`, `${item.low}°`);
    setText(`f${i}-cond`, item.cond);

    applyTempGradient(document.getElementById(`f${i}-high`), item.high);
    applyTempGradient(document.getElementById(`f${i}-low`), item.low);
  }
}

function renderWindArrow() {
  const arrow = document.getElementById("wind-arrow");
  const deg = data.wind.directionDeg;
  arrow.style.transform = `rotate(${deg - 90}deg)`;
}

function renderTodayGraph() {
  const canvas = document.getElementById("today-graph");
  const ctx = canvas.getContext("2d");

  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);

  const padding = { top: 16, right: 12, bottom: 18, left: 8 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const temps = data.today.tempsSinceMidnight;
  const minT = data.today.low;
  const maxT = data.today.high;

  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 1;

  for (let i = 0; i <= 4; i++) {
    const y = padding.top + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
  }

  for (let i = 0; i < temps.length - 1; i++) {
    const t1 = temps[i];
    const t2 = temps[i + 1];

    const x1 = padding.left + (chartW / (temps.length - 1)) * i;
    const x2 = padding.left + (chartW / (temps.length - 1)) * (i + 1);

    const y1 = padding.top + chartH - ((t1 - minT) / (maxT - minT || 1)) * chartH;
    const y2 = padding.top + chartH - ((t2 - minT) / (maxT - minT || 1)) * chartH;

    const stops1 = tempGradientStops(t1);
    const stops2 = tempGradientStops(t2);

    const grad = ctx.createLinearGradient(x1, y1, x2, y2);
    grad.addColorStop(0, stops1.top);
    grad.addColorStop(1, stops2.bottom);

    ctx.strokeStyle = grad;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.moveTo(padding.left, height - padding.bottom);

  temps.forEach((t, i) => {
    const x = padding.left + (chartW / (temps.length - 1)) * i;
    const y = padding.top + chartH - ((t - minT) / (maxT - minT || 1)) * chartH;
    ctx.lineTo(x, y);
  });

  ctx.lineTo(width - padding.right, height - padding.bottom);
  ctx.closePath();

  const fill = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
  fill.addColorStop(0, "rgba(255,208,128,0.28)");
  fill.addColorStop(0.5, "rgba(255,176,96,0.14)");
  fill.addColorStop(1, "rgba(255,255,255,0.04)");
  ctx.fillStyle = fill;
  ctx.fill();
}

function renderAll() {
  setText("current-condition", data.current.condition);
  setText("current-temp", `${data.current.temp.toFixed(1)}°`);
  setText("current-dew", `${data.current.dew}°`);
  setText("current-humidity", `${data.current.humidity}%`);
  setText("current-pressure", `${data.current.pressureIn.toFixed(2)}" / ${pressureMb(data.current.pressureIn)} MB`);

  applyTempGradient(document.getElementById("current-temp"), data.current.temp);
  applyTempGradient(document.getElementById("current-dew"), data.current.dew);
  applyTempGradient(document.getElementById("current-humidity"), data.current.humidity);
  applyTempGradient(document.getElementById("current-pressure"), data.current.pressureIn);

  setText("wind-speed", `${data.wind.speed} mph`);
  setText("wind-gust", `${data.wind.gust} mph`);
  setText("wind-dir-text", degToCompass(data.wind.directionDeg));
  applyTempGradient(document.getElementById("wind-speed"), data.wind.speed);
  applyTempGradient(document.getElementById("wind-gust"), data.wind.gust);
  applyTempGradient(document.getElementById("wind-dir-text"), data.wind.speed);
  renderWindArrow();

  setText("indoor-temp", `${data.indoor.temp}°`);
  setText("indoor-humidity", `${data.indoor.humidity}%`);
  setText("indoor-dew", `${data.indoor.dew}°`);
  applyTempGradient(document.getElementById("indoor-temp"), data.indoor.temp);
  applyTempGradient(document.getElementById("indoor-humidity"), data.indoor.humidity);
  applyTempGradient(document.getElementById("indoor-dew"), data.indoor.dew);

  setText("rain-daily", `${data.rainfall.daily.toFixed(2)}"`);
  setText("rain-rate", `${data.rainfall.rate.toFixed(2)}"/hr`);
  applyTempGradient(document.getElementById("rain-daily"), data.rainfall.daily * 100);
  applyTempGradient(document.getElementById("rain-rate"), data.rainfall.rate * 100);

  setText("lt-last", formatStrikeTime(data.lightning.last));
  setText("lt-distance", `${data.lightning.distance} mi`);
  setText("lt-direction", data.lightning.direction);
  setText("lt-minute", String(data.lightning.minute));
  setText("lt-fifteen", String(data.lightning.fifteen));
  setText("lt-hour", String(data.lightning.hour));
  setText("lt-midnight", String(data.lightning.midnight));
  applyTempGradient(document.getElementById("lt-last"), 70);
  applyTempGradient(document.getElementById("lt-distance"), 45);
  applyTempGradient(document.getElementById("lt-direction"), 60);
  applyTempGradient(document.getElementById("lt-minute"), 40);
  applyTempGradient(document.getElementById("lt-fifteen"), 50);
  applyTempGradient(document.getElementById("lt-hour"), 60);
  applyTempGradient(document.getElementById("lt-midnight"), 70);

  setText("today-high", `${data.today.high}°`);
  setText("today-low", `${data.today.low}°`);
  setText("today-sunrise", data.today.sunrise);
  setText("today-sunset", data.today.sunset);
  setText("today-moon", data.today.moon);
  setText("graph-max", `${data.today.high}°`);
  setText("graph-min", `${data.today.low}°`);
  applyTempGradient(document.getElementById("today-high"), data.today.high);
  applyTempGradient(document.getElementById("today-low"), data.today.low);
  renderTodayGraph();

  renderForecast();
  updateClock();
}

renderAll();
setInterval(updateClock, 1000);
