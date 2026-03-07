function updateClock(){
const now = new Date();
document.getElementById("clock").textContent =
now.toLocaleTimeString();
}

setInterval(updateClock,1000);
updateClock();

const tempData = [68,69,70,71,72,72,73,72,72,71,70,69];
const lightningData = [0,1,0,2,3,4,6,5,3,2,1,0];

new Chart(
document.getElementById("tempChart"),
{
type:"line",
data:{
labels:["1","2","3","4","5","6","7","8","9","10","11","12"],
datasets:[{
label:"Temp",
data:tempData,
tension:.3
}]
},
options:{
plugins:{legend:{display:false}},
scales:{
x:{display:false},
y:{display:false}
}
}
});

new Chart(
document.getElementById("lightningChart"),
{
type:"bar",
data:{
labels:["1","2","3","4","5","6","7","8","9","10","11","12"],
datasets:[{
label:"Strikes",
data:lightningData
}]
},
options:{
plugins:{legend:{display:false}},
scales:{
x:{display:false},
y:{display:false}
}
}
});
