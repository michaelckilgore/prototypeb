const canvas = document.getElementById("dashboard");
const ctx = canvas.getContext("2d");

// background
ctx.fillStyle = "#0f1a26";
ctx.fillRect(0,0,1920,1080);

// title
ctx.fillStyle = "white";
ctx.font = "bold 60px Arial";
ctx.fillText("Weather Panel Running",100,100);

// sample weather data
const temp = 74.3;
const dew = 65;
const humidity = 57;
const pressure = 28.97;

// current temperature
ctx.fillStyle = "#FFD59E";
ctx.font = "bold 90px Arial";
ctx.fillText(temp.toFixed(1)+"°",100,240);

// conditions
ctx.fillStyle = "#E6EAF0";
ctx.font = "40px Arial";

ctx.fillText("Dew Point: "+dew+"°",100,340);
ctx.fillText("Humidity: "+humidity+"%",100,400);
ctx.fillText("Pressure: "+pressure.toFixed(2),100,460);

// forecast
ctx.font = "bold 60px Arial";

ctx.fillText("70° / 44°",600,260);
ctx.fillText("62° / 45°",900,260);
ctx.fillText("68° / 50°",1200,260);
