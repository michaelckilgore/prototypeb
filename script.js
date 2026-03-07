const canvas = document.getElementById("dashboard");
const ctx = canvas.getContext("2d");

function resizeCanvas(){
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// ---------------- IMAGES ----------------

const bg = new Image();
bg.src = "images/weather-background.png";

const icon = new Image();
icon.src = "images/rain.svg";

// ---------------- TEMP COLORS ----------------

function tempColor(t){

if(t<30) return "#8EC9FF";
if(t<40) return "#7FB8FF";
if(t<50) return "#8FE0FF";
if(t<60) return "#9BE8B2";
if(t<70) return "#FFF3A6";
if(t<80) return "#FFD59E";
if(t<90) return "#FFB59E";
return "#FF9E9E";

}

// ---------------- LIGHTEN ----------------

function lighten(hex,amt){

let num=parseInt(hex.replace("#",""),16);

let r=(num>>16)+amt;
let g=((num>>8)&255)+amt;
let b=(num&255)+amt;

r=Math.min(255,r);
g=Math.min(255,g);
b=Math.min(255,b);

return "#" + (b | (g<<8) | (r<<16)).toString(16);

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

ctx.shadowColor=color;
ctx.shadowBlur=18;
ctx.globalAlpha=.35;
ctx.fillStyle=color;

ctx.fillText(text,x,y);

ctx.globalAlpha=1;

const light=lighten(color,60);

const g=ctx.createLinearGradient(0,y,0,y+size);

g.addColorStop(0,light);
g.addColorStop(1,color);

ctx.shadowBlur=4;
ctx.shadowColor="rgba(0,0,0,.35)";
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

// ---------------- SAMPLE DATA ----------------

const data={

temp:74.3,
dew:65,
humidity:57,
pressure:28.97,

forecast:[
{high:70,low:44},
{high:62,low:45},
{high:68,low:50}
]

};

// ---------------- DRAW ----------------

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height);

// background

if(bg.complete){
ctx.drawImage(bg,0,0,canvas.width,canvas.height);
}

// glass panels

glass(40,120,380,160);
glass(canvas.width/2-350,350,700,150);

// icon

if(icon.complete){
ctx.drawImage(icon,90,160,60,60);
}

// current temp

drawTemp(data.temp.toFixed(1)+"°",180,150,64,tempColor(data.temp));

// conditions

drawTemp(data.dew+"°",60,240,24,tempColor(data.dew));
text(data.humidity+"%",160,240,24);
text(data.pressure.toFixed(2),250,240,24);

// forecast

data.forecast.forEach((d,i)=>{

let x=canvas.width/2-300+(i*220);

drawTemp(d.high+"°",x,390,36,tempColor(d.high));

ctx.fillStyle="rgba(255,255,255,.4)";
ctx.fillRect(x+50,400,2,28);

drawTemp(d.low+"°",x+65,390,32,tempColor(d.low));

});

requestAnimationFrame(draw);

}

draw();
