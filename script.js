const canvas = document.getElementById("dashboard-canvas");
const ctx = canvas.getContext("2d");

const bg = new Image();
bg.src = "images/weather-background.png";

const rainIcon = new Image();
rainIcon.src = "images/rain.svg";

function resizeCanvas(){

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

drawDashboard(sampleData);

}

window.addEventListener("resize", resizeCanvas);

// ---------------- TEMP COLOR SCALE ----------------

function getTempColor(temp){

if (temp < 30) return "#8EC9FF";
if (temp < 40) return "#7FB8FF";
if (temp < 50) return "#8FE0FF";
if (temp < 60) return "#9BE8B2";
if (temp < 70) return "#FFF3A6";
if (temp < 80) return "#FFD59E";
if (temp < 90) return "#FFB59E";
return "#FF9E9E";

}

// ---------------- LIGHTEN COLOR ----------------

function lightenColor(hex,amount){

let num = parseInt(hex.replace("#",""),16);

let r = (num >> 16) + amount;
let g = ((num >> 8) & 0x00FF) + amount;
let b = (num & 0x0000FF) + amount;

r = Math.min(255,r);
g = Math.min(255,g);
b = Math.min(255,b);

return "#" + (b | (g << 8) | (r << 16)).toString(16);

}

// ---------------- TEMPERATURE TEXT ----------------

function drawTempText(text,x,y,size,color){

ctx.textAlign = "left";
ctx.textBaseline = "top";

// glow layer
ctx.font = `bold ${size}px Segoe UI`;
ctx.globalAlpha = .35;
ctx.shadowColor = color;
ctx.shadowBlur = 20;
ctx.fillStyle = color;
ctx.fillText(text,x,y);

// gradient layer
ctx.globalAlpha = 1;

const lighter = lightenColor(color,60);

const gradient = ctx.createLinearGradient(
0,
y,
0,
y + size
);

gradient.addColorStop(0,lighter);
gradient.addColorStop(1,color);

ctx.shadowBlur = 4;
ctx.shadowColor = "rgba(0,0,0,.35)";
ctx.fillStyle = gradient;

ctx.fillText(text,x,y);

ctx.shadowBlur = 0;

}

// ---------------- NORMAL TEXT ----------------

function drawText(text,x,y,size){

ctx.font = `bold ${size}px Segoe UI`;
ctx.fillStyle = "#E8E8E8";

ctx.textAlign = "left";
ctx.textBaseline = "top";

ctx.shadowColor = "rgba(0,0,0,.35)";
ctx.shadowBlur = 4;

ctx.fillText(text,x,y);

ctx.shadowBlur = 0;

}

// ---------------- DASHBOARD ----------------

function drawDashboard(data){

ctx.clearRect(0,0,canvas.width,canvas.height);

// background
ctx.drawImage(bg,0,0,canvas.width,canvas.height);

// CURRENT TEMP ICON (moved left)

ctx.drawImage(rainIcon,90,150,60,60);

// CURRENT TEMP

drawTempText(
data.currentTemp.toFixed(1)+"°",
180,
150,
56,
getTempColor(data.currentTemp)
);

// DEW POINT

drawTempText(
data.dewPoint+"°",
55,
240,
22,
getTempColor(data.dewPoint)
);

// HUMIDITY

drawText(
data.humidity+"%",
155,
238,
22
);

// PRESSURE

drawText(
data.pressure.toFixed(2),
250,
238,
22
);

// FORECAST

data.forecast.forEach((day,i)=>{

const x = 600 + (i*230);
const y = 380;

drawTempText(
day.high+"°",
x,
y,
34,
getTempColor(day.high)
);

drawTempText(
day.low+"°",
x+70,
y,
34,
getTempColor(day.low)
);

});

// INDOOR

drawTempText(
data.indoorTemp+"°",
280,
1280,
32,
getTempColor(data.indoorTemp)
);

drawText(
data.indoorHumidity+"% Humidity",
280,
1320,
26
);

drawTempText(
data.indoorDew+"°",
280,
1350,
26,
getTempColor(data.indoorDew)
);

// LIGHTNING

drawText(
data.lightning+" Strikes",
280,
780,
28
);

// RAINFALL

drawText(
data.rainfall.toFixed(2)+" in",
600,
1050,
28
);

// FOOTER

ctx.font = "bold 48px Segoe UI";
ctx.textAlign = "center";
ctx.fillStyle = "#FFFFFF";

ctx.fillText("SH",canvas.width/2,1450);

}

// ---------------- SAMPLE DATA ----------------

const sampleData = {

currentTemp:74.3,
dewPoint:65,
humidity:57,
pressure:28.97,

forecast:[
{high:70,low:44},
{high:62,low:45},
{high:68,low:50}
],

indoorTemp:67,
indoorHumidity:57,
indoorDew:55,

lightning:0,
rainfall:0

};

// ---------------- INIT ----------------

bg.onload = ()=>{

resizeCanvas();

};
