const canvas = document.getElementById("dashboard");
const ctx = canvas.getContext("2d");

function resize(){
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
}

resize();
window.addEventListener("resize", resize);

// images (optional)

const bg = new Image();
bg.src = "images/weather-background.png";

const rain = new Image();
rain.src = "images/rain.svg";

// pastel temp colors

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

// draw gradient temp

function drawTemp(text,x,y,size,color){

ctx.font = "bold "+size+"px Segoe UI";

const grad = ctx.createLinearGradient(0,y,0,y+size);

grad.addColorStop(0,"white");
grad.addColorStop(1,color);

ctx.fillStyle = grad;

ctx.shadowColor = color;
ctx.shadowBlur = 15;

ctx.fillText(text,x,y);

ctx.shadowBlur = 0;

}

// normal text

function text(t,x,y,size){

ctx.font = "bold "+size+"px Segoe UI";
ctx.fillStyle = "#E6EAF0";

ctx.shadowColor="black";
ctx.shadowBlur=5;

ctx.fillText(t,x,y);

ctx.shadowBlur=0;

}

// sample data

const data = {

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

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height);

// fallback background so screen never goes black
ctx.fillStyle="#0c1118";
ctx.fillRect(0,0,canvas.width,canvas.height);

// background image if available
if(bg.complete){
ctx.drawImage(bg,0,0,canvas.width,canvas.height);
}

// rain icon
if(rain.complete){
ctx.drawImage(rain,80,120,70,70);
}

// current temp

drawTemp(data.temp.toFixed(1)+"°",170,120,70,tempColor(data.temp));

// conditions

drawTemp(data.dew+"°",60,230,26,tempColor(data.dew));
text(data.humidity+"%",160,230,26);
text(data.pressure.toFixed(2),260,230,26);

// forecast

data.forecast.forEach((d,i)=>{

let x = 500 + (i*220);

drawTemp(d.high+"°",x,350,40,tempColor(d.high));

ctx.fillStyle="rgba(255,255,255,.4)";
ctx.fillRect(x+55,360,2,30);

drawTemp(d.low+"°",x+70,350,36,tempColor(d.low));

});

requestAnimationFrame(draw);

}

draw();
