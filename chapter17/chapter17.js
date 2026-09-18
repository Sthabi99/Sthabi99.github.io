const citySelect = document.getElementById("city");
const grid = document.getElementById("5DayWeather");
const conditions = ["Sunny", "Partly cloudy", "Cloudy", "Rain showers", "Thunderstorms"];
let forecast = [];
let unit = "C";
let generation = 0;

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function icon(condition) {
  // These SVG paths are fixed application content, never user input.
  const sun = '<circle cx="24" cy="24" r="9" fill="#ffc857" stroke="none"/><path d="M24 3v6m0 30v6M3 24h6m30 0h6M9 9l4 4m22 22 4 4M9 39l4-4m22-22 4-4"/>';
  const cloud = '<path d="M12 34a8 8 0 0 1-1-16 12 12 0 0 1 23 0 8 8 0 0 1 1 16Z"/>';
  let shape = cloud;
  if (condition === "Sunny") shape = sun;
  if (condition === "Partly cloudy") shape = '<circle cx="14" cy="13" r="8" fill="#ffc857" stroke="none"/>' + cloud;
  if (condition === "Rain showers") shape = cloud + '<path d="m15 39-2 5m12-5-2 5m12-5-2 5"/>';
  if (condition === "Thunderstorms") shape = cloud + '<path d="m25 31-7 9h7l-5 7" stroke="#d08a00"/>';
  return '<svg class="weather-icon" viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' + shape + '</svg>';
}

function temperature(value) {
  return Math.round(unit === "C" ? value : value * 9 / 5 + 32) + "°" + unit;
}

function generateForecast() {
  // All cities use the same illustrative ranges: this is not a climate model.
  const start = new Date();
  start.setHours(12, 0, 0, 0);
  forecast = Array.from({length: 5}, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const condition = conditions[randomInt(0, conditions.length - 1)];
    const high = randomInt(17, 32);
    const rain = condition === "Sunny" ? randomInt(0, 10)
      : condition === "Rain showers" || condition === "Thunderstorms" ? randomInt(60, 95)
      : randomInt(10, 45);
    return {date, condition, high, low: high - randomInt(5, 12), rain, wind: randomInt(3, 30)};
  });
  generation += 1;
  renderForecast();
  announce("New simulated outlook generated");
}

function announce(action) {
  document.getElementById("status").textContent = action + " for " + citySelect.selectedOptions[0].textContent + ". Scenario " + generation + ", temperatures in °" + unit + ".";
}

function renderForecast() {
  grid.replaceChildren();
  const city = citySelect.selectedOptions[0].textContent;
  document.getElementById("forecastTitle").textContent = city;
  const dateFormat = {day: "numeric", month: "short"};
  document.getElementById("dateRange").textContent = forecast[0].date.toLocaleDateString("en-ZA", dateFormat) + " - " + forecast[4].date.toLocaleDateString("en-ZA", dateFormat);
  forecast.forEach((day, index) => {
    const card = document.createElement("article");
    card.className = "day";
    const title = index === 0 ? "Today" : day.date.toLocaleDateString("en-ZA", {weekday: "long"});
    // Data below is generated internally from numbers and fixed condition names.
    card.innerHTML = '<h3>' + title + '</h3><p class="date">' + day.date.toLocaleDateString("en-ZA", dateFormat)
      + '</p>' + icon(day.condition) + '<p class="condition">' + day.condition
      + '</p><div class="temperatures"><span class="high" aria-label="High ' + temperature(day.high) + '">' + temperature(day.high)
      + '</span><span class="low" aria-label="Low ' + temperature(day.low) + '">' + temperature(day.low)
      + '</span></div><div class="metrics"><p><span>Rain chance</span><strong>' + day.rain
      + '%</strong></p><p><span>Wind</span><strong>' + day.wind + ' km/h</strong></p></div>';
    grid.append(card);
  });
}

citySelect.addEventListener("change", generateForecast);
document.getElementById("refresh").addEventListener("click", generateForecast);
document.querySelectorAll('input[name="unit"]').forEach(input => {
  input.addEventListener("change", () => {
    unit = input.value;
    renderForecast();
    announce("Temperature display updated");
  });
});
generateForecast();
