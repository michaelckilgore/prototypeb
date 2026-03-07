const canvas = document.getElementById("dashboard");
const ctx = canvas.getContext("2d");

function setupCanvas(){

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

draw();

}

window.onload = setupCanvas;
window.onresize = setupCanvas;

function draw(){

// background
ctx.fillStyle = "#0f1a26";
ctx.fillRect(0,0,canvas.width,canvas.height);

// title
ctx.fillStyle = "white";
ctx.font = "bold 60px Arial";
ctx.fillText("Weather Panel Running",100,100);

// sample data
let temp = 74.3;
let dew = 65;
let humidity = 57;
let pressure = 28.97;

// temperature
ctx.fillStyle = "#FFD59E";
ctx.font = "bold 80px Arial";
ctx.fillText(temp.toFixed(1)+"°",100,220);

// conditions
ctx.fillStyle = "#E6EAF0";
ctx.font = "40px Arial";

ctx.fillText("Dew Point: "+dew+"°",100,320);
ctx.fillText("Humidity: "+humidity+"%",100,380);
ctx.fillText("Pressure: "+pressure.toFixed(2),100,440);

// forecast
ctx.font = "bold 50px Arial";

ctx.fillText("70° / 44°",500,250);
ctx.fillText("62° / 45°",750,250);
ctx.fillText("68° / 50°",1000,250);

}
