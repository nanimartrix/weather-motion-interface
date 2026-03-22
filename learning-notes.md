# Weather Motion Interface – Learning Notes

## Animation System

### animate()

The `animate()` function is the mai​n rendering loop.

It:

- clears the canvas
- redraws the background
- updates particle positions
- draws particles again

It runs continuously to create motion.

---

### requestAnimationFrame

`requestAnimationFrame(animate)` tells the browser:

→ run `animate()` again on the next frame

This creates a smooth animation loop.

---

### animationId

Stores the reference to the running animation.

Used to:

- check if animation is already running
- prevent multiple animation loops

---

### applyWeatherVisuals(data)

This function connects API data to the visual system.

It:

- updates the weatherVisualState
- updates background colors
- resizes canvas
- recreates particles
- starts animation if not already running

Important:
It does NOT restart everything — it updates the current state.

---

## Visual Mapping

### Temperature → Color

- cold → blue tones
- mild → neutral / soft tones
- warm → orange / warm tones

---

### Wind → Movement

- low wind → slow drift
- higher wind → stronger horizontal movement

---

### Day / Night → Light

- day → brighter gradients
- night → darker, more contrast

---

## Data Flow

1. User enters a city
2. Geocoding API returns coordinates
3. Weather API returns current data
4. renderWeather() updates UI
5. applyWeatherVisuals() updates visual system
6. animate() continuously renders frames

---

## Notes

- Animation runs independently once started
- Visual state changes when new weather data is applied
- Canvas rendering is frame-based, not event-based
