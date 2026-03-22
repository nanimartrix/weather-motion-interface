const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const locationNameEl = document.getElementById("locationName");
const temperatureEl = document.getElementById("temperature");
const conditionTextEl = document.getElementById("conditionText");
const windEl = document.getElementById("wind");
const humidityEl = document.getElementById("humidity");
const dayStateEl = document.getElementById("dayState");
const statusTextEl = document.getElementById("statusText");

function setStatus(message) {
  statusTextEl.textContent = message;
}

function weatherCodeToText(code) {
  if (code === 0) return "Klar";
  if ([1, 2, 3].includes(code)) return "Bewölkt";
  if ([45, 48].includes(code)) return "Neblig";
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return "Regen";
  if ([71, 73, 75, 85, 86].includes(code)) return "Schnee";
  if ([95, 96, 99].includes(code)) return "Gewitter";
  return "Unbekannt";
}

async function fetchLocation(city) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=de&format=json`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Ortssuche fehlgeschlagen.");
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error("Kein passender Ort gefunden.");
  }

  return data.results[0];
}

async function fetchWeather(latitude, longitude) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,is_day&timezone=auto`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Wetterdaten konnten nicht geladen werden.");
  }

  const data = await response.json();

  if (!data.current) {
    throw new Error("Keine aktuellen Wetterdaten verfügbar.");
  }

  return data.current;
}

function renderWeather(location, current) {
  const fullLocation = [location.name, location.country]
    .filter(Boolean)
    .join(", ");

  locationNameEl.textContent = fullLocation;
  temperatureEl.textContent = `${Math.round(current.temperature_2m)}°C`;
  conditionTextEl.textContent = weatherCodeToText(current.weather_code);
  windEl.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
  humidityEl.textContent = `${current.relative_humidity_2m}%`;
  dayStateEl.textContent = current.is_day ? "Tag" : "Nacht";

  // Pass selected weather values to the visual layer
  window.applyWeatherVisuals({
    temperature: current.temperature_2m,
    wind: current.wind_speed_10m,
    isDay: current.is_day,
  });
}

async function handleSearch() {
  const city = cityInput.value.trim();

  if (!city) {
    setStatus("Bitte gib einen Ort ein.");
    return;
  }

  setStatus("Lade Wetterdaten …");
  searchBtn.disabled = true;

  try {
    // Reslove city name to coordinates
    const location = await fetchLocation(city);

    // Load current weather for those coordinates
    const current = await fetchWeather(location.latitude, location.longitude);

    renderWeather(location, current);
    setStatus("Wetterdaten geladen.");
  } catch (error) {
    setStatus(error.message);
  } finally {
    searchBtn.disabled = false;
  }
}

searchBtn.addEventListener("click", handleSearch);

cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleSearch();
  }
});

// Default locationm on first load
cityInput.value = "Börgerende";
handleSearch();
