const filters = document.getElementById("project-filters");
const cards = [...document.querySelectorAll(".project-card")];
filters.hidden = false;
filters.addEventListener("click", event => {
  const button = event.target.closest("button[data-filter]");
  if (!button) return;
  const category = button.dataset.filter;
  filters.querySelectorAll("button").forEach(item => item.setAttribute("aria-pressed", String(item === button)));
  cards.forEach(card => { card.hidden = category !== "all" && card.dataset.category !== category; });
  const count = cards.filter(card => !card.hidden).length;
  document.getElementById("filter-status").textContent = count + " " + (count === 1 ? "project" : "projects") + " shown.";
});
document.getElementById("year").textContent = new Date().getFullYear();
