Replace these files completely.

`server.js` does not change, so I’m not including it.

---

## `index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Sugar Hill Reporting Station</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="style.css">
</head>

<body>

<header class="header">

<div class="station">
SUGAR HILL REPORTING STATION
</div>

<div class="location">
Rushville, Indiana
</div>

<div id="clock" class="clock">
--:--
</div>

</header>

<section class="alerts">

<div id="active-alerts-bar" class="alert-bar">

<div class="alert-title">
Active Warnings
</div>

<div id="active-alerts-list" class="alert-text"></div>

</div>

<div id="priority-alerts-bar" class="alert-bar">

<div class="alert-title">
Warning Text
</div>

<div class="ticker">
<div id="priority-alerts-track"></div>
</div>

</div>

</section>

<main class="dashboard">

<section class="panel">

<h2>Current Conditions</h2>

<div class="current">

<div class="current-left">

<img src="images/storm.svg" class="current-icon" alt="Current condition icon">

<div id="current-condition">
Storm
</div>

</div>

<div class="current-right">

<div id="current-temp" class="big-temp">
74.2°
</div>

</div>

</div>

<div class="current-stats">

<div class="stat">
<div class="stat-label">Dew Point</div>
<div id="current-dew" class="stat-value">65°</div>
</div>

<div class="stat">
<div class="stat-label">Humidity</div>
<div id="current-humidity" class="stat-value">57%</div>
</div>

<div class="stat">
<div class="stat-label">Pressure</div>
<div id="current-pressure" class="stat-value">28.97" / 981 MB</div>
</div>

</div>

</section>

<section class="panel">

<h2>Wind &amp; Rainfall</h2>

<div class="surface-panel">

<div class="surface-top">

<div class="surface-left">

<div class="surface-metrics">

<div class="stat">
<div class="stat-label">Wind Speed</div>
<div id="wind-speed" class="stat-value">12 mph</div>
</div>

<div class="stat">
<div class="stat-label">Daily Total</div>
<div id="rain-daily" class="stat-value">0.30"</div>
</div>

<div class="stat">
<div class="stat-label">Wind Gust</div>
<div id="wind-gust" class="stat-value">18 mph</div>
</div>

<div class="stat">
<div class="stat-label">Rain Rate</div>
<div id="rain-rate" class="stat-value">0.05"/hr</div>
</div>

<div class="stat">
<div class="stat-label">Direction</div>
<div id="wind-dir-text" class="stat-value">SE</div>
</div>

<div class="stat">
<div class="stat-label">Intensity</div>
<div id="rain-intensity" class="stat-value">Light Rain</div>
</div>

</div>

<div class="today-so-far">

<div class="today-so-far-title">TODAY SO FAR</div>

<div class="today-so-far-grid">

<div class="stat">
<div class="stat-label">High</div>
<div id="today-high" class="stat-value">75°</div>
</div>

<div class="stat">
<div class="stat-label">Low</div>
<div id="today-low" class="stat-value">51°</div>
</div>

</div>

</div>

</div>

<div class="surface-right">

<div class="wind-dial-wrap">

<div class="wind-dial">
<span class="dial-cardinal dial-n">N</span>
<span class="dial-cardinal dial-e">E</span>
<span class="dial-cardinal dial-s">S</span>
<span class="dial-cardinal dial-w">W</span>

<span class="dial-ordinal dial-ne">NE</span>
<span class="dial-ordinal dial-se">SE</span>
<span class="dial-ordinal dial-sw">SW</span>
<span class="dial-ordinal dial-nw">NW</span>

<div id="wind-arrow" class="wind-dial-arrow"></div>
<div class="wind-dial-center"></div>
</div>

</div>

<div class="surface-extra-slot"></div>

</div>

</div>

<div class="rain-meter">

<div class="meter-labels">
<span>0</span>
<span>0.25</span>
<span>0.50+</span>
</div>

<div class="meter-track">
<div id="rain-meter-fill"></div>
</div>

</div>

</div>

</section>

<section class="panel">

<h2>Three Day Forecast</h2>

<div class="forecast">

<div class="forecast-day">

<div id="f0-label">Today</div>
<div id="f0-high" class="forecast-high">70°</div>
<img src="images/storm.svg" class="forecast-icon" alt="Forecast icon">
<div id="f0-cond">Storm</div>
<div id="f0-low" class="forecast-low">44°</div>
<div id="f0-pop" class="forecast-pop">40%</div>

</div>

<div class="forecast-day">

