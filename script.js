const canvas = document.getElementById('dashboard-canvas');
const ctx = canvas.getContext('2d');

const img = new Image();
img.src = 'https://i.postimg.cc/x1nFF5jq/weathersample2-1blankkindoffixed.png'; 

// Load rain SVG
const rainIcon = new Image();
rainIcon.src = 'images/rain.svg'; // your rain icon path

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

function lightenColor(hex, lum) {
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    let rgb = "#", c, i;
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i*2,2),16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)),255)).toString(16);
        rgb += ("00"+c).substr(c.length);
    }
    return rgb;
}

img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;

    function drawDashboard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const scaleX = canvas.clientWidth / img.width;
        const scaleY = canvas.clientHeight / img.height;

        function drawTextScaled(text, x, y, fontSize, tempColor) {
            ctx.font = `bold ${fontSize * scaleY}px "Segoe UI"`;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.shadowColor = 'rgba(0,0,0,0.7)';
            ctx.shadowBlur = 4;

            // Gradient fill
            const gradient = ctx.createLinearGradient(0, y * scaleY, 0, (y + fontSize) * scaleY);
            gradient.addColorStop(0, lightenColor(tempColor, 0.4));
            gradient.addColorStop(1, tempColor);
            ctx.fillStyle = gradient;

            ctx.fillText(text, x * scaleX, y * scaleY);
        }

        // ------------------ Current Temperature ------------------
        let currentTemp = 74.3;
        let tempX = 180; // adjust to right of icon
        let tempY = 155;

        // Draw rain icon
        const iconSize = 60; // scaled size
        ctx.drawImage(rainIcon, 150 * scaleX, tempY * scaleY, iconSize * scaleX, iconSize * scaleY);

        drawTextScaled(currentTemp.toFixed(1) + '°', tempX, tempY, 50, getTempColor(currentTemp));

        // ------------------ Dew Point ------------------
        let dewPointTemp = 65;
        let dewX = 55;
        let dewY = 243 - 2; // nudged slightly up

        drawTextScaled(dewPointTemp + '°', dewX, dewY, 26, getTempColor(dewPointTemp));

        // ------------------ Humidity ------------------
        let humidity = 57;
        let humX = 157;
        let humY = 243 - 2; // nudged up

        drawTextScaled(humidity + '%', humX, humY, 26, '#FFFFFF');

        // ------------------ Pressure ------------------
        let pressure = 28.97;
        let pressX = 252;
        let pressY = 243 - 2; // nudged up

        drawTextScaled(pressure.toFixed(2), pressX, pressY, 26, '#FFFFFF');

        // ------------------ Next Three Days ------------------
        const nextThreeDays = [
            { high: 70, low: 44, x: 600, y: 380 },
            { high: 62, low: 45, x: 830, y: 380 },
            { high: 68, low: 50, x: 1060, y: 380 }
        ];

        nextThreeDays.forEach(day => {
            drawTextScaled(day.high + '°', day.x, day.y, 32, getTempColor(day.high));
            drawTextScaled(day.low + '°', day.x + 70, day.y, 32, getTempColor(day.low));
        });

        // ------------------ Indoor Weather ------------------
        const indoorTemp = 67;
        const indoorDew = 55;

        drawTextScaled(indoorTemp + '°', 280, 1280, 32, getTempColor(indoorTemp));
        drawTextScaled('57% Humidity', 280, 1320, 32, '#FFFFFF');
        drawTextScaled(indoorDew + '°', 280, 1350, 32, getTempColor(indoorDew));

        // ------------------ Lightning ------------------
        drawTextScaled('0 Strikes', 280, 780, 32, '#FFFFFF');

        // ------------------ Rainfall ------------------
        drawTextScaled('0.00 in', 600, 1050, 32, '#FFFFFF');

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
