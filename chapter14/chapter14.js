document.getElementById("placeOrder").addEventListener("click", placeOrder);
const rand = value => "R" + value.toFixed(2);
function placeOrder() {
  const quantity = Number(document.getElementById("numPizzas").value);
  const output = document.getElementById("displayTotal");
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
    output.textContent = "Enter a whole number of pizzas between 1 and 100.";
    return;
  }
  const cost = calculatePrice(quantity, document.getElementById("typePizza").value);
  const delivery = calculateDelivery(cost, document.getElementById("deliveryCity").value, document.getElementById("birthday").value);
  output.replaceChildren();
  for (const text of ["Pizza subtotal: " + rand(cost), delivery === 0 ? "You get free delivery!" : "Delivery: " + rand(delivery), "Total: " + rand(cost + delivery)]) {
    const line = document.createElement("p");
    line.textContent = text;
    output.append(line);
  }
}
function calculatePrice(quantity, type) {
  return Number(quantity) * (type === "supreme" ? 100 : 80);
}
function calculateDelivery(cost, city, birthday) {
  return birthday === "yes" || (city === "Johannesburg" && cost > 150) ? 0 : 30;
}
