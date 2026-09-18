const defaultCar = {make: "Oldsmobile", model: "98", color: "#a52a2a", year: 1983, bodyStyle: "Luxury Car", price: 4500};
let dreamCar = {...defaultCar};
const form = document.getElementById("carForm");
const status = document.getElementById("status");
const maxYear = new Date().getFullYear() + 1;
document.getElementById("year").max = maxYear;
function renderCar() {
  document.getElementById("carTitle").textContent = dreamCar.make + " " + dreamCar.model;
  document.getElementById("modelyear").textContent = dreamCar.year;
  document.getElementById("styleLabel").textContent = dreamCar.bodyStyle;
  document.getElementById("pricetag").textContent = new Intl.NumberFormat("en-ZA", {style: "currency", currency: "ZAR"}).format(dreamCar.price);
  document.getElementById("body").style.backgroundColor = dreamCar.color;
  document.getElementById("car").setAttribute("aria-label", dreamCar.make + " " + dreamCar.model + " car illustration");
  document.getElementById("objectPreview").textContent = JSON.stringify(dreamCar, null, 2);
}
function resetCar() {
  dreamCar = {...defaultCar};
  Object.entries(dreamCar).forEach(([key, value]) => document.getElementById(key).value = value);
  renderCar();
}
form.addEventListener("submit", event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const make = document.getElementById("make").value.trim();
  const model = document.getElementById("model").value.trim();
  const year = Number(document.getElementById("year").value);
  const price = Number(document.getElementById("price").value);
  if (!make || !model || make.length > 40 || model.length > 40 || !Number.isInteger(year) || year < 1886 || year > maxYear || !Number.isFinite(price) || price < 0 || price > 1000000000) {
    status.textContent = "Enter valid car details. Make and model cannot be blank.";
    return;
  }
  dreamCar = {make, model, year, price, color: document.getElementById("color").value, bodyStyle: document.getElementById("bodyStyle").value};
  renderCar();
  status.textContent = "Car updated.";
});
document.getElementById("reset").addEventListener("click", () => {
  resetCar(); status.textContent = "Example car restored.";
});
resetCar();
