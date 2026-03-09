const dashboardData = {
  location: "Rushville, Indiana",
  current: {
    updatedAt: new Date(),
    temp: 58,
    feelsLike: 60,
    condition: "Partly Cloudy",
    icon: "⛅",
    humidity: 54,
    wind: "9 mph NW",
    dewPoint: 41,
    visibility: "10 mi",
    rainToday: "0.00 in",
    uvIndex: 3,
    barometer: 30.14,
    pressureTrend: "Rising",
    pressureDirection: "up",
    tempTrendText: "▲ 2° / hr"
  },
  observed: {
    high: 62,
    low: 38,
    windGust: "18 mph",
    rainRate: "0.00 in/hr",
    pressureText: "Rising",
    sunTimes: "7:01a / 6:31p"
  },
  hourly: [
    { time: "7 PM", icon: "🌤️", temp: 56, desc: "Partly cloudy" },
    { time: "8 PM", icon: "🌥️", temp: 53, desc: "Clouds increasing" },
    { time: "9 PM", icon: "☁️", temp: 50, desc: "Mostly cloudy" },
    { time: "10 PM", icon: "☁️", temp: 48, desc: "Cloudy" },
    { time: "11 PM", icon: "🌙", temp: 46, desc: "Quiet" },
    { time: "12 AM", icon: "🌙", temp: 44, desc: "Cooler" }
  ],
  tempHistory: generate24HourTemperatureSeries()
};

function generate24HourTemperatureSeries() {
  const now = new Date();
  const points = [];
  const totalHoursBack = 24;

  for (let i = totalHoursBack; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 60 * 60 * 1000);

    const hour = t.getHours() + t.getMinutes() / 60;
    const diurnal =
      49 + Math.sin(((hour - 14) / 24) * Math.PI * 2) * 9;
    const variation =
      Math.sin((i / 3.1) * Math.PI) * 1.6 +
      Math.cos((i / 5.4) * Math.PI) * 0.9;

    points.push({
      time: new Date(t),
      temp: Math.round((diurnal + variation) * 10) / 10
    });
  }

  return points;
}

function formatStationTime(date) {
  return `Updated ${date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit"
  })}`;
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function renderCurrentConditions(data) {
  setText("stationTime", formatStationTime(data.updatedAt));
  setText("stationLocation", dashboardData.location);
  setText("currentTemp", `${Math.round(data.temp)}°`);
  setText("feelsLike", `${Math.round(data.feelsLike)}°`);
  setText("currentCondition", data.condition);
  setText("conditionIcon", data.icon);
  setText("humidity", `${data.humidity}%`);
  setText("wind", data.wind);
  setText("dewPoint", `${Math.round(data.dewPoint)}°`);
  setText("visibility", data.visibility);
  setText("rainToday", data.rainToday);
  setText("uvIndex", `${data.uvIndex}`);
  setText("barometerValue", `${data.barometer.toFixed(2)} in`);
  setText("pressureText", data.pressureTrend);
  setText("tempTrend", data.tempTrendText);

  const pressureTrendEl = document.getElementById("pressureTrend");
  if (pressureTrendEl) {
    const isUp = data.pressureDirection === "up";
    pressureTrendEl.textContent = isUp ? "▲ Rising" : "▼ Falling";
    pressureTrendEl.classList.remove("up", "down");
    pressureTrendEl.classList.add(isUp ? "up" : "down");
  }

  const tempTrendEl = document.getElementById("tempTrend");
  if (tempTrendEl) {
    const isDown = data.tempTrendText.includes("▼");
    tempTrendEl.classList.remove("up", "down");
    tempTrendEl.classList.add(isDown ? "down" : "up");
  }
}

function renderObserved(observed) {
  setText("dayHigh", `${observed.high}°`);
  setText("dayLow", `${observed.low}°`);
  setText("windGust", observed.windGust);
  setText("rainRate", observed.rainRate);
  setText("pressureText", observed.pressureText);
  setText("sunTimes", observed.sunTimes);
}

function renderHourly(hourlyData) {
  const hourlyRow = document.getElementById("hourlyRow");
  if (!hourlyRow) return;

  hourlyRow.innerHTML = hourlyData
    .map(
      (item) => `
        <div class="hour-card">
          <div class="hour-time">${item.time}</div>
          <div class="hour-icon">${item.icon}</div>
          <div class="hour-temp">${item.temp}°</div>
          <div class="hour-desc">${item.desc}</div>
        </div>
      `
    )
    .join("");
}

function resizeCanvasForDisplay(canvas) {
  const ratio = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  const displayWidth = Math.max(300, Math.round(rect.width * ratio));
  const displayHeight = Math.max(180, Math.round((rect.width * 0.35) * ratio));

  if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }
}

