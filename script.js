const canvas = document.getElementById("dashboard")
const ctx = canvas.getContext("2d")

canvas.width = 1920
canvas.height = 1080

/* ---------------- GRID SYSTEM ---------------- */

const margin = 60
const gap = 30

const colWidth = (1920 - margin*2 - gap*2) / 3

const col1 = margin
const col2 = margin + colWidth + gap
const col3 = margin + (colWidth + gap) * 2

const headerHeight = 100
const row1Y = headerHeight + 40
const row2Y = row1Y + 320 + gap
const row3Y = row2Y + 260 + gap

/* ---------------- FAKE DATA ---------------- */

const current = {
temp:74,
condition:"Sunny",
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
last:"2026-03-08 14:15",
distance:2.5,
direction:"↗",
minute:0,
fifteen:1,
hour:3,
midnight:8
}

const forecast = [
{high:70,low:44},
{high:62,low:45},
{high:68,low:50}
]

/* ---------------- HELPERS ---------------- */

function panel(x,y,w,h,title){

ctx.fillStyle='rgba(40,50,70,0.55)'
ctx.fillRect(x,y,w,h)

ctx.fillStyle="#FFF"
ctx.font="bold 30px Arial"
ctx.fillText(title,x+20,y+40)

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

/* ---------------- DRAW LOOP ---------------- */

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

const subtitle="RUSHVILLE, INDIANA"
let subWidth=ctx.measureText(subtitle).width

ctx.fillText(subtitle,(canvas.width-subWidth)/2,85)

/* CURRENT CONDITIONS */

panel(col1,row1Y,colWidth,320,"CURRENT CONDITIONS")

gradientText("#FFE0E0","#FFC8C8",col1+20,row1Y+200,current.temp+"°",150)

ctx.fillStyle="#FFF"
ctx.font="32px Arial"
ctx.fillText(current.condition,col1+260,row1Y+130)

ctx.font="24px Arial"

ctx.fillText("Dew",col1+260,row1Y+180)
ctx.fillText("Humidity",col1+350,row1Y+180)
ctx.fillText("Pressure",col1+470,row1Y+180)

gradientText("#A0FFD0","#D0FFEE",col1+260,row1Y+210,current.dew+"°",30)
gradientText("#A0C8FF","#D0E0FF",col1+350,row1Y+210,current.humidity+"%",30)

let mb=Math.round(current.pressure*33.8639)

gradientText("#FFA0FF","#FFD0FF",col1+470,row1Y+210,current.pressure.toFixed(2),30)

ctx.font="18px Arial"
ctx.fillStyle="#FFF"
ctx.fillText(mb+" MB",col1+540,row1Y+210)

/* RADAR */

panel(col2,row1Y,colWidth,320,"RADAR")

ctx.font="36px Arial"
ctx.fillStyle="#FFFFFFAA"
ctx.fillText("RADAR IMAGE HERE",col2+120,row1Y+180)

/* LIGHTNING */

panel(col3,row1Y,colWidth,320,"LIGHTNING")

ctx.font="24px Arial"
ctx.fillStyle="#FFF"

ctx.fillText("Last Strike",col3+20,row1Y+90)
ctx.fillText("Distance",col3+20,row1Y+120)
ctx.fillText("Direction",col3+20,row1Y+150)

gradientText("#FFC080","#FFD0AA",col3+200,row1Y+90,lightning.last,26)
gradientText("#80D0FF","#40A0FF",col3+200,row1Y+120,lightning.distance+" mi",26)
gradientText("#A0FFD0","#D0FFEE",col3+200,row1Y+150,lightning.direction,28)

ctx.font="22px Arial"

ctx.fillText("Last Minute",col3+20,row1Y+200)
ctx.fillText("15 Minutes",col3+20,row1Y+230)
ctx.fillText("Last Hour",col3+20,row1Y+260)
ctx.fillText("Since Midnight",col3+20,row1Y+290)

gradientText("#FFD0AA","#FFC080",col3+200,row1Y+200,lightning.minute,26)
gradientText("#80D0FF","#40A0FF",col3+200,row1Y+230,lightning.fifteen,26)
gradientText("#A0FFD0","#D0FFEE",col3+200,row1Y+260,lightning.hour,26)
gradientText("#FF80FF","#FFA0FF",col3+200,row1Y+290,lightning.midnight,26)

/* FORECAST */

panel(col1,row2Y,colWidth,260,"3 DAY FORECAST")

const labels=getNextThreeDays()

let fx=col1+40

for(let i=0;i<3;i++){

ctx.fillStyle="#FFF"
ctx.font="30px Arial"
ctx.fillText(labels[i],fx,row2Y+110)

gradientText("#FFC080","#FFD0AA",fx,row2Y+160,forecast[i].high+"°",40)

ctx.fillStyle="#888"
ctx.fillRect(fx+60,row2Y+130,2,40)

gradientText("#40A0FF","#80D0FF",fx+70,row2Y+160,forecast[i].low+"°",40)

fx+=180

}

/* WIND */

panel(col2,row2Y,colWidth,260,"WIND")

ctx.font="24px Arial"
ctx.fillStyle="#FFF"

ctx.fillText("Speed",col2+20,row2Y+110)
ctx.fillText("Gust",col2+20,row2Y+140)

gradientText("#FFC080","#FFD0AA",col2+110,row2Y+110,wind.speed,30)
gradientText("#80D0FF","#40A0FF",col2+110,row2Y+140,wind.gust,30)

const cx=col2+350
const cy=row2Y+140
const angle=(wind.direction-90)*Math.PI/180

ctx.save()
ctx.translate(cx,cy)
ctx.rotate(angle)

ctx.strokeStyle="#FFF"
ctx.lineWidth=4

ctx.beginPath()
ctx.moveTo(0,0)
ctx.lineTo(70,0)
ctx.stroke()

ctx.beginPath()
ctx.moveTo(70,0)
ctx.lineTo(55,8)
ctx.lineTo(55,-8)
ctx.closePath()
ctx.fillStyle="#FFEEAA"
ctx.fill()

ctx.restore()

/* RAIN */

panel(col3,row2Y,colWidth,260,"RAINFALL")

ctx.font="24px Arial"
ctx.fillStyle="#FFF"

ctx.fillText("Daily Total",col3+20,row2Y+110)
ctx.fillText("Rain Rate",col3+20,row2Y+150)

gradientText("#40A0FF","#80D0FF",col3+220,row2Y+110,rainfall.daily+" in",34)
gradientText("#80D0FF","#A0C8FF",col3+220,row2Y+150,rainfall.rate+" in/hr",34)

/* INDOOR */

panel(col1,row3Y,colWidth,200,"INDOOR WEATHER")

ctx.font="24px Arial"
ctx.fillStyle="#FFF"

ctx.fillText("Temp",col1+20,row3Y+100)
ctx.fillText("Humidity",col1+180,row3Y+100)
ctx.fillText("Dew",col1+360,row3Y+100)

gradientText("#FFC8C8","#FFE0E0",col1+20,row3Y+140,indoor.temp+"°",34)
gradientText("#A0C8FF","#D0E0FF",col1+180,row3Y+140,indoor.humidity+"%",34)
gradientText("#A0FFD0","#D0FFEE",col1+360,row3Y+140,indoor.dew+"°",34)

/* FOOTER */

ctx.fillStyle="#A0FFE0"
ctx.font="24px Arial"

ctx.fillText(
"LOCAL WEATHER PROTOTYPE DISPLAY • SPORTS AND STOCK PANELS AVAILABLE",
margin,
1040
)

requestAnimationFrame(draw)

}

draw()
