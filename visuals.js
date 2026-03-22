const canvas = document.getElementById("weatherCanvas");
const ctx = canvas.getContext("2d");

const weatherVisualState = {
  temperature: 12,
  wind: 8,
  isDay: 1,
};

const particles = [];
let animationId = null;

function getDpr() {
  return Math.min(window.devicePixelRatio || 1, 2);
}

function resizeCanvas() {
  const ratio = getDpr();
  const rect = canvas.getBoundingClientRect();

  canvas.width = Math.floor(rect.width * ratio);
  canvas.height = Math.floor(rect.height * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

window.addEventListener("resize", resizeCanvas);

function mapTemperatureToColors(temp, isDay) {
  // Map temparature + day / night to background colors
  if (temp < 5) {
    return isDay ? ["#1f355c", "#718ec9"] : ["#101726", "#2c4472"];
  }

  if (temp < 18) {
    return isDay ? ["#3d4a73", "#8797c8"] : ["#1d2340", "#4b5d90"];
  }

  return isDay ? ["#6b445c", "#f0a16a"] : ["#2b1d33", "#7a4860"];
}

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function createParticles() {
  // Reset particles for the current weather state
  particles.length = 0;

  const count = 80;

  for (let i = 0; i < count; i++) {
    particles.push({
      x: random(0, canvas.clientWidth),
      y: random(0, canvas.clientHeight),
      size: random(1, 3.5),
      alpha: random(0.08, 0.35),
      driftX: random(-0.3, 0.3),
      driftY: random(-0.15, 0.15),
    });
  }
}

function applyWeatherVisuals(data) {
  // Update visual state from API data
  weatherVisualState.temperature = data.temperature;
  weatherVisualState.wind = data.wind;
  weatherVisualState.isDay = data.isDay;

  const [bg1, bg2] = mapTemperatureToColors(data.temperature, data.isDay);
  document.documentElement.style.setProperty("--bg-1", bg1);
  document.documentElement.style.setProperty("--bg-2", bg2);

  resizeCanvas();
  createParticles();

  // Start animation only once
  if (!animationId) {
    animate();
  }
}

function animate() {
  // Draw current frame based on weather state
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  ctx.clearRect(0, 0, width, height);

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  const [bg1, bg2] = mapTemperatureToColors(
    weatherVisualState.temperature,
    weatherVisualState.isDay,
  );

  gradient.addColorStop(0, bg1);
  gradient.addColorStop(1, bg2);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  const windFactor = Math.max(0.15, weatherVisualState.wind / 30);

  for (const p of particles) {
    p.x += (p.driftX + windFactor) * 0.35;
    p.y += p.driftY * 0.25;

    if (p.x > width + 10) p.x = -10;
    if (p.y > height + 10) p.y = -10;
    if (p.y < -10) p.y = height + 10;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
    ctx.fill();
  }

  animationId = requestAnimationFrame(animate); // Schedule next frame
}

resizeCanvas();
createParticles();
animate();

window.applyWeatherVisuals = applyWeatherVisuals;
