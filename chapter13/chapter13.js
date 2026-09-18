const train = document.getElementById("train");
const track = document.getElementById("track");
const slider = document.getElementById("speed");
let trainSpeed = 120;
let trainPosition = 0;
let direction = 1;
let turnarounds = 0;
let running = false;
let animation = null;
let previousTime = null;
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

function travelLimit() { return Math.max(0, track.clientWidth - train.offsetWidth); }

function renderTrain() {
  train.style.transform = "translateX(" + trainPosition + "px)";
  train.classList.toggle("facing-left", direction < 0);
  const limit = travelLimit();
  document.getElementById("position").textContent = (limit ? Math.round(trainPosition / limit * 100) : 0) + "%";
  document.getElementById("direction").textContent = direction > 0 ? "Right" : "Left";
  document.getElementById("turns").textContent = turnarounds;
}

function announce(message) { document.getElementById("status").textContent = message; }

function moveTrain(distance) {
  const limit = travelLimit();
  if (limit === 0) { trainPosition = 0; renderTrain(); return; }
  let remaining = Math.max(0, distance);
  while (remaining > 0) {
    const available = direction > 0 ? limit - trainPosition : trainPosition;
    const movement = Math.min(remaining, available);
    trainPosition += direction * movement;
    remaining -= movement;
    if (movement === available) { direction *= -1; turnarounds++; }
  }
  renderTrain();
}

function frame(timestamp) {
  if (!running) return;
  if (previousTime !== null) {
    const seconds = Math.min((timestamp - previousTime) / 1000, 0.1);
    moveTrain(trainSpeed * seconds);
  }
  previousTime = timestamp;
  animation = requestAnimationFrame(frame);
}

function updateControls() {
  document.getElementById("start").disabled = running;
  document.getElementById("pause").disabled = !running;
  document.getElementById("step").disabled = running;
  document.getElementById("state").textContent = running ? "Running" : "Paused";
}

function startTrain() {
  if (running) return;
  running = true; previousTime = null;
  animation = requestAnimationFrame(frame);
  updateControls(); announce("Train started.");
}

function pauseTrain(message = "Train paused. Resume or step forward.") {
  running = false;
  if (animation !== null) cancelAnimationFrame(animation);
  animation = null; previousTime = null;
  updateControls(); announce(message);
}

function setSpeed(value) {
  trainSpeed = Math.max(30, Math.min(300, value));
  slider.value = trainSpeed;
  document.getElementById("speedValue").textContent = trainSpeed + " px/s";
  announce("Speed set to " + trainSpeed + " pixels per second.");
}

document.getElementById("start").addEventListener("click", startTrain);
document.getElementById("pause").addEventListener("click", () => pauseTrain());
document.getElementById("step").addEventListener("click", () => {
  if (running) return;
  moveTrain(20); announce("Advanced one 20-pixel step.");
});
document.getElementById("reverse").addEventListener("click", () => {
  direction *= -1; renderTrain(); announce("Direction changed to " + (direction > 0 ? "right." : "left."));
});
document.getElementById("reset").addEventListener("click", () => {
  pauseTrain(); trainPosition = 0; direction = 1; turnarounds = 0;
  setSpeed(120); renderTrain(); announce("Reset to the start. Train is paused.");
});
slider.addEventListener("input", () => setSpeed(Number(slider.value)));
train.addEventListener("click", () => setSpeed(trainSpeed + 30));
window.addEventListener("resize", () => {
  trainPosition = Math.min(trainPosition, travelLimit()); renderTrain();
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden && running) pauseTrain("Paused because this tab is hidden. Press Start to resume.");
});
motionPreference.addEventListener("change", event => {
  if (event.matches) pauseTrain("Reduced motion enabled. Use Step forward or choose Start to animate.");
});
renderTrain(); updateControls();
if (motionPreference.matches) announce("Reduced motion detected. Use Step forward, or choose Start to animate.");
