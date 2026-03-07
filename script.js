const canvas = document.getElementById("dashboard");
const ctx = canvas.getContext("2d");

const bg = new Image();
bg.src = "images/weather-background.png";

const rain = new Image();
rain.src = "images/rain.svg";

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

function drawTemp(text,x,y,size,color){

ctx.font="bold "+size+"px Segoe UI";

const g=ctx.createLinearGradient(0,y,0,y+size);

g.addColorStop(0,"#ffffff");
g.addColorStop(1,color);

ctx.fillStyle=g;

ctx.shadowColor=color;
ctx.shadowBlur=18;

ctx.fillText(text,x,y);

ctx.shadowBlur=0;

}

function text(t,x,y,s){

ctx.font="bold "+s+"px Segoe UI";
ctx.fillStyle="#E6EAF0";

ctx.shadowColor="black";
ctx.shadowBlur=4;

ctx.fillText(t,x,y);

ctx.shadowBlur=0;

}

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height);

ctx.drawImage(bg,0,0,1920,1080);

// icon

ctx.drawImage(rain,90,140,70,70);

// current temp

drawTemp(data.temp.toFixed(1)+"°",180,140,90,"#FFD59E");

// conditions

drawTemp(data.dew+"°",60,250,28,"#FFD59E");

text(data.humidity+"%",160,250,28);

text(data.pressure.toFixed(2),260,250,28);

// forecast

data.forecast.forEach((d,i)=>{

let x=600+(i*250);

drawTemp(d.high+"°",x,360,50,"#FFD59E");

ctx.fillStyle="rgba(255,255,255,.4)";
ctx.fillRect(x+70,375,3,35);

drawTemp(d.low+"°",x+90,360,46,"#FFD59E");

});

}

// ensure images load first

let loaded=0;

function ready(){
loaded++;
if(loaded===2) draw();
}

bg.onload=ready;
rain.onload=ready;
