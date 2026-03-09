const canvas = document.getElementById("dashboard")
const ctx = canvas.getContext("2d")

canvas.width = 1920
canvas.height = 1080

/* ICON */

const stormIcon = new Image()
stormIcon.src = "images/storm.svg"

/* GRID */

const margin = 60
const gap = 30

const colWidth = (1920 - margin*2 - gap*2) / 3

const col1 = margin
const col2 = margin + colWidth + gap
const col3 = margin + (colWidth + gap) * 2

const headerHeight = 100

const row1 = headerHeight + 40
const row2 = row1 + 320 + gap
const row3 = row2 + 260 + gap

/* SAMPLE DATA */

const current = {
temp:74,
condition:"Storm",
dew:65,
humidity:57,
pressure:28.97
}

const rainfall = {
daily:0.30,
rate:0.05
}

const wind = {
speed:12,
gust:18,
direction:135
}

const indoor = {
temp:67,
humidity:55,
dew:60
}

const lightning = {
last:new Date(2026,2,8,14,15),
distance:2.5,
direction:"↗",
minute:0,
fifteen:1,
hour:3,
midnight:8
}

const forecast = [
{high:70,low:44,cond:"Storm"},
{high:62,low:45,cond:"Storm"},
{high:68,low:50,cond:"Storm"}
]

const todayStats = {
high:75,
low:51
}

const astronomy = {
sunrise:"8:04 AM",
sunset:"7:41 PM",
moon:"Waning Gibbous"
}

/* HELPERS */

function panel(x,y,w,h,title){

ctx.fillStyle='rgba(40,50,70,0.55)'
ctx.fillRect(x,y,w,h)

ctx.strokeStyle="#6FE8FF"
ctx.lineWidth=2
ctx.strokeRect(x,y,w,h)

ctx.fillStyle="#FFF"
ctx.font="bold 28px Arial"
ctx.fillText(title,x+20,y+36)

}

function gradientText(c1,c2,x,y,text,size){

const g=ctx.createLinearGradient(0,y-size,0,y)
g.addColorStop(0,c1)
g.addColorStop(1,c2)

ctx.fillStyle=g
ctx.font="bold "+size+"px Arial"
ctx.fillText(text,x,y)

}

function getNextThreeDays(){

const days=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]

let today=new Date()

let labels=[]

for(let i=1;i<=3;i++){

let d=new Date(today)
d.setDate(today.getDate()+i)

labels.push(days[d.getDay()])

}

return labels

}

function formatStrikeTime(date){

let month = date.getMonth()+1
let day = date.getDate()

let hours = date.getHours()
let minutes = date.getMinutes().toString().padStart(2,"0")

let suffix = hours >= 12 ? "PM" : "AM"

hours = hours % 12
if(hours === 0) hours = 12

return `${month}/${day} ${hours}:${minutes} ${suffix}`

}

function getClock(){

let now = new Date()

let h = now.getHours()
let m = now.getMinutes().toString().padStart(2,"0")

let suffix = h >= 12 ? "PM" : "AM"
h = h % 12
if(h===0)h=12

let tz = Intl.DateTimeFormat().resolvedOptions().timeZone.includes("Indianapolis") ? "EDT":"EST"

return `${h}:${m} ${suffix} ${tz}`

}

/* DRAW LOOP */

