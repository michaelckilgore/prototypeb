const canvas = document.getElementById("dashboard");
const ctx = canvas.getContext("2d");

// Canvas height tall for scrolling
canvas.width = 1920;
canvas.height = 3000;

// Load icons
const stormIcon = new Image();
stormIcon.src = "images/storm.svg";

// Layout variables
const margin = 60;
const gap = 30;
const colWidth = (canvas.width - margin * 2 - gap * 2) / 3;
const col1 = margin;
const col2 = margin + colWidth + gap;
const col3 = margin + (colWidth + gap) * 2;
const headerHeight = 100;
const row1 = headerHeight + 40;
const row2 = row1 + 320 + gap;
const row3 = row2 + 260 + gap;
const row4 = row3 + 260 + gap;
const row5 = row4 + 260 + gap;

// Fake Data
const current = { temp: 74.2, condition: "Storm", dew: 65, humidity: 57, pressure: 28.97 };
const rainfall = { daily: 0.30, rate: 0.05 };
const wind = { speed: 12, gust: 18, direction: 135 }; // degrees
const indoor = { temp: 67, humidity: 55, dew: 60 };
const lightning = { last: new Date(2026,2,8,14,15), distance: 2.5, direction: "↗", minute: 0, fifteen: 1, hour: 3, midnight: 8 };
const forecast = [
    { high: 70, low: 44, cond: "Storm" },
    { high: 62, low: 45, cond: "Storm" },
    { high: 68, low: 50, cond: "Storm" }
];
const todayStats = { high: 75, low: 51, sunrise: "8:04 AM", sunset: "7:41 PM", moon: "Waning Gibbous" };

// Panel drawing
function panel(x, y, w, h, title) {
    ctx.fillStyle = "rgba(120,140,180,0.25)";
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = "rgba(110,232,255,0.8)";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);
    ctx.fillStyle = "#FFF";
    ctx.font = "bold 28px Arial";
    ctx.fillText(title, x + 20, y + 36);
}

// Temperature gradient
function tempGradientColor(temp) {
    const intervals = [
        { max: 30, top: "#A0E0FF", bottom: "#70C0FF" },
        { max: 40, top: "#90D4FF", bottom: "#60B0FF" },
        { max: 50, top: "#80C8FF", bottom: "#50A0FF" },
        { max: 60, top: "#A0FFD0", bottom: "#70D0A0" },
        { max: 70, top: "#FFE0E0", bottom: "#FFC8C8" },
        { max: 80, top: "#FFD080", bottom: "#FFB060" },
        { max: 90, top: "#FFC050", bottom: "#FF9040" },
        { max: 100, top: "#FFA040", bottom: "#FF7040" },
        { max: 110, top: "#FF8040", bottom: "#FF5030" },
        { max: 120, top: "#FF6040", bottom: "#FF3020" }
    ];
    for (let i = 0; i < intervals.length; i++) {
        if (temp <= intervals[i].max) return intervals[i];
    }
    return intervals[intervals.length - 1];
}

// Draw gradient text
function gradientText(temp, x, y, text, size) {
    const colors = tempGradientColor(temp);
    const g = ctx.createLinearGradient(0, y - size, 0, y);
    g.addColorStop(0, colors.top);
    g.addColorStop(1, colors.bottom);
    ctx.fillStyle = g;
    ctx.font = "bold " + size + "px Arial";
    ctx.fillText(text, x, y);
}

// Next 3 day labels
function getNextThreeDayLabels() {
    const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const today = new Date();
    return ["Today", days[(today.getDay()+1)%7], days[(today.getDay()+2)%7]];
}

// Lightning time format
function formatStrikeTime(date){
    let month=date.getMonth()+1;
    let day=date.getDate();
    let hours=date.getHours();
    let minutes=date.getMinutes().toString().padStart(2,"0");
    let suffix = hours>=12?"PM":"AM";
    hours=hours%12; if(hours===0) hours=12;
    return `${month}/${day} ${hours}:${minutes} ${suffix}`;
}

// Clock with auto DST
function getClock() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true, timeZoneName: "short" });
}

// Wind degrees to compass
function degToCompass(num){
    const val = Math.floor((num/22.5)+0.5);
    const arr=["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
    return arr[(val%16)];
}

// DRAW
function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // HEADER
    ctx.fillStyle = "rgba(30,40,70,0.5)";
    ctx.fillRect(0,0,canvas.width,headerHeight);
    const title="SUGAR HILL REPORTING STATION";
    ctx.font="bold 44px Arial";
    ctx.fillStyle="#FFF";
    ctx.shadowColor="#6FE8FF";
    ctx.shadowBlur=15;
    ctx.fillText(title,(canvas.width-ctx.measureText(title).width)/2,55);
    ctx.shadowBlur=0;
    ctx.font="22px Arial";
    ctx.fillStyle="#A0FFE0";
    ctx.fillText("RUSHVILLE INDIANA",(canvas.width-230)/2,85);
    ctx.font="28px Arial";
    ctx.fillStyle="#FFF";
    ctx.fillText(getClock(), canvas.width-220,60);

    /* --- CURRENT CONDITIONS --- */
    panel(col1,row1,colWidth,320,"CURRENT CONDITIONS");
    ctx.drawImage(stormIcon,col1+20,row1+40,110,110);
    ctx.font="28px Arial";
    ctx.fillStyle="#FFF";
    ctx.fillText(current.condition,col1+40,row1+170);
    gradientText(current.temp,col1+150,row1+210,current.temp.toFixed(1)+"°",150);
    ctx.font="22px Arial";
    ctx.fillText("Dew Point",col1+20,row1+280);
    ctx.fillText("Humidity",col1+150,row1+280);
    ctx.fillText("Pressure",col1+340,row1+280);
    gradientText(current.dew,col1+20,row1+310,current.dew+"°",28);
    gradientText(current.humidity,col1+150,row1+310,current.humidity+"%",28);
    let mb=Math.round(current.pressure*33.8639);
    gradientText(current.pressure,col1+340,row1+310,`${current.pressure.toFixed(2)}" / ${mb} MB`,28);

    /* --- WIND --- */
    panel(col2,row1,colWidth,320,"WIND");
    ctx.font="24px Arial";
    ctx.fillStyle="#FFF";
    ctx.fillText("Speed",col2+20,row1+110);
    ctx.fillText("Gust",col2+20,row1+140);
    ctx.fillText("Direction",col2+20,row1+170);
    gradientText(wind.speed,col2+120,row1+110,wind.speed+" mph",30);
    gradientText(wind.gust,col2+120,row1+140,wind.gust+" mph",30);
    gradientText(degToCompass(wind.direction),col2+120,row1+170,degToCompass(wind.direction),30);

    /* --- INDOOR --- */
    panel(col3,row1,colWidth,320,"INDOOR");
    ctx.font="22px Arial";
    ctx.fillStyle="#FFF";
    ctx.fillText("Temp",col3+20,row1+100);
    ctx.fillText("Humidity",col3+160,row1+100);
    ctx.fillText("Dew Point",col3+320,row1+100);
    gradientText(indoor.temp,col3+20,row1+140,indoor.temp+"°",32);
    gradientText(indoor.humidity,col3+160,row1+140,indoor.humidity+"%",32);
    gradientText(indoor.dew,col3+320,row1+140,indoor.dew+"°",32);

    /* --- FUTURE PANELS --- */
    // Rainfall, Lightning, High/Low + Sunrise/Sunset + Moon, Radar, Three-Day Forecast
    // Draw using row2, row3, row4, row5 coordinates
    // You can expand each section with gradientText and panel like above

    requestAnimationFrame(draw);
}

draw();
