const canvas = document.getElementById("dashboard");
const ctx = canvas.getContext("2d");

// WEATHER DATA
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

// LOAD TEMPLATE
const bg = new Image();
bg.src = "images/weather-background.png";

// LOAD ICON
const rain = new Image();
rain.src = "images/rain.svg";

// SAFE DRAW FUNCTION
function draw(){

// background fallback
ctx.fillStyle = "#0f1a26";
ctx.fillRect(0,0,1920,1080);

// draw template if it exists
if(bg.complete){
ctx.drawImage(bg,0,0,1920,1080);
}

// draw icon if it exists
if(rain.complete){
ctx.drawImage(rain,90,140,70,70);
}

// CURRENT TEMP
ctx.fillStyle="#FFD59E";
ctx.font="bold 90px Segoe UI";
ctx.fillText(data.temp.toFixed(1)+"°",180,200);

// CONDITIONS
ctx.fillStyle="#E6EAF0";
ctx.font="40px Segoe UI";

ctx.fillText(data.dew+"°",60,300);
ctx.fillText(data.humidity+"%",160,300);
ctx.fillText(data.pressure.toFixed(2),260,300);

// FORECAST
data.forecast.forEach((d,i)=>{

let x = 600 + (i*250);

ctx.fillStyle="#FFD59E";
ctx.font="bold 60px Segoe UI";
ctx.fillText(d.high+"°",x,420);

ctx.fillStyle="rgba(255,255,255,.4)";
ctx.fillRect(x+70,435,3,40);

ctx.fillStyle="#FFD59E";
ctx.fillText(d.low+"°",x+90,420);

});

}

// DRAW ON LOAD
window.onload = draw;
