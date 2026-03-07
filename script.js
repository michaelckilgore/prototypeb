// Get canvas and context
const canvas = document.getElementById('dashboard-canvas');
const ctx = canvas.getContext('2d');

// Load the template image
const img = new Image();
img.src = 'https://i.postimg.cc/x1nFF5jq/weathersample2-1blankkindoffixed.png'; 

// Function to get color by temperature
function getTempColor(temp) {
  if (temp < 30) return '#00BFFF';       // Blue
  if (temp < 40) return '#1E90FF';       // Light Blue
  if (temp < 50) return '#00FFFF';       // Cyan
  if (temp < 60) return '#00FF00';       // Green
  if (temp < 70) return '#FFFF00';       // Yellow
  if (temp < 80) return '#FFA500';       // Orange
  if (temp < 90) return '#FF4500';       // Red-Orange
  return '#FF0000';                       // Dark Red
}

img.onload = () => {
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  // ------------------ Current Temperature ------------------
  let currentTemp = 74.3;
  let tempX = 150;
  let tempY = 155;

  ctx.font = 'bold 50px "Segoe UI"';
  ctx.fillStyle = getTempColor(currentTemp);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.shadowColor = 'rgba(0,0,0,0.7)';
  ctx.shadowBlur = 4;

  ctx.fillText(currentTemp.toFixed(1), tempX, tempY);

  // ------------------ Dew Point ------------------
  let dewPointTemp = 65;
  let dewX = 55;
  let dewY = 243;

  ctx.font = 'bold 28px "Segoe UI"';
  ctx.fillStyle = getTempColor(dewPointTemp);
  ctx.fillText(dewPointTemp + '°', dewX, dewY);

  // ------------------ Humidity ------------------
  let humidity = 57;
  let humX = 157;
  let humY = 243;

  ctx.fillStyle = 'white';
  ctx.fillText(humidity + '%', humX, humY);

  // ------------------ Pressure ------------------
  let pressure = 28.97;
  let pressX = 252;
  let pressY = 243;

  ctx.fillText(pressure.toFixed(2), pressX, pressY);

  // ------------------ Next Three Days ------------------
  let nextThreeDays = [
    { high: 70, low: 44, x: 600, y: 380 },
    { high: 62, low: 45, x: 830, y: 380 },
    { high: 68, low: 50, x: 1060, y: 380 }
  ];

  ctx.font = 'bold 32px "Segoe UI"';
  nextThreeDays.forEach(day => {
    ctx.fillStyle = getTempColor(day.high);
    ctx.fillText(day.high + '°', day.x, day.y);

    ctx.fillStyle = getTempColor(day.low);
    ctx.fillText(day.low + '°', day.x + 70, day.y);
  });

  // ------------------ Lightning ------------------
  ctx.fillStyle = 'white';
  ctx.fillText('0 Strikes', 280, 780);

  // ------------------ Rainfall ------------------
  ctx.fillText('0.00 in', 600, 1050);

  // ------------------ Indoor Weather ------------------
  let indoorTemp = 67;
  let indoorDew = 55;

  // Indoor Temperature
  ctx.fillStyle = getTempColor(indoorTemp);
  ctx.fillText(indoorTemp, 280, 1280);

  // Indoor Humidity stays white
  ctx.fillStyle = 'white';
  ctx.fillText('57% Humidity', 280, 1320);

  // Indoor Dew Point color-coded
  ctx.fillStyle = getTempColor(indoorDew);
  ctx.fillText(indoorDew + '°', 280, 1350);

  // ------------------ Footer logo ------------------
  ctx.font = 'bold 48px "Segoe UI"';
  ctx.textAlign = 'center';
  ctx.fillText('SH', canvas.width / 2, 1450);
};