function draw(){

ctx.clearRect(0,0,1920,1080)

/* HEADER */

ctx.fillStyle='rgba(30,40,70,0.7)'
ctx.fillRect(0,0,canvas.width,headerHeight)

const title="SUGAR HILL REPORTING STATION"
ctx.font="bold 44px Arial"
ctx.fillStyle="#FFF"

let titleWidth=ctx.measureText(title).width
let centerX=(canvas.width-titleWidth)/2

ctx.shadowColor="#6FE8FF"
ctx.shadowBlur=15
ctx.fillText(title,centerX,55)
ctx.shadowBlur=0

ctx.font="22px Arial"
ctx.fillStyle="#A0FFE0"

ctx.fillText("RUSHVILLE INDIANA",(canvas.width-230)/2,85)

/* CLOCK */

ctx.font="28px Arial"
ctx.fillStyle="#FFF"
ctx.fillText(getClock(),canvas.width-220,60)

/* CURRENT CONDITIONS */

panel(col1,row1,colWidth,320,"CURRENT CONDITIONS")

gradientText("#FFE0E0","#FFC8C8",col1+20,row1+140,current.temp+"°",150)

ctx.drawImage(stormIcon,col1+260,row1+40,110,110)

ctx.font="28px Arial"
ctx.fillStyle="#FFF"
ctx.fillText(current.condition,col1+260,row1+170)

ctx.font="22px Arial"

ctx.fillText("Dew",col1+20,row1+240)
ctx.fillText("Humidity",col1+150,row1+240)
ctx.fillText("Pressure",col1+340,row1+240)

gradientText("#A0FFD0","#D0FFEE",col1+20,row1+270,current.dew+"°",28)
gradientText("#A0C8FF","#D0E0FF",col1+150,row1+270,current.humidity+"%",28)

let mb=Math.round(current.pressure*33.8639)

gradientText("#FFA0FF","#FFD0FF",col1+340,row1+270,`${current.pressure.toFixed(2)}" / ${mb} MB`,28)

/* RADAR */

panel(col2,row1,colWidth,320,"RADAR")

ctx.fillStyle="#FFFFFFAA"
ctx.font="36px Arial"
ctx.fillText("RADAR FEED",col2+140,row1+180)

/* LIGHTNING */

panel(col3,row1,colWidth,320,"LIGHTNING")

ctx.font="22px Arial"
ctx.fillStyle="#FFF"

ctx.fillText("Last Strike",col3+20,row1+90)
ctx.fillText("Distance",col3+20,row1+120)

gradientText("#FFC080","#FFD0AA",col3+200,row1+90,formatStrikeTime(lightning.last),24)
gradientText("#80D0FF","#40A0FF",col3+200,row1+120,lightning.distance+" mi",24)

/* FORECAST */

panel(col1,row2,colWidth,260,"3 DAY FORECAST")

const labels=getNextThreeDays()

let fx=col1+40

for(let i=0;i<3;i++){

ctx.fillStyle="#FFF"
ctx.font="26px Arial"
ctx.fillText(labels[i],fx,row2+70)

gradientText("#FFC080","#FFD0AA",fx,row2+110,forecast[i].high+"°",38)

ctx.drawImage(stormIcon,fx,row2+120,60,60)

ctx.font="20px Arial"
ctx.fillText("Storm",fx,row2+200)

gradientText("#40A0FF","#80D0FF",fx,row2+230,forecast[i].low+"°",30)

fx+=180

}

/* WIND */

panel(col2,row2,colWidth,260,"WIND")

ctx.font="24px Arial"
ctx.fillStyle="#FFF"

ctx.fillText("Speed",col2+20,row2+110)
ctx.fillText("Gust",col2+20,row2+140)

gradientText("#FFC080","#FFD0AA",col2+120,row2+110,wind.speed,30)
gradientText("#80D0FF","#40A0FF",col2+120,row2+140,wind.gust,30)

/* RAIN */

panel(col3,row2,colWidth,260,"RAINFALL")

ctx.font="24px Arial"
ctx.fillStyle="#FFF"

ctx.fillText("Daily",col3+20,row2+120)
ctx.fillText("Rate",col3+20,row2+150)

gradientText("#40A0FF","#80D0FF",col3+200,row2+120,rainfall.daily+" in",32)
gradientText("#80D0FF","#A0C8FF",col3+200,row2+150,rainfall.rate+" in/hr",32)

/* ASTRONOMY */

panel(col1,row3,colWidth,200,"SUN & MOON")

ctx.font="22px Arial"
ctx.fillStyle="#FFF"

ctx.fillText("Sunrise",col1+20,row3+100)
ctx.fillText("Sunset",col1+20,row3+130)
ctx.fillText("Moon Phase",col1+20,row3+160)

ctx.fillText(astronomy.sunrise,col1+160,row3+100)
ctx.fillText(astronomy.sunset,col1+160,row3+130)
ctx.fillText(astronomy.moon,col1+160,row3+160)

/* moon icon space */

ctx.strokeStyle="#FFF"
ctx.strokeRect(col1+420,row3+70,80,80)

/* TODAY HIGH LOW */

panel(col2,row3,colWidth,200,"TODAY")

ctx.font="26px Arial"
ctx.fillStyle="#FFF"

ctx.fillText("High",col2+40,row3+110)
ctx.fillText("Low",col2+40,row3+150)

gradientText("#FFC080","#FFD0AA",col2+120,row3+110,todayStats.high+"°",36)
gradientText("#40A0FF","#80D0FF",col2+120,row3+150,todayStats.low+"°",36)

/* INDOOR */

panel(col3,row3,colWidth,200,"INDOOR")

ctx.font="22px Arial"
ctx.fillStyle="#FFF"

ctx.fillText("Temp",col3+20,row3+100)
ctx.fillText("Humidity",col3+160,row3+100)

gradientText("#FFC8C8","#FFE0E0",col3+20,row3+140,indoor.temp+"°",32)
gradientText("#A0C8FF","#D0E0FF",col3+160,row3+140,indoor.humidity+"%",32)

/* LOOP */

requestAnimationFrame(draw)

}

draw()
