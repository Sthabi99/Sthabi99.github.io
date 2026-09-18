const form = document.getElementById("lunchForm");
const money = cents => new Intl.NumberFormat("en-ZA", {style:"currency",currency:"ZAR"}).format(cents / 100);
function calculatePlan(budget, price, quantity, days) {
  let balance = budget;
  const purchases = [];
  const dailyCost = price * quantity;
  for (let day = 1; day <= days && balance >= dailyCost; day++) {
    balance -= dailyCost;
    purchases.push({day, quantity, cost:dailyCost, balance});
  }
  return {purchases, balance, spent:budget-balance};
}
form.addEventListener("submit", event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const budget = Number(document.getElementById("budget").value);
  const price = Number(document.getElementById("price").value);
  const quantity = Number(document.getElementById("quantity").value);
  const days = Number(document.getElementById("days").value);
  if (!Number.isFinite(budget) || budget < 0 || budget > 100000 || !Number.isFinite(price) || price < .01 || price > 10000 || !Number.isInteger(quantity) || quantity < 1 || quantity > 100 || !Number.isInteger(days) || days < 1 || days > 30) {
    document.getElementById("status").textContent = "Enter valid amounts, a positive whole quantity and 1-30 days."; return;
  }
  const result = calculatePlan(Math.round(budget*100), Math.round(price*100), quantity, days);
  document.getElementById("covered").textContent = result.purchases.length + " / " + days;
  document.getElementById("bought").textContent = result.purchases.length * quantity;
  document.getElementById("spent").textContent = money(result.spent);
  document.getElementById("remaining").textContent = money(result.balance);
  const receipt = document.getElementById("receipt"); receipt.replaceChildren();
  result.purchases.forEach(purchase => {
    const row = document.createElement("tr");
    [purchase.day, purchase.quantity, money(purchase.cost), money(purchase.balance)].forEach(value => {
      const cell = document.createElement("td"); cell.textContent = value; row.append(cell);
    }); receipt.append(row);
  });
  document.getElementById("summary").textContent = result.purchases.length === days
    ? "Your budget covers every planned day."
    : "Your budget covers " + result.purchases.length + " full days. You need " + money(Math.round(price*100)*quantity-result.balance) + " more for the next day's order.";
  document.getElementById("results").hidden = false;
  document.getElementById("status").textContent = "Plan calculated. " + result.purchases.length + " days covered.";
});
document.getElementById("reset").addEventListener("click", () => {
  HTMLFormElement.prototype.reset.call(form); document.getElementById("results").hidden = true;
  document.getElementById("receipt").replaceChildren();
  document.getElementById("status").textContent = "Example values restored.";
});
