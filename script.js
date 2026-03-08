const canvas = document.getElementById("dashboard");
const ctx = canvas.getContext("2d");
canvas.width = 1920;
canvas.height = 1080;

// ================= FAKE DATA =================
const current = { temp: 74.3, dew: 65, humidity: 57, pressure: 28.97, condition:"Sunny", rainRate: 0.05 };
const forecast = [
    { day:"Mon", high:70, low:44 },
    { day:"Tue", high:62, low:45 },
    { day:"Wed", high:68, low:50 }
];
const rainfall = { dailyTotal: 0.3 };
const indoor = { temp: 67.0, humidity: 57, dew: 65 };
const lightning = {
    lastStrike: "2026-03-08 14:15",
    distance: 2.5,
    direction: "↗",
    strikesLastMinute: 0,
    strikesLast15Min: 1,
    strikesLastHour: 3,
    strikesSinceMidnight: 8
};
const wind = { speed: 12, gust: 18, direction: 135 };

// ================= ICON =================
const icon = new Image();
icon.src = "images/rain.svg"; // placeholder

// ================= FORECAST ROTATION =================
let forecastIndex = 0;
let forecastTimer = 0;

// ================= HELPER: PASTEL GRADIENT TEXT =================
function pastelGradient(colorTop, colorBottom, x, y, text, fontSize){
    const grad = ctx.createLinearGradient(0, y - fontSize, 0, y);
    grad.addColorStop(0, colorTop);
    grad.addColorStop(1, colorBottom);
    ctx.fillStyle = grad;
    ctx.fillText(text, x, y);
}

