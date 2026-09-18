const days = ["Monday","Tuesday","Wednesday","Thursday","Friday"];
const form = document.getElementById("standForm");
const money = cents => new Intl.NumberFormat("en-ZA",{style:"currency",currency:"ZAR"}).format(cents/100);
let temperatures = [];
function generateWeather() {
  temperatures = days.map(() => 18 + Math.floor(Math.random()*17));
  const weather = document.getElementById("weather"); weather.replaceChildren();
  days.forEach((day,index) => {
    const card = document.createElement("div");
    const title = document.createElement("strong"); title.textContent = day;
    const temp = document.createElement("b"); temp.textContent = temperatures[index] + "°C";
    const tag = document.createElement("span"); tag.textContent = "Simulated";
    card.append(title,temp,tag); weather.append(card);
  });
  document.getElementById("results").hidden = true;
}
function simulateWeek(inventory, priceCents, costCents, weather) {
  let stock = inventory;
  const rows = weather.map((temp,index) => {
    const demand = Math.floor(temp*1000/priceCents);
    const sold = Math.min(stock,demand); stock -= sold;
    return {day:days[index],demand,sold,stock,revenue:sold*priceCents};
  });
  const sold = inventory-stock;
  const revenue = sold*priceCents;
  const expenses = inventory*costCents;
  return {rows,sold,stock,revenue,expenses,profit:revenue-expenses};
}
form.addEventListener("submit", event => {
  event.preventDefault(); if (!form.reportValidity()) return;
  const inventory = Number(document.getElementById("inventory").value);
  const price = Number(document.getElementById("price").value);
  const cost = Number(document.getElementById("cost").value);
  if (!Number.isInteger(inventory) || inventory<0 || inventory>10000 || !Number.isFinite(price) || price<.01 || price>1000 || !Number.isFinite(cost) || cost<0 || cost>1000) {
    document.getElementById("status").textContent = "Enter valid non-negative stock and cost, and a positive selling price."; return;
  }
  const result = simulateWeek(inventory,Math.round(price*100),Math.round(cost*100),temperatures);
  ["sold","revenue","expenses","profit"].forEach(key => document.getElementById(key).textContent = key==="sold" ? result[key] : money(result[key]));
  document.getElementById("profit").classList.toggle("loss",result.profit<0);
  document.getElementById("summary").textContent = result.stock + " glasses left. " + (result.profit<0 ? "This week made a loss." : result.profit===0 ? "This week broke even." : "This week made a profit.");
  const sales = document.getElementById("sales"); sales.replaceChildren();
  result.rows.forEach(item => {
    const row = document.createElement("tr");
    [item.day,item.demand,item.sold,item.stock,money(item.revenue)].forEach(value => {
      const cell = document.createElement("td"); cell.textContent = value; row.append(cell);
    }); sales.append(row);
  });
  document.getElementById("results").hidden = false;
  document.getElementById("status").textContent = "Week calculated. " + result.sold + " glasses sold.";
});
document.getElementById("newWeather").addEventListener("click", () => {
  generateWeather(); document.getElementById("status").textContent = "New simulated weather generated. Run the week again.";
});
document.getElementById("reset").addEventListener("click", () => {
  HTMLFormElement.prototype.reset.call(form); document.getElementById("results").hidden = true; document.getElementById("sales").replaceChildren();
  document.getElementById("status").textContent = "Stand reset. Weather kept for comparison.";
});
generateWeather();
