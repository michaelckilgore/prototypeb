const canvas = document.getElementById("dashboard-canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1920;
canvas.height = 1080;

const bg = new Image();
bg.src = "images/weather-background.png";

const rainIcon = new Image();
rainIcon.src = "images/rain.svg";

let shimmerOffset = 0;

// ---------------- TEMP COLOR ----------------

function getTempColor(t){

if(t<30) return "#8EC9FF";
if(t<40) return "#7FB8FF";
if(t<50) return "#8FE0FF";
if(t<60) return "#9BE8B2";
if(t<70) return "#FFF3A6";
if(t<80) return "#FFD59E";
if(t<90) return "#FFB59E";
return "#FF9E9E";

}

// ---------------- LIGHTEN COLOR ----------------

function lighten(hex,amt){

let num=parseInt(hex.replace("#",""),16);

let r=(num>>16)+amt;
let g=((num>>8)&0x00FF)+amt;
let b=(num&0x0000FF)+amt;

r=Math.min(255,r);
g=Math.min(255,g);
b=Math.min(255,b);

return "#"+(b|(g<<8)|(r<<16)).toString(16);

}

// ---------------- GLASS PANEL ----------------

function glass(x,y,w,h){

ctx.fillStyle="rgba(20,25,35,.35)";
ctx.fillRect(x,y,w,h);

ctx.strokeStyle="rgba(255,255,255,.08)";
ctx.strokeRect(x,y,w,h);

}

// ---------------- TEMP TEXT ----------------

function drawTemp(text,x,y,size,color){

ctx.font=`bold ${size}px Segoe UI`;
ctx.textBaseline="top";

// glow
ctx.shadowColor=color;
ctx.shadowBlur=18;
ctx.globalAlpha=.35;
ctx.fillStyle=color;
ctx.fillText(text,x,y);

// gradient text
ctx.globalAlpha=1;
ctx.shadowBlur=4;
ctx.shadowColor="rgba(0,0,0,.35)";

const light=lighten(color,60);

const g=ctx.createLinearGradient(0,y,0,y+size);

g.addColorStop(0,light);
g.addColorStop(.6,color);
g.addColorStop(1,color);

ctx.fillStyle=g;

ctx.fillText(text,x,y);

ctx.shadowBlur=0;

}

// ---------------- NORMAL TEXT ----------------

function text(t,x,y,s){

ctx.font=`bold ${s}px Segoe UI`;
ctx.fillStyle="#E6EAF0";

ctx.shadowColor="rgba(0,0,0,.4)";
ctx.shadowBlur=4;

ctx.fillText(t,x,y);

ctx.shadowBlur=0;

}

// ---------------- FORECAST BLOCK ----------------

function forecast(day,x){

drawTemp(day.high+"°",x,420,38,getTempColor(day.high));

ctx.fillStyle="rgba(255,255,255,.4)";
ctx.fillRect(x+52,430,2,30);

drawTemp(day.low+"°",x+65,420,34,getTempColor(day.low));

}

// ---------------- DRAW ----------------

function draw(data){

ctx.clearRect(0,0,canvas.width,canvas.height);

ctx.drawImage(bg,0,0,canvas.width,canvas.height);

// panels

glass(40,120,380,170);      // current
glass(520,340,760,140);     // forecast
glass(240,720,300,150);     // lightning
glass(540,960,360,120);     // rain
glass(240,1180,320,200);    // indoor

// icon

ctx.drawImage(rainIcon,95,155,60,60);

// current temp

drawTemp(data.currentTemp.toFixed(1)+"°",180,150,64,getTempColor(data.currentTemp));

// shimmer highlight

ctx.globalAlpha=.15;
ctx.fillStyle="white";
ctx.fillRect(180+shimmerOffset,150,12,70);
ctx.globalAlpha=1;

// conditions

drawTemp(data.dew+"°",60,245,24,getTempColor(data.dew));
text(data.humidity+"%",160,245,24);
text(data.pressure.toFixed(2),250,245,24);

// forecast

data.forecast.forEach((d,i)=>{

forecast(d,560+(i*240));

});

// lightning

text(data.lightning+" Strikes",260,760,28);

// rain

text(data.rain.toFixed(2)+" in",580,1000,28);

// indoor

drawTemp(data.indoorTemp+"°",270,1230,34,getTempColor(data.indoorTemp));
text(data.indoorHumidity+"% Humidity",270,1270,26);
drawTemp(data.indoorDew+"°",270,1305,26,getTempColor(data.indoorDew));

}

// ---------------- SAMPLE DATA ----------------

const data={

currentTemp:74.3,
dew:65,
humidity:57,
pressure:28.97,

forecast:[
{high:70,low:44},
{high:62,low:45},
{high:68,low:50}
],

lightning:0,
rain:0,

indoorTemp:67,
indoorHumidity:57,
indoorDew:55

};

// ---------------- LOOP ----------------

function loop(){

shimmerOffset+=1;

if(shimmerOffset>200) shimmerOffset=-60;

draw(data);

requestAnimationFrame(loop);

}

// ---------------- START ----------------

bg.onload=()=>{

loop();

};