<div id="f1-label">Mon</div>
<div id="f1-high" class="forecast-high">62°</div>
<img src="images/storm.svg" class="forecast-icon" alt="Forecast icon">
<div id="f1-cond">Storm</div>
<div id="f1-low" class="forecast-low">45°</div>
<div id="f1-pop" class="forecast-pop">30%</div>

</div>

<div class="forecast-day">

<div id="f2-label">Tue</div>
<div id="f2-high" class="forecast-high">68°</div>
<img src="images/storm.svg" class="forecast-icon" alt="Forecast icon">
<div id="f2-cond">Storm</div>
<div id="f2-low" class="forecast-low">50°</div>
<div id="f2-pop" class="forecast-pop">20%</div>

</div>

</div>

</section>

<section class="panel">

<h2>Lightning</h2>

<div id="lightning-warning" class="lightning-warning"></div>

<div class="lightning-top">

<div class="stat">
<div class="stat-label">Last Strike</div>
<div id="lt-last" class="stat-value">--</div>
</div>

<div class="stat">
<div class="stat-label">Distance</div>
<div id="lt-distance" class="stat-value">--</div>
</div>

<div class="stat">
<div class="stat-label">Direction</div>
<div id="lt-direction" class="stat-value">--</div>
</div>

</div>

<div class="lightning-history">

<div class="history-box">
<div class="history-label">1 Min</div>
<div id="lt-minute" class="history-value">0</div>
</div>

<div class="history-box">
<div class="history-label">15 Min</div>
<div id="lt-fifteen" class="history-value">0</div>
</div>

<div class="history-box">
<div class="history-label">1 Hour</div>
<div id="lt-hour" class="history-value">0</div>
</div>

<div class="history-box">
<div class="history-label">Today</div>
<div id="lt-midnight" class="history-value">0</div>
</div>

</div>

</section>

<section class="panel radar-panel">

<h2>Radar</h2>

<div class="radar">
Radar Image Here
</div>

</section>

</main>

<script src="script.js"></script>

</body>
</html>
```

---

## `style.css`

```css
*{
  box-sizing:border-box;
  margin:0;
  padding:0;
}

:root{
  --bg:#0a1220;
  --bg2:#101b2f;
  --panel:#16243b;
  --panel2:#1b2d49;
  --line:#5fe3ff;
  --line-soft:rgba(95,227,255,.35);
  --text:#f4fbff;
  --muted:#9fc3df;
  --title:#dff7ff;
  --accent:#7be7ff;
  --danger:#ff6c8f;
  --danger-dark:#6e1f34;
  --gold:#ffd24d;
  --shadow:0 12px 30px rgba(0,0,0,.35);
  --glow:0 0 18px rgba(95,227,255,.16);
  --radius:16px;
}

html,body{
  min-height:100%;
}

