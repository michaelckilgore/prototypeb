// Get canvas and context
const canvas = document.getElementById('dashboard-canvas');
const ctx = canvas.getContext('2d');

// Load the template image
const img = new Image();
img.src = 'https://i.postimg.cc/x1nFF5jq/weathersample2-1blankkindoffixed.png'; // your template URL or local path

img.onload = () => {
  // Set canvas size to match the image
  canvas.width = img.width;
  canvas.height = img.height;

  // Draw the template
  ctx.drawImage(img, 0, 0);

  // ------------------ Current Temperature ------------------
  let currentTemp = 74.3; // tenths of a degree
  let tempX = 101;         // measured X
  let tempY = 160;         // measured Y

  ctx.font = 'bold 72px "Segoe UI"';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.shadowColor = 'rgba(0,0,0,0.7)';
  ctx.shadowBlur = 4;

  ctx.fillText(currentTemp.toFixed(1) + '°F', tempX, tempY);

  // ------------------ Other overlays (unchanged) ------------------
  ctx.font = 'bold 32px "Segoe UI"';

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
