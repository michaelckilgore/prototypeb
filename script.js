const canvas = document.getElementById("dashboard");
const ctx = canvas.getContext("2d");

function resize(){
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
}

resize();
window.addEventListener("resize", resize);

function draw(){

ctx.fillStyle = "#0f1a26";
ctx.fillRect(0,0,canvas.width,canvas.height);

ctx.fillStyle = "white";
ctx.font = "bold 60px Arial";

ctx.fillText("Weather Panel Running", 100,100);

ctx.font = "40px Arial";
ctx.fillText("Current Temp: 74°",100,200);
ctx.fillText("Dew Point: 65°",100,260);
ctx.fillText("Humidity: 57%",100,320);

requestAnimationFrame(draw);

}

draw();
