let watchID;
let previousPosition = null;
let totalDistance = 0;

function toMiles(meters) {
  return meters / 1609.34;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // radius of Earth in meters
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLon = (lon2 - lon1) * rad;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * rad) * Math.cos(lat2 * rad) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function updateDistance(position) {
  if (previousPosition) {
    const d = calculateDistance(
      previousPosition.coords.latitude,
      previousPosition.coords.longitude,
      position.coords.latitude,
      position.coords.longitude
    );
    totalDistance += d;
    document.getElementById('distance').innerText = toMiles(totalDistance).toFixed(2);
  }
  previousPosition = position;
}

function startTracking() {
  if ('geolocation' in navigator) {
    watchID = navigator.geolocation.watchPosition(updateDistance, console.error, {
      enableHighAccuracy: true,
      maximumAge: 1000,
      timeout: 5000
    });
  } else {
    alert('Geolocation is not supported by your browser.');
  }
}



document.body.addEventListener("dblclick", () => {
  currentMode = currentMode === "gradient-bg" ? "gradient-text" : "gradient-bg";
  applyMode();
});

function applyMode() {
    const body = document.body;
    const distance = document.getElementById("distance");
    const units = document.getElementById("units");
  
    const gradient = gradientPresets[currentGradient].colors.join(", ");
  
    if (currentMode === "gradient-bg") {
      body.className = "bg-gradient";
      body.style.setProperty("--gradient", `linear-gradient(270deg, ${gradient})`);
      distance.className = "white-text";
      units.className = "white-text";
    } else {
      body.className = "bg-white";
      body.style.setProperty("--gradient", `linear-gradient(270deg, ${gradient})`);
      distance.className = "gradient-text";
      units.className = "gradient-text";
    }
  }
  
const gradientPresets = [
    // Light gradients for background mode
    {
      name: "coralSunrise",
      colors: ["#ff9a9e", "#fad0c4", "#fbc2eb", "#a1c4fd"]
    },
    {
      name: "mintGlow",
      colors: ["#a1c4fd", "#c2e9fb", "#b2fefa", "#e0c3fc"]
    },
    {
      name: "sunsetSky",
      colors: ["#ffecd2", "#fcb69f", "#f6d365", "#fda085"]
    },
    {
      name: "softPeach",
      colors: ["#f6d365", "#fda085", "#fbc2eb", "#a1c4fd"]
    },
    {
      name: "roseQuartz",
      colors: ["#fbc2eb", "#a6c1ee", "#fad0c4", "#ffdde1"]
    }
  ];
  
  let currentMode = "gradient-bg"; // or 'gradient-text'
  let currentGradient = 0;

  let clickTimeout;

document.body.addEventListener("click", () => {
  if (clickTimeout) return;

  clickTimeout = setTimeout(() => {
    currentGradient = (currentGradient + 1) % gradientPresets.length;
    applyMode();
    clickTimeout = null;
  }, 250); // Wait 250ms to see if it becomes a double-click
});

document.body.addEventListener("dblclick", () => {
  clearTimeout(clickTimeout); // cancel single click if double clicked
  clickTimeout = null;
  currentMode = currentMode === "gradient-bg" ? "gradient-text" : "gradient-bg";
  applyMode();
});

  
  
applyMode(); // initial apply


startTracking();


