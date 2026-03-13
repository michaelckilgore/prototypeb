/* =====================================
   SCREEN ROTATION
===================================== */

const SCREENS = [
  "index.html",
  "subscreen-current.html",
  "subscreen-regional-map.html"
];

const ROTATE_SECONDS = 10;

function rotateScreens(){

  const current = window.location.pathname.split("/").pop();

  const index = SCREENS.indexOf(current);

  const next = SCREENS[(index + 1) % SCREENS.length];

  setTimeout(()=>{
    window.location.href = next;
  }, ROTATE_SECONDS * 1000);

}

/* =====================================
   CLOCK
===================================== */

function updateClock(){

  const now = new Date();

  const clock = document.querySelector("#clock") ||
                document.querySelector("#regional-clock");

  if(!clock) return;

  clock.textContent = now.toLocaleTimeString([],{
    hour:'numeric',
    minute:'2-digit'
  });

}

setInterval(updateClock,1000);
updateClock();

/* =====================================
   REGIONAL TEMPERATURE MAP
===================================== */

async function loadRegionalTemps(){

  const layer = document.getElementById("regional-temps-layer");

  if(!layer) return;

  try{

    const r = await fetch("http://localhost:3000/api/regional-temps");

    const data = await r.json();

    document.getElementById("regional-asof").textContent = data.asOfLabel;

    layer.innerHTML = "";

    data.cities.forEach(city=>{

      if(city.tempF === null) return;

      const el = document.createElement("div");

      el.className = "regional-temp";

      el.style.left = city.x + "px";
      el.style.top = city.y + "px";

      el.textContent = city.tempF + "°";

      layer.appendChild(el);

    });

  }catch(e){

    console.error("Regional temp load failed",e);

  }

}

/* =====================================
   INITIALIZATION
===================================== */

rotateScreens();
loadRegionalTemps();