body{
  background:
    radial-gradient(circle at top left, rgba(77,147,255,.16), transparent 30%),
    radial-gradient(circle at top right, rgba(0,220,255,.12), transparent 26%),
    linear-gradient(180deg, #0a1220 0%, #0b1424 45%, #08111d 100%);
  color:var(--text);
  font-family:Arial, Helvetica, sans-serif;
  padding:14px;
}

/* HEADER */

.header{
  display:grid;
  grid-template-columns:1.4fr 1fr .8fr;
  align-items:center;
  gap:14px;
  padding:16px 22px;
  margin-bottom:12px;
  border:1px solid var(--line-soft);
  border-radius:18px;
  background:
    linear-gradient(180deg, rgba(30,46,75,.95), rgba(18,29,49,.96));
  box-shadow:var(--shadow), var(--glow);
}

.station{
  text-align:left;
  font-size:28px;
  font-weight:800;
  letter-spacing:1.6px;
  color:var(--title);
  text-transform:uppercase;
}

.location{
  text-align:center;
  font-size:16px;
  font-weight:700;
  color:var(--accent);
  letter-spacing:.6px;
}

.clock{
  text-align:right;
  font-size:24px;
  font-weight:800;
  color:#ffffff;
  letter-spacing:.8px;
}

/* ALERTS */

.alerts{
  display:grid;
  gap:10px;
  margin-bottom:14px;
}

.alert-bar{
  display:grid;
  grid-template-columns:190px 1fr;
  border:1px solid rgba(255,108,143,.45);
  border-radius:14px;
  overflow:hidden;
  background:linear-gradient(180deg, rgba(72,22,38,.95), rgba(50,15,27,.96));
  box-shadow:0 8px 24px rgba(0,0,0,.3);
}

.alert-title{
  background:linear-gradient(180deg, #a73e61, #7d2b48);
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight:800;
  font-size:14px;
  text-transform:uppercase;
  letter-spacing:.8px;
  color:white;
  border-right:1px solid rgba(255,255,255,.08);
}

.alert-text{
  padding:8px 14px;
  display:flex;
  align-items:center;
  min-height:42px;
  font-size:15px;
  font-weight:700;
  color:white;
}

.alert-list{
  display:flex;
  flex-wrap:wrap;
  gap:8px;
  align-items:center;
}

.alert-chip{
  white-space:nowrap;
  padding:5px 10px;
  border-radius:999px;
  background:rgba(255,255,255,.08);
  border:1px solid rgba(255,255,255,.08);
  font-size:13px;
  font-weight:800;
}

.ticker{
  overflow:hidden;
  white-space:nowrap;
  display:flex;
  align-items:center;
  padding:8px 0;
}

#priority-alerts-track{
  display:inline-block;
  padding-left:100%;
  animation:ticker 25s linear infinite;
  font-size:15px;
  font-weight:700;
  color:#fff;
}

@keyframes ticker{
  0%{transform:translateX(0)}
  100%{transform:translateX(-100%)}
}

/* DASHBOARD GRID */

.dashboard{
  display:grid;
  grid-template-columns:1.25fr 1.05fr 1.1fr;
  gap:14px;
  align-items:stretch;
}

.panel{
  background:
    linear-gradient(180deg, rgba(27,45,73,.96) 0%, rgba(18,31,52,.96) 100%);
  border:1px solid var(--line-soft);
  border-radius:var(--radius);
  padding:16px;
  min-height:170px;
  box-shadow:var(--shadow), var(--glow);
  position:relative;
  overflow:hidden;
}

.panel::before{
  content:"";
  position:absolute;
  inset:0 0 auto 0;
  height:3px;
  background:linear-gradient(90deg, transparent, rgba(123,231,255,.85), transparent);
  opacity:.85;
}

.panel h2{
  margin-bottom:14px;
  font-size:17px;
  font-weight:800;
  letter-spacing:.9px;
  text-transform:uppercase;
  color:var(--title);
}

/* HERO PANELS */

.dashboard .panel:nth-child(1){
  min-height:255px;
}

.dashboard .panel:nth-child(4){
  min-height:255px;
}

.radar-panel{
  grid-column:span 2;
  min-height:255px;
}

/* CURRENT */

.current{
  display:grid;
  grid-template-columns:130px 1fr;
  gap:14px;
  align-items:center;
}

.current-left{
  text-align:center;
}

.current-icon{
  width:86px;
  height:86px;
  display:block;
  margin:0 auto 10px auto;
  filter:drop-shadow(0 0 12px rgba(111,232,255,.22));
}

#current-condition{
  font-size:20px;
  font-weight:800;
  color:#ecfaff;
  letter-spacing:.4px;
}

.current-right{
  display:flex;
  align-items:center;
  justify-content:flex-start;
}

.big-temp{
  font-size:82px;
  font-weight:900;
  line-height:.95;
  letter-spacing:-2px;
  text-shadow:0 0 18px rgba(255,255,255,.08);
}

.current-stats{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  margin-top:16px;
  text-align:center;
  gap:10px;
}

.stat{
  min-width:0;
}

.stat-label{
  font-size:12px;
  color:var(--muted);
  margin-bottom:5px;
  text-transform:uppercase;
  letter-spacing:.8px;
  font-weight:700;
}

.stat-value{
  font-size:23px;
  font-weight:800;
  line-height:1.15;
}

#current-pressure{
  white-space:nowrap;
  font-size:20px;
}

/* FORECAST */

.forecast{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:10px;
  text-align:center;
  align-items:start;
}

.forecast-day{
  display:grid;
  justify-items:center;
  gap:5px;
  padding:10px 8px;
  border-radius:12px;
  background:linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.015));
  border:1px solid rgba(255,255,255,.06);
}

.forecast-day > div:first-child{
  font-size:14px;
  font-weight:800;
  color:var(--title);
  text-transform:uppercase;
  letter-spacing:.6px;
}

.forecast-icon{
  width:46px;
  height:46px;
  filter:drop-shadow(0 0 8px rgba(123,231,255,.14));
}

.forecast-high{
  font-size:24px;
  font-weight:900;
}

.forecast-low{
  font-size:18px;
  color:#d9e7ff;
}

.forecast-pop{
  font-size:15px;
  font-weight:800;
  color:#9de0ff;
}

/* WIND + RAIN */

.surface-panel{
  display:grid;
  gap:12px;
}

