const radarConfig = {
  center: [39.6092, -85.4464],
  zoom: 9,
  radar: "KIND",
  product: "N0Q",
  frames: 6,
  animationMs: 850,
  refreshMs: 120000,
  cities: [
    { name: "Indianapolis", lat: 39.7684, lon: -86.1581 },
    { name: "Rushville", lat: 39.6092, lon: -85.4464 },
    { name: "Shelbyville", lat: 39.5214, lon: -85.7769 },
    { name: "Greensburg", lat: 39.3373, lon: -85.4836 },
    { name: "Connersville", lat: 39.6412, lon: -85.1411 },
    { name: "Franklin", lat: 39.4806, lon: -86.0549 }
  ],
  highways: [
    { name: "I-74", lat: 39.58, lon: -85.82 },
    { name: "I-70", lat: 39.78, lon: -85.94 },
    { name: "US 52", lat: 39.63, lon: -85.53 },
    { name: "SR 44", lat: 39.48, lon: -85.83 },
    { name: "SR 3", lat: 39.70, lon: -85.62 },
    { name: "SR 244", lat: 39.32, lon: -85.35 },
    { name: "US 40", lat: 39.80, lon: -85.76 },
    { name: "I-465", lat: 39.79, lon: -86.06 },
    { name: "I-65", lat: 39.32, lon: -85.98 },
    { name: "SR 9", lat: 39.67, lon: -85.61 },
    { name: "US 31", lat: 39.28, lon: -85.97 }
  ]
};

const radarState = {
  map: null,
  frameLayers: [],
  frameTimes: [],
  frameIndex: 0,
  animationTimer: null,
  refreshTimer: null,
  latestLayer: null
};

function setRadarStatus(text) {
  const el = document.getElementById("radar-status");
  if (el) el.textContent = text;
}

function radarStampToDisplay(stamp) {
  if (!stamp || stamp === "0") return "latest";
  const m = stamp.match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})$/);
  if (!m) return stamp;

  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]));
  return d.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short"
  });
}

function createRadarTileLayer(stamp) {
  return L.tileLayer(
    `https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/ridge::${radarConfig.radar}-${radarConfig.product}-${stamp}/{z}/{x}/{y}.png`,
    {
      pane: "radarPane",
      opacity: 0,
      maxZoom: 12,
      updateWhenIdle: false,
      updateWhenZooming: false
    }
  );
}

function clearRadarFrames() {
  if (radarState.animationTimer) {
    clearInterval(radarState.animationTimer);
    radarState.animationTimer = null;
  }

  radarState.frameLayers.forEach((layer) => {
    if (radarState.map && radarState.map.hasLayer(layer)) {
      radarState.map.removeLayer(layer);
    }
  });

  radarState.frameLayers = [];
  radarState.frameTimes = [];
  radarState.frameIndex = 0;

  if (radarState.latestLayer && radarState.map && radarState.map.hasLayer(radarState.latestLayer)) {
    radarState.map.removeLayer(radarState.latestLayer);
  }

  radarState.latestLayer = null;
}

function showRadarFrame(index) {
  radarState.frameLayers.forEach((layer, i) => {
    layer.setOpacity(i === index ? 0.9 : 0);
  });

  radarState.frameIndex = index;
  const stamp = radarState.frameTimes[index];
  setRadarStatus(`KIND • ${radarStampToDisplay(stamp)}`);
}

function startRadarAnimation() {
  if (!radarState.frameLayers.length) return;

  showRadarFrame(0);

  radarState.animationTimer = setInterval(() => {
    const next = (radarState.frameIndex + 1) % radarState.frameLayers.length;
    showRadarFrame(next);
  }, radarConfig.animationMs);
}

function extractRadarStamps(json) {
  const found = [];

  function scan(value) {
    if (value == null) return;

    if (typeof value === "string") {
      const m = value.match(/(\d{12})/);
      if (m) found.push(m[1]);
      return;
    }

    if (Array.isArray(value)) {
      value.forEach(scan);
      return;
    }

    if (typeof value === "object") {
      Object.values(value).forEach(scan);
    }
  }

  scan(json);
  return [...new Set(found)].sort().slice(-radarConfig.frames);
}

async function loadRadarLoop() {
  if (!radarState.map) return;

  try {
    const response = await fetch(
      `https://mesonet.agron.iastate.edu/json/radar.py?operation=list&radar=${radarConfig.radar}&product=${radarConfig.product}`
    );

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const json = await response.json();
    const stamps = extractRadarStamps(json);

    clearRadarFrames();

    if (!stamps.length) {
      throw new Error("No radar timestamps found");
    }

    radarState.frameTimes = stamps;
    radarState.frameLayers = stamps.map(createRadarTileLayer);

    radarState.frameLayers.forEach((layer) => layer.addTo(radarState.map));
    startRadarAnimation();
  } catch (error) {
    console.error("Radar loop load failed:", error);
    clearRadarFrames();
    radarState.latestLayer = createRadarTileLayer("0");
    radarState.latestLayer.setOpacity(0.9);
    radarState.latestLayer.addTo(radarState.map);
    setRadarStatus("KIND • latest");
  }
}

function addRadarLabels() {
  radarConfig.cities.forEach((city) => {
    L.marker([city.lat, city.lon], {
      interactive: false,
      icon: L.divIcon({
        className: "radar-city-label",
        html: city.name,
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      })
    }).addTo(radarState.map);
  });

  radarConfig.highways.forEach((route) => {
    L.marker([route.lat, route.lon], {
      interactive: false,
      icon: L.divIcon({
        className: "radar-highway-label",
        html: route.name,
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      })
    }).addTo(radarState.map);
  });

  L.marker(radarConfig.center, {
    interactive: false,
    icon: L.divIcon({
      className: "",
      html: '<div class="radar-station-dot"></div>',
      iconSize: [10, 10],
      iconAnchor: [5, 5]
    })
  }).addTo(radarState.map);

  L.marker([radarConfig.center[0] + 0.02, radarConfig.center[1] + 0.02], {
    interactive: false,
    icon: L.divIcon({
      className: "radar-station-label",
      html: "Sugar Hill",
      iconSize: [0, 0],
      iconAnchor: [0, 0]
    })
  }).addTo(radarState.map);
}

function initRadar() {
  const mapEl = document.getElementById("radar-map");
  if (!mapEl) return;

  radarState.map = L.map(mapEl, {
    zoomControl: false,
    attributionControl: false,
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    keyboard: false,
    touchZoom: false
  }).setView(radarConfig.center, radarConfig.zoom);

  radarState.map.createPane("basePane");
  radarState.map.createPane("countyPane");
  radarState.map.createPane("radarPane");

  radarState.map.getPane("basePane").style.zIndex = 200;
  radarState.map.getPane("countyPane").style.zIndex = 400;
  radarState.map.getPane("radarPane").style.zIndex = 500;

  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
    {
      pane: "basePane",
      subdomains: "abcd",
      maxZoom: 19
    }
  ).addTo(radarState.map);

  L.tileLayer.wms(
    "https://tigerweb.geo.census.gov/arcgis/services/TIGERweb/tigerWMS_Current/MapServer/WmsServer",
    {
      layers: "82",
      format: "image/png",
      transparent: true,
      opacity: 0.5,
      pane: "countyPane"
    }
  ).addTo(radarState.map);

  addRadarLabels();
  loadRadarLoop();

  radarState.refreshTimer = setInterval(loadRadarLoop, radarConfig.refreshMs);

  setTimeout(() => radarState.map.invalidateSize(), 200);
}
