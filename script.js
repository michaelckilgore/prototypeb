// Get canvas and context
const canvas = document.getElementById('dashboard-canvas');
const ctx = canvas.getContext('2d');

// Load the template image
const img = new Image();
img.src = 'assets/dashboard-template.png'; // relative path in repo

img.onload = () => {
  // Set canvas size to image size
  canvas.width = img.width;
  canvas.height = img.height;

  // Draw template background
  ctx.drawImage(img, 0, 0);

  // Set text style
  ctx.fillStyle = 'white';
  ctx.font = 'bold 36px "Segoe UI", Arial';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.shadowColor = 'rgba(0,0,0,0.7)';
  ctx.shadowBlur = 4;

  // CURRENT CONDITIONS
  ctx.font = 'bold 72px "Segoe UI"';
  ctx.fillText('74°F', 300, 160);

  ctx.font = 'bold 32px "Segoe UI"';
  ctx.fillText('Humidity: 57%', 300, 260);
  ctx.fillText('Dew Point: 65°F', 300, 300);
  ctx.fillText('Sunny', 300, 340);

  // NEXT THREE DAYS
  ctx.fillText('70° / 44°', 600, 380);
  ctx.fillText('62° / 45°', 830, 380);
  ctx.fillText('68° / 50°', 1060, 380);

  // LIGHTNING
  ctx.fillText('0 Strikes', 280, 780);

  // BAROMETRIC PRESSURE
  ctx.fillText('28.97 inHg ▼', 600, 820);

  // RAINFALL
  ctx.fillText('0.00 in', 600, 1050);

  // INDOOR WEATHER
  ctx.fillText('67°F', 280, 1280);
  ctx.fillText('57% Humidity', 280, 1320);
  ctx.fillText('Dew Point: 55°F', 280, 1350);

  // FOOTER LOGO
  ctx.font = 'bold 48px "Segoe UI"';
  ctx.textAlign = 'center';
  ctx.fillText('SH', canvas.width / 2, 1450);
};