.surface-top{
  display:grid;
  grid-template-columns:minmax(0,1.12fr) 300px;
  gap:18px;
  align-items:start;
}

.surface-left{
  display:grid;
  gap:10px;
}

.surface-metrics{
  display:grid;
  grid-template-columns:repeat(2, minmax(140px,1fr));
  gap:12px 22px;
  align-items:start;
}

.surface-metrics .stat-label{
  white-space:nowrap;
}

.surface-metrics .stat-value{
  font-size:26px;
  white-space:nowrap;
}

.today-so-far{
  border-top:1px solid rgba(95,227,255,.16);
  padding-top:8px;
}

.today-so-far-title{
  font-size:12px;
  font-weight:800;
  letter-spacing:.9px;
  color:#ffffff;
  margin-bottom:6px;
}

.today-so-far-grid{
  display:grid;
  grid-template-columns:repeat(2, minmax(120px,1fr));
  gap:12px 22px;
}

.today-so-far .stat-value{
  font-size:26px;
  white-space:nowrap;
}

.surface-right{
  display:grid;
  grid-template-columns:150px 1fr;
  gap:18px;
  align-items:center;
  min-width:0;
}

.surface-extra-slot{
  min-height:132px;
  border-radius:14px;
  background:linear-gradient(180deg, rgba(255,255,255,.02), rgba(255,255,255,.008));
  border:1px solid rgba(255,255,255,.04);
}

.wind-dial-wrap{
  display:flex;
  align-items:center;
  justify-content:center;
}

.wind-dial{
  position:relative;
  width:148px;
  height:148px;
  border-radius:50%;
  border:1px solid rgba(95,227,255,.34);
  background:
    radial-gradient(circle at center, rgba(123,231,255,.10) 0 12%, transparent 12% 100%),
    radial-gradient(circle at center, transparent 0 44%, rgba(95,227,255,.22) 44% 45%, transparent 45% 100%),
    radial-gradient(circle at center, transparent 0 72%, rgba(95,227,255,.16) 72% 73%, transparent 73% 100%),
    linear-gradient(180deg, rgba(11,21,36,.96), rgba(19,31,51,.96));
  box-shadow:
    inset 0 0 24px rgba(95,227,255,.08),
    0 0 18px rgba(95,227,255,.12);
  overflow:hidden;
}