function drawTemperatureChart(canvas, rawPoints) {
  if (!canvas) return;

  resizeCanvasForDisplay(canvas);

  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  const padding = {
    top: 28,
    right: 22,
    bottom: 54,
    left: 54
  };

  const chartLeft = padding.left;
  const chartTop = padding.top;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const chartBottom = chartTop + chartHeight;
  const chartRight = chartLeft + chartWidth;

  ctx.clearRect(0, 0, width, height);

  const gradient = ctx.createLinearGradient(0, chartTop, 0, chartBottom);
  gradient.addColorStop(0, "rgba(120, 240, 214, 0.12)");
  gradient.addColorStop(1, "rgba(120, 240, 214, 0)");

  const now = new Date();
  const endMs = now.getTime();
  const startMs = endMs - 24 * 60 * 60 * 1000;

  const points = rawPoints
    .map((point) => ({
      timeMs: new Date(point.time).getTime(),
      temp: Number(point.temp)
    }))
    .filter((point) => !Number.isNaN(point.timeMs) && !Number.isNaN(point.temp))
    .filter((point) => point.timeMs >= startMs && point.timeMs <= endMs)
    .sort((a, b) => a.timeMs - b.timeMs);

  if (!points.length) {
    ctx.fillStyle = "#eef5ff";
    ctx.font = `${Math.round(height * 0.05)}px Arial`;
    ctx.fillText("No temperature data available", chartLeft, chartTop + 30);
    return;
  }

  let minTemp = Math.min(...points.map((p) => p.temp));
  let maxTemp = Math.max(...points.map((p) => p.temp));

  if (minTemp === maxTemp) {
    minTemp -= 1;
    maxTemp += 1;
  }

  const tempPad = Math.max(2, (maxTemp - minTemp) * 0.16);
  minTemp -= tempPad;
  maxTemp += tempPad;

  function timeToX(timeMs) {
    return chartLeft + ((timeMs - startMs) / (endMs - startMs)) * chartWidth;
  }

  function tempToY(temp) {
    return chartTop + (1 - (temp - minTemp) / (maxTemp - minTemp)) * chartHeight;
  }

  ctx.strokeStyle = "rgba(170, 200, 255, 0.12)";
  ctx.lineWidth = 1;

  const horizontalLines = 5;
  ctx.font = `${Math.max(12, Math.round(height * 0.028))}px Arial`;
  ctx.fillStyle = "rgba(214, 228, 249, 0.75)";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";

  for (let i = 0; i <= horizontalLines; i++) {
    const value = minTemp + ((horizontalLines - i) / horizontalLines) * (maxTemp - minTemp);
    const y = chartTop + (i / horizontalLines) * chartHeight;

    ctx.beginPath();
    ctx.moveTo(chartLeft, y);
    ctx.lineTo(chartRight, y);
    ctx.stroke();

    ctx.fillText(`${Math.round(value)}°`, chartLeft - 10, y);
  }

  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.strokeStyle = "rgba(170, 200, 255, 0.1)";
  ctx.fillStyle = "rgba(214, 228, 249, 0.72)";

  for (let i = 0; i <= 24; i++) {
    const x = chartLeft + (i / 24) * chartWidth;
    const tickMs = startMs + (i / 24) * (endMs - startMs);
    const tickDate = new Date(tickMs);

    ctx.beginPath();
    ctx.moveTo(x, chartTop);
    ctx.lineTo(x, chartBottom);
    ctx.stroke();

    const hour = tickDate.getHours();
    const label = `${String(hour).padStart(2, "0")}:00`;
    ctx.fillText(label, x, chartBottom + 10);
  }

  ctx.beginPath();
  ctx.moveTo(chartLeft, chartBottom);
  ctx.lineTo(chartRight, chartBottom);
  ctx.strokeStyle = "rgba(210, 230, 255, 0.16)";
  ctx.stroke();

  ctx.beginPath();
  points.forEach((point, index) => {
    const x = timeToX(point.timeMs);
    const y = tempToY(point.temp);
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.lineTo(timeToX(points[points.length - 1].timeMs), chartBottom);
  ctx.lineTo(timeToX(points[0].timeMs), chartBottom);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.beginPath();
  points.forEach((point, index) => {
    const x = timeToX(point.timeMs);
    const y = tempToY(point.temp);
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });

  ctx.strokeStyle = "#86d6ff";
  ctx.lineWidth = Math.max(2, Math.round(height * 0.008));
  ctx.shadowColor = "rgba(134, 214, 255, 0.45)";
  ctx.shadowBlur = 14;
  ctx.stroke();
  ctx.shadowBlur = 0;

  for (const point of points) {
    const x = timeToX(point.timeMs);
    const y = tempToY(point.temp);

    ctx.beginPath();
    ctx.arc(x, y, Math.max(2, Math.round(height * 0.007)), 0, Math.PI * 2);
    ctx.fillStyle = "#eef5ff";
    ctx.fill();
  }

  ctx.beginPath();
  ctx.moveTo(chartRight, chartTop);
  ctx.lineTo(chartRight, chartBottom);
  ctx.strokeStyle = "rgba(124, 244, 165, 0.3)";
  ctx.lineWidth = 2;
  ctx.stroke();

  const latestPoint = points[points.length - 1];
  const lx = timeToX(latestPoint.timeMs);
  const ly = tempToY(latestPoint.temp);

  ctx.beginPath();
  ctx.arc(lx, ly, Math.max(4, Math.round(height * 0.012)), 0, Math.PI * 2);
  ctx.fillStyle = "#78f0d6";
  ctx.shadowColor = "rgba(120, 240, 214, 0.55)";
  ctx.shadowBlur = 18;
  ctx.fill();
  ctx.shadowBlur = 0;
}

function renderDashboard() {
  renderCurrentConditions(dashboardData.current);
  renderObserved(dashboardData.observed);
  renderHourly(dashboardData.hourly);

  const canvas = document.getElementById("tempChart");
  drawTemperatureChart(canvas, dashboardData.tempHistory);
}

window.addEventListener("resize", renderDashboard);
window.addEventListener("DOMContentLoaded", renderDashboard);
