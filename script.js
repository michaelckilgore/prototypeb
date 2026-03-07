// Get canvas and context
const canvas = document.getElementById('dashboard-canvas');
const ctx = canvas.getContext('2d');

// Load the template image
const img = new Image();
img.src = 'https://i.postimg.cc/x1nFF5jq/weathersample2-1blankkindoffixed.png'; // your template URL

img.onload = () => {
  // Set canvas size to match the image
  canvas.width = img.width;
  canvas.height = img.height;

  // Draw the template
  ctx.drawImage(img, 0, 0);

  // ------------------ Current Temperature ------------------
  let currentTemp = 74.3; // tenths
  let tempX = 150;         // next to template sunny icon
  let tempY = 155;

  ctx.font = 'bold 50px "Segoe UI"';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.shadowColor = 'rgba(0,0,0,0.7)';
  ctx.shadowBlur = 4;

  ctx.fillText(currentTemp.toFixed(1), tempX, tempY);

  // ------------------ Dew Point ------------------
  let dewPointTemp = 65;  
  let dewX = 55;  // nudged right
  let dewY = 243;

  ctx.font = 'bold 28px "Segoe UI"';
  ctx.fillText(dewPointTemp + '°', dewX, dewY);

  // ------------------ Humidity ------------------
  let humidity = 57; 
  let humX = 157;  // nudged right
  let humY = 243;

  ctx.fillText(humidity + '%', humX, humY);

  // ------------------ Pressure ------------------
  let pressure = 28.97; 
  let pressX = 252;  // nudged left
  let pressY = 243;

  ctx.fillText(pressure.toFixed(2), pressX, pressY);

  // ------------------ Next Three Days (unchanged) ------------------
  ctx.font = 'bold 32px "Segoe UI"';
  ctx.fillText('70° / 44°', 600, 380);
  ctx.fillText('62° / 45°', 830, 380);
  ctx.fillText('68° / 50°', 1060, 380);

  // ------------------ Lightning ------------------
  ctx.fillText('0 Strikes', 280, 780);

  // ------------------ Rainfall ------------------
  ctx.fillText('0.00 in', 600, 1050);

  // ------------------ Indoor Weather ------------------
  ctx.fillText('67°F', 280, 1280);
  ctx.fillText('57% Humidity', 280, 1320);
  ctx.fillText('Dew Point: 55°F', 280, 1350);

  // ------------------ Footer logo ------------------
  ctx.font = 'bold 48px "Segoe UI"';
  ctx.textAlign = 'center';
  ctx.fillText('SH', canvas.width / 2, 1450);
};
