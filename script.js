async function updateLiveTempestCurrent() {
  try {
    const response = await fetch("http://localhost:3000/api/tempest/current");

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const live = await response.json();

    if (typeof live.tempF === "number") {
      data.current.temp = live.tempF;
      setText("current-temp", `${data.current.temp.toFixed(1)}°`);
      applyTempColor(document.getElementById("current-temp"), data.current.temp);
    }

    if (typeof live.dewF === "number") {
      data.current.dew = live.dewF;
      setText("current-dew", `${data.current.dew}°`);
      applyTempColor(document.getElementById("current-dew"), data.current.dew);
    }

    if (typeof live.humidity === "number") {
      data.current.humidity = live.humidity;
      setText("current-humidity", `${data.current.humidity}%`);
    }

    if (typeof live.pressureIn === "number" && typeof live.pressureMb === "number") {
      data.current.pressureIn = live.pressureIn;
      setText(
        "current-pressure",
        `${live.pressureIn.toFixed(2)}" / ${live.pressureMb} MB`
      );
    }
  } catch (error) {
    console.error("Failed to load live Tempest current data:", error);
  }
}
