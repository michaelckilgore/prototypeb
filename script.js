const canvas = document.getElementById("dashboard");
const ctx = canvas.getContext("2d");
canvas.width = 1920;
canvas.height = 1080;

// ================= FAKE DATA =================
const current = { temp: 74.3, dew: 65, humidity: 57, pressure: 28.97, condition:"Sunny" };
const forecast = [
    { day:"Mon", high:70, low:44 },
    { day:"Tue", high:62, low:45 },
    { day:"Wed", high:68, low:50 }
];

// ================= WEATHER ICON =================
const icon = new Image();
icon.src = "images/rain.svg"; // placeholder for now

// ================= LIGHTNING PARTICLES =================
const particles = [];
for(let i=0;i<60;i++){
    particles.push({
        x: Math.random()*1920,
        y: Math.random()*300+600,
        alpha: Math.random(),
        speed: Math.random()*0.01+0.005
    });
}

// ================= RADAR SWEEP =================
let sweepAngle = 0;

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

    // -------- background panel glass-morphism --------
    ctx.fillStyle = 'rgba(20,30,50,0.5)';
    ctx.fillRect(50,50,1820,980);

    // -------- header --------
    ctx.fillStyle = "#FFFFFFAA";
    ctx.font = "bold 36px Arial";
    ctx.fillText("SUGAR HILL REPORTING STATION • RUSHVILLE, IN",60,90);

    // -------- current weather icon --------
    if(icon.complete) ctx.drawImage(icon,70,180,70,70);

    // -------- current temp --------
    ctx.font = "bold 120px Arial";
    ctx.shadowColor = "#FFEEEE";
    ctx.shadowBlur = 15;
    pastelGradient("#FFE0E0","#FFC8C8",160,250,current.temp.toFixed(1)+"°",120);
    ctx.shadowBlur = 0;

    // -------- condition text --------
    ctx.font="40px Arial";
    ctx.fillStyle="#FFFFFFCC";
    ctx.fillText(current.condition,160,310);

    // -------- dew, humidity, pressure --------
    ctx.font="40px Arial";
    pastelGradient("#D0FFEE","#A0FFD0",160,370,current.dew+"°",40);
    pastelGradient("#D0E0FF","#A0C8FF",320,370,current.humidity+"%",40);
    pastelGradient("#FFD0FF","#FFA0FF",480,370,current.pressure.toFixed(2),40);

    // -------- lightning particles --------
    particles.forEach(p=>{
        ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x,p.y,2,0,Math.PI*2);
        ctx.fill();
        p.alpha -= p.speed;
        if(p.alpha <=0){
            p.alpha = Math.random()*0.8+0.2;
            p.x = Math.random()*1920;
            p.y = Math.random()*300+600;
        }
    });

    // -------- radar sweep --------
    ctx.save();
    ctx.translate(1600,300);
    ctx.rotate(sweepAngle);
    const grd = ctx.createRadialGradient(0,0,0,0,0,150);
    grd.addColorStop(0,"rgba(0,255,200,0.3)");
    grd.addColorStop(1,"rgba(0,255,200,0)");
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(0,0,150,0,Math.PI/4);
    ctx.lineTo(0,0);
    ctx.fill();
    ctx.restore();
    sweepAngle += 0.01;

    // -------- forecast panels with day names --------
    ctx.font="bold 30px Arial";
    let fx = 150;
    for(let i=0;i<3;i++){
        let f = forecast[(forecastIndex+i)%3];

        // day name
        ctx.fillStyle = "#FFFFFFCC";
        ctx.fillText(f.day, fx, 500);

        // high temperature
        pastelGradient("#FFD0AA","#FFC080",fx,550,f.high+"°",50);

        // separator line
        ctx.fillStyle="rgba(255,255,255,0.4)";
        ctx.fillRect(fx+80,560,3,40);

        // low temperature
        pastelGradient("#80D0FF","#40A0FF",fx+100,550,f.low+"°",46);

        fx+=250;
    }
    forecastTimer++;
    if(forecastTimer%300===0) forecastIndex=(forecastIndex+1)%3;

    // -------- footer ticker --------
    ctx.fillStyle = "#A0FFE0";
    ctx.font="24px Arial";
    ctx.fillText("LOCAL WEATHER PROTOTYPE DISPLAY • SPORTS MODULE READY • STOCK MODULE READY • RADAR PANEL READY",60,1030);

    requestAnimationFrame(draw);
}

draw();