// ================= DRAW LOOP =================
function draw(){
    ctx.clearRect(0,0,1920,1080);

    // -------- Background --------
    ctx.fillStyle = 'rgba(20,30,50,0.5)';
    ctx.fillRect(50,50,1820,980);

    // -------- Header --------
    ctx.fillStyle = "#FFFFFFAA";
    ctx.font = "bold 36px Arial";
    ctx.fillText("SUGAR HILL REPORTING STATION • RUSHVILLE, IN",60,90);

    // -------- CURRENT CONDITIONS --------
    ctx.fillStyle = 'rgba(40,50,70,0.6)';
    ctx.fillRect(50,140,600,260);
    ctx.fillStyle="#FFFFFFCC";
    ctx.font="bold 36px Arial";
    ctx.fillText("CURRENT CONDITIONS",60,180);

    if(icon.complete) ctx.drawImage(icon,70,200,70,70);

    ctx.font = "bold 120px Arial";
    pastelGradient("#FFE0E0","#FFC8C8",160,250,current.temp.toFixed(1)+"°",120);

    ctx.font="40px Arial";
    ctx.fillStyle="#FFFFFFCC";
    ctx.fillText(current.condition,160,310);

    // Dew, Humidity, Pressure headers
    ctx.font="28px Arial";
    ctx.fillStyle="#FFFFFFAA";
    ctx.fillText("DEW POINT",160,350);
    ctx.fillText("HUMIDITY",320,350);
    ctx.fillText("PRESSURE",480,350);

    // Values
    ctx.font="40px Arial";
    pastelGradient("#D0FFEE","#A0FFD0",160,390,current.dew+"°",40);
    pastelGradient("#D0E0FF","#A0C8FF",320,390,current.humidity+"%",40);
    pastelGradient("#FFD0FF","#FFA0FF",480,390,current.pressure.toFixed(2),40);

    // Pressure in MB
    let pressureMB = (current.pressure*33.8639).toFixed(1);
    ctx.font="28px Arial";
    ctx.fillStyle="#FFFFFFCC";
    ctx.fillText(`${pressureMB} MB`,580,390);

    // -------- THREE DAY FORECAST --------
    ctx.fillStyle = 'rgba(40,50,70,0.5)';
    ctx.fillRect(50,450,700,200);
    ctx.fillStyle="#FFFFFFCC";
    ctx.font="bold 36px Arial";
    ctx.fillText("THREE DAY FORECAST",60,490);

    ctx.font="bold 30px Arial";
    let fx = 80;
    for(let i=0;i<3;i++){
        let f = forecast[(forecastIndex+i)%3];
        ctx.fillStyle="#FFFFFFCC";
        ctx.fillText(f.day, fx,530);
        pastelGradient("#FFD0AA","#FFC080",fx,570,f.high+"°",50);
        ctx.fillStyle="rgba(255,255,255,0.4)";
        ctx.fillRect(fx+80,580,3,40);
        pastelGradient("#80D0FF","#40A0FF",fx+100,570,f.low+"°",46);
        fx+=200;
    }
    forecastTimer++;
    if(forecastTimer%300===0) forecastIndex=(forecastIndex+1)%3;

    // -------- RAINFALL DATA --------
    ctx.fillStyle = 'rgba(40,50,70,0.5)';
    ctx.fillRect(700,140,300,260);
    ctx.fillStyle="#FFFFFFCC";
    ctx.font="bold 36px Arial";
    ctx.fillText("RAINFALL DATA",710,180);

    ctx.font="28px Arial";
    ctx.fillStyle="#FFFFFFAA";
    ctx.fillText("DAILY TOTAL (in)",710,230);
    ctx.fillText("CURRENT RATE (in/hr)",710,280);

    ctx.font="40px Arial";
    pastelGradient("#80D0FF","#40A0FF",920,230,rainfall.dailyTotal.toFixed(2),40);
    pastelGradient("#D0E0FF","#A0C8FF",960,280,current.rainRate.toFixed(2),40);

    // -------- RADAR PLACEHOLDER --------
    const radarX = canvas.width/2-150;
    const radarY = 650;
    const radarSize = 300;
    ctx.fillStyle='rgba(40,50,70,0.5)';
    ctx.fillRect(radarX,radarY,radarSize,radarSize);
    ctx.fillStyle="#FFFFFFCC";
    ctx.font="bold 36px Arial";
    ctx.fillText("RADAR IMAGE HERE", radarX+20, radarY+radarSize/2+12);

    // -------- LIGHTNING DATA SUMMARY --------
    ctx.fillStyle = 'rgba(40,50,70,0.5)';
    ctx.fillRect(1050,140,600,260);
    ctx.fillStyle="#FFFFFFCC";
    ctx.font="bold 36px Arial";
    ctx.fillText("LIGHTNING DATA SUMMARY",1060,180);

    ctx.font="28px Arial";
    ctx.fillStyle="#FFFFFFAA";
    ctx.fillText("Most Recent Strike:",1060,230);
    ctx.fillText("Distance:",1060,270);
    ctx.fillText("Direction:",1060,310);

    ctx.font="40px Arial";
    pastelGradient("#FFD0AA","#FFC080",1300,230,lightning.lastStrike,40);
    pastelGradient("#80D0FF","#40A0FF",1300,270,lightning.distance+" mi",40);
    pastelGradient("#D0FFEE","#A0FFD0",1300,310,lightning.direction,40);

    ctx.font="28px Arial";
    ctx.fillStyle="#FFFFFFAA";
    ctx.fillText("Strikes Last Minute:",1060,360);
    ctx.fillText("Last 15 Minutes:",1060,390);
    ctx.fillText("Last Hour:",1060,420);
    ctx.fillText("Since Midnight:",1060,450);

    ctx.font="40px Arial";
    pastelGradient("#FFD0AA","#FFC080",1300,360,lightning.strikesLastMinute,40);
    pastelGradient("#80D0FF","#40A0FF",1300,390,lightning.strikesLast15Min,40);
    pastelGradient("#D0FFEE","#A0FFD0",1300,420,lightning.strikesLastHour,40);
    pastelGradient("#FFA0FF","#FF80FF",1300,450,lightning.strikesSinceMidnight,40);

    // -------- INDOOR WEATHER --------
    ctx.fillStyle = 'rgba(40,50,70,0.5)';
    ctx.fillRect(50,700,600,200);
    ctx.fillStyle="#FFFFFFCC";
    ctx.font="bold 36px Arial";
    ctx.fillText("INDOOR WEATHER",60,740);

    ctx.font="28px Arial";
    ctx.fillStyle="#FFFFFFAA";
    ctx.fillText("TEMPERATURE",60,780);
    ctx.fillText("HUMIDITY",240,780);
    ctx.fillText("DEW POINT",400,780);

    ctx.font="40px Arial";
    pastelGradient("#FFE0E0","#FFC8C8",60,820,indoor.temp.toFixed(1)+"°",40);
    pastelGradient("#D0E0FF","#A0C8FF",240,820,indoor.humidity+"%",40);
    pastelGradient("#D0FFEE","#A0FFD0",400,820,indoor.dew+"°",40);

    // -------- WIND CONDITIONS --------
    const vaneX = 700;
    const vaneY = 700;
    const vaneWidth = 400;
    const vaneHeight = 200;
    ctx.fillStyle='rgba(40,50,70,0.5)';
    ctx.fillRect(vaneX,vaneY,vaneWidth,vaneHeight);

    ctx.fillStyle="#FFFFFFCC";
    ctx.font="bold 36px Arial";
    ctx.fillText("WIND CONDITIONS",vaneX+20,vaneY+40);

    ctx.font="28px Arial";
    ctx.fillStyle="#FFFFFFAA";
    ctx.fillText("Speed (mph):",vaneX+20,vaneY+80);
    ctx.fillText("Gust (mph):",vaneX+20,vaneY+120);
    ctx.fillText("Direction:",vaneX+20,vaneY+160);

    ctx.font="40px Arial";
    pastelGradient("#FFD0AA","#FFC080",vaneX+180,vaneY+80,wind.speed,40);
    pastelGradient("#80D0FF","#40A0FF",vaneX+180,vaneY+120,wind.gust,40);

    const arrowLength = 50;
    const centerX = vaneX + 320;
    const centerY = vaneY + 120;
    const angleRad = (wind.direction - 90) * Math.PI / 180;

    ctx.save();
    ctx.translate(centerX,centerY);
    ctx.rotate(angleRad);

    ctx.strokeStyle = "#FFFFFFCC";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(arrowLength,0);
    ctx.stroke();

    ctx.fillStyle="#FFEEAA";
    ctx.beginPath();
    ctx.moveTo(arrowLength,0);
    ctx.lineTo(arrowLength-12,6);
    ctx.lineTo(arrowLength-12,-6);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // -------- Footer Ticker --------
    ctx.fillStyle = "#A0FFE0";
    ctx.font="24px Arial";
    ctx.fillText("LOCAL WEATHER PROTOTYPE DISPLAY • SPORTS MODULE READY • STOCK MODULE READY • RADAR PANEL READY",60,1030);

    requestAnimationFrame(draw);
}

draw();