.wind-dial::before{
  content:"";
  position:absolute;
  inset:6px;
  border-radius:50%;
  background:
    repeating-conic-gradient(
      from 0deg,
      rgba(255,255,255,.00) 0deg 8deg,
      rgba(123,231,255,.18) 8deg 9deg
    );
  mask:radial-gradient(circle, transparent 0 56px, #000 56px);
  opacity:.9;
}

.wind-dial::after{
  content:"";
  position:absolute;
  inset:22px;
  border-radius:50%;
  border:1px solid rgba(95,227,255,.18);
  pointer-events:none;
}

.wind-dial-center{
  position:absolute;
  width:12px;
  height:12px;
  border-radius:50%;
  background:#ffffff;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%);
  box-shadow:0 0 12px rgba(123,231,255,.45);
  z-index:3;
}

.wind-dial-arrow{
  position:absolute;
  width:52px;
  height:6px;
  top:50%;
  left:50%;
  transform-origin:left center;
  border-radius:999px;
  background:linear-gradient(90deg, #ffffff, #9beeff 70%, #7be7ff 100%);
  box-shadow:0 0 12px rgba(123,231,255,.35);
  z-index:2;
}

.wind-dial-arrow::after{
  content:"";
  position:absolute;
  right:-1px;
  top:50%;
  transform:translateY(-50%);
  border-left:16px solid #7be7ff;
  border-top:9px solid transparent;
  border-bottom:9px solid transparent;
  filter:drop-shadow(0 0 6px rgba(123,231,255,.35));
}

.dial-cardinal,
.dial-ordinal{
  position:absolute;
  font-weight:800;
  line-height:1;
  user-select:none;
}

.dial-cardinal{
  font-size:13px;
  color:#effbff;
  text-shadow:0 0 10px rgba(123,231,255,.15);
}

.dial-ordinal{
  font-size:10px;
  color:#9fcbef;
}

.dial-n{
  top:10px;
  left:50%;
  transform:translateX(-50%);
}

.dial-s{
  bottom:10px;
  left:50%;
  transform:translateX(-50%);
}

.dial-e{
  right:12px;
  top:50%;
  transform:translateY(-50%);
}

.dial-w{
  left:12px;
  top:50%;
  transform:translateY(-50%);
}

.dial-ne{
  top:26px;
  right:25px;
}

.dial-se{
  bottom:26px;
  right:25px;
}

.dial-sw{
  bottom:26px;
  left:25px;
}

.dial-nw{
  top:26px;
  left:25px;
}

/* RAIN */

.rain-meter{
  margin-top:2px;
}

.meter-labels{
  display:flex;
  justify-content:space-between;
  font-size:11px;
  color:#c7d5e7;
  margin-bottom:5px;
  font-weight:700;
}

.meter-track{
  height:14px;
  background:#0a1220;
  border:1px solid rgba(95,227,255,.5);
  border-radius:999px;
  overflow:hidden;
  box-shadow:inset 0 0 10px rgba(0,0,0,.35);
}

#rain-meter-fill{
  height:100%;
  background:linear-gradient(90deg,#b9ecff,#78d7ff,#5cb8ff);
  width:0%;
  border-radius:999px;
  box-shadow:0 0 10px rgba(92,184,255,.35);
}

/* RADAR */

.radar{
  min-height:180px;
  display:flex;
  align-items:center;
  justify-content:center;
  border:1px dashed rgba(255,255,255,.28);
  border-radius:12px;
  color:#d7e5f5;
  background:
    radial-gradient(circle at center, rgba(255,255,255,.04), rgba(255,255,255,.01)),
    linear-gradient(180deg, rgba(9,15,26,.45), rgba(11,18,30,.75));
  font-weight:700;
  letter-spacing:.4px;
}

/* LIGHTNING */

.lightning-warning{
  display:none;
  background:linear-gradient(180deg, rgba(113,85,0,.95), rgba(86,63,0,.95));
  border:1px solid rgba(255,210,77,.75);
  border-radius:10px;
  padding:8px 11px;
  margin-bottom:12px;
  font-size:13px;
  font-weight:800;
  color:white;
  box-shadow:0 0 15px rgba(255,210,77,.15);
}

.lightning-top{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:10px;
}

.lightning-history{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:10px;
  margin-top:12px;
}

.history-box{
  background:linear-gradient(180deg, rgba(13,21,36,.92), rgba(19,29,47,.95));
  border:1px solid rgba(95,227,255,.25);
  border-radius:12px;
  text-align:center;
  padding:10px 8px;
}

.history-label{
  font-size:11px;
  text-transform:uppercase;
  letter-spacing:.8px;
  color:var(--muted);
  font-weight:700;
}

.history-value{
  font-size:26px;
  font-weight:900;
  margin-top:4px;
}

/* RESPONSIVE */

@media (max-width: 1200px){
  .dashboard{
    grid-template-columns:1fr 1fr;
  }

  .radar-panel{
    grid-column:span 2;
  }

  .surface-top{
    grid-template-columns:1fr;
  }
}

@media (max-width: 900px){
  body{
    padding:10px;
  }

  .dashboard{
    grid-template-columns:1fr;
  }

  .radar-panel{
    grid-column:auto;
  }

  .current,
  .current-stats,
  .forecast,
  .lightning-top,
  .surface-top,
  .surface-metrics,
  .surface-right,
  .today-so-far-grid{
    grid-template-columns:1fr;
  }

  .lightning-history{
    grid-template-columns:1fr 1fr;
  }

  .header{
    grid-template-columns:1fr;
    gap:8px;
    text-align:center;
  }

  .station,
  .location,
  .clock{
    text-align:center;
  }

  .station{
    font-size:22px;
  }

  .big-temp{
    font-size:64px;
  }

  .alert-bar{
    grid-template-columns:1fr;
  }

  .surface-right{
    justify-items:center;
  }

  .surface-extra-slot{
    width:100%;
    min-height:80px;
  }
}
```

---

## `script.js`

```javascript
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
  indoor: {
    temp: 67,
    humidity: 55,
    dew: 60
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

function getNextThreeDayLabels() {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();
  return [
    "Today",
    days[(today.getDay() + 1) % 7],
    days[(today.getDay() + 2) % 7]
  ];
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
    bg1: "#b88952",
    bg2: "#9b6f3f",
    title1: "#c5955d",
    title2: "#aa7c48",
    border: "#e1be97",
    text: "#111111",
    chipBg: "rgba(255,255,255,0.20)",
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
});

renderAll();
updateClock();
updateLiveTempestCurrent();
updateLiveNwsAlerts();
updateLiveLightning();

setInterval(updateClock, 1000);
setInterval(updateLiveTempestCurrent, 30000);
setInterval(updateLiveNwsAlerts, 60000);
```
