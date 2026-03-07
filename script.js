const canvas = document.getElementById('dashboard-canvas');
const ctx = canvas.getContext('2d');

const img = new Image();
img.src = 'https://i.postimg.cc/x1nFF5jq/weathersample2-1blankkindoffixed.png';

function getTempColor(temp) {
  if (temp < 30) return '#00BFFF';
  if (temp < 40) return '#1E90FF';
  if (temp < 50) return '#00FFFF';
  if (temp < 60) return '#00FF00';
  if (temp < 70) return '#FFFF00';
  if (temp < 80) return '#FFA500';
  if (temp < 90) return '#FF4500';
  return '#FF0000';
}

img.onload = () => {
  // Set canvas internal drawing size to match template
  canvas.width = img.width;
  canvas.height = img.height;

  function drawDashboard() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw template
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Calculate scale factors based on displayed size
    const scaleX = canvas.clientWidth / img.width;
    const scaleY = canvas.clientHeight / img.height;

    // Helper to scale coordinates and font
    function drawTextScaled(text, x, y, fontSize, color) {
      ctx.font = `bold ${fontSize * scaleY}px "Segoe UI"`; // scale font vertically
      ctx.fillStyle = color;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.shadowColor = 'rgba(0,0,0,0.7)';
      ctx.shadowBlur = 4;
      ctx.fillText(text, x * scaleX, y * scaleY);
    }

    // ------------------ Current Temperature ------------------
    let currentTemp = 74.3;
    drawTextScaled(currentTemp.toFixed(1), 150, 155, 50, getTempColor(currentTemp));

    // ------------------ Dew Point ------------------
    let dewPointTemp = 65;
    drawTextScaled(dewPointTemp + '°', 55, 243, 28, getTempColor(dewPointTemp));

    // ------------------ Humidity ------------------
    drawTextScaled('57%', 157, 243, 28, 'white');

    // ------------------ Pressure ------------------
    drawTextScaled('28.97', 252, 243, 28, 'white');

    // ------------------ Next Three Days ------------------
    let nextThreeDays = [
      { high: 70, low: 44, x: 600, y: 380 },
      { high: 62, low: 45, x: 830, y: 380 },
      { high: 68, low: 50, x: 1060, y: 380 }
    ];

    nextThreeDays.forEach(day => {
      drawTextScaled(day.high + '°', day.x, day.y, 32, getTempColor(day.high));
      drawTextScaled(day.low + '°', day.x + 70, day.y, 32, getTempColor(day.low));
    });

    // ------------------ Indoor Weather ------------------
    drawTextScaled(67, 280, 1280, 32, getTempColor(67));
    drawTextScaled('57% Humidity', 280, 1320, 32, 'white');
    drawTextScaled(55 + '°', 280, 1350, 32, getTempColor(55));

    // ------------------ Lightning ------------------
    drawTextScaled('0 Strikes', 280, 780, 32, 'white');

    // ------------------ Rainfall ------------------
    drawTextScaled('0.00 in', 600, 1050, 32, 'white');

    // ------------------ Footer logo ------------------
    ctx.font = `bold ${48 * scaleY}px "Segoe UI"`;
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.fillText('SH', (canvas.width / 2) * scaleX, 1450 * scaleY);
  }

  // Initial draw
  drawDashboard();

  // Redraw on window resize
  window.addEventListener('resize', () => {
    drawDashboard();
  });
};
