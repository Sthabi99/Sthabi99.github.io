const originalNames = ["Kareem", "Fatma", "Sumaya", "Mr. Hobson", "Ms. Young", "Mrs. O' Doherty"];
let people = [...originalNames];
const list = document.getElementById("peopleIKnow");
const input = document.getElementById("nameInput");
const status = document.getElementById("status");
function renderNames(message = "") {
  list.replaceChildren();
  people.forEach((name, index) => {
    const item = document.createElement("li");
    const label = document.createElement("span");
    label.textContent = name;
    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "Remove";
    remove.setAttribute("aria-label", "Remove " + name);
    remove.addEventListener("click", () => {
      people.splice(index, 1);
      renderNames(name + " removed.");
      const nextButton = list.children[Math.min(index, people.length - 1)]?.querySelector("button");
      (nextButton || input).focus();
    });
    item.append(label, remove);
    list.append(item);
  });
  document.getElementById("count").textContent = people.length;
  document.getElementById("empty").hidden = people.length !== 0;
  ["sortAsc", "sortDesc", "reverse"].forEach(id => document.getElementById(id).disabled = people.length < 2);
  status.textContent = message;
}
document.getElementById("nameForm").addEventListener("submit", event => {
  event.preventDefault();
  const name = input.value.trim().replace(/\s+/g, " ");
  if (!name || name.length > 80) {
    status.textContent = "Enter a name between 1 and 80 characters.";
    input.focus();
    return;
  }
  if (people.some(person => person.toLocaleLowerCase() === name.toLocaleLowerCase())) {
    status.textContent = "That name is already in the list.";
    input.focus();
    return;
  }
  people.push(name);
  renderNames(name + " added.");
  input.value = "";
  input.focus();
});
const compareNames = (a, b) => a.localeCompare(b, "en", {sensitivity: "base"});
document.getElementById("sortAsc").addEventListener("click", () => {
  people.sort(compareNames); renderNames("Sorted A-Z.");
});
document.getElementById("sortDesc").addEventListener("click", () => {
  people.sort((a, b) => compareNames(b, a)); renderNames("Sorted Z-A.");
});
document.getElementById("reverse").addEventListener("click", () => {
  people.reverse(); renderNames("List order reversed.");
});
document.getElementById("reset").addEventListener("click", () => {
  people = [...originalNames]; renderNames("Example names restored.");
});
renderNames();
