// Get canvas and context
const canvas = document.getElementById('dashboard-canvas');
const ctx = canvas.getContext('2d');

// Load the template image
const img = new Image();
img.src = 'https://i.postimg.cc/x1nFF5jq/weathersample2-1blankkindoffixed.png'; // use your image URL or local path

img.onload = () => {
  // Set canvas size to the image size
  canvas.width = img.width;
  canvas.height = img.height;

  // Draw template background
  ctx.drawImage(img, 0, 0);

  // ---------- Current Conditions ----------
  let currentTemp = 74.3; // tenths for current temperature
  let tempX = 300;         // adjust to align under "Current Conditions" header
  let tempY = 220;

  ctx.font = 'bold 72px "Segoe UI"';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.shadowColor = 'rgba(0,0,0,0.7)';
  ctx.shadowBlur = 4;

  ctx.fillText(currentTemp.toFixed(1) + '°F', tempX, tempY);

  // ---------- Dew Point ----------
  let dewPointTemp = 65;   // whole number
  let dewX = 300;          // align under "Dew Point" header
  let dewY = 500;

  ctx.font = 'bold 32px "Segoe UI"';
  ctx.fillText(dewPointTemp + '°F', dewX, dewY);

  // ---------- Other overlays (unchanged) ----------
  // Next three days
  ctx.fillText('70° / 44°', 600, 380);
  ctx.fillText('62° / 45°', 830, 380);
  ctx.fillText('68° / 50°', 1060, 380);

  // Lightning
  ctx.fillText('0 Strikes', 280, 780);

  // Barometric pressure
  ctx.fillText('28.97 inHg ▼', 600, 820);

  // Rainfall
  ctx.fillText('0.00 in', 600, 1050);

  // Indoor weather
  ctx.fillText('67°F', 280, 1280);
  ctx.fillText('57% Humidity', 280, 1320);
  ctx.fillText('Dew Point: 55°F', 280, 1350);

  // Footer logo
  ctx.font = 'bold 48px "Segoe UI"';
  ctx.textAlign = 'center';
  ctx.fillText('SH', canvas.width / 2, 1450);
};
