const templates = {
  space: {title:"A Trip to Space",hint:"Pack your imagination for a very unusual space mission.",
    build:w => w.name + " boarded a " + w.adjective + " spaceship bound for " + w.place + ". The captain was a " + w.animal + " who insisted that everyone should " + w.verb + " before take-off. With a trusty " + w.object + " in hand, " + w.name + " declared the mission a complete success."},
  picnic: {title:"The Unexpected Picnic",hint:"A peaceful picnic is about to take a surprising turn.",
    build:w => w.name + " planned a " + w.adjective + " picnic in " + w.place + ". Just as the food arrived, a " + w.animal + " appeared carrying a " + w.object + ". The only way to save lunch was to " + w.verb + ". Nobody forgot that picnic!"},
  robot: {title:"The Robot's First Day",hint:"Help a new robot settle into its very first job.",
    build:w => "On its first day in " + w.place + ", a " + w.adjective + " robot met " + w.name + ". Its instructions were simple: protect the " + w.object + " and learn to " + w.verb + ". Unfortunately, a " + w.animal + " had other plans. By sunset, the robot had made a new friend and quite a mess."}
};
const keys = ["name","adjective","place","animal","verb","object"];
const form = document.getElementById("storyForm");
const template = document.getElementById("template");
function clearStory(message="") {
  document.getElementById("result").hidden = true;
  document.getElementById("story").textContent = "";
  document.getElementById("status").textContent = message;
}
function updateTemplate() {
  document.getElementById("hint").textContent = templates[template.value].hint;
  clearStory("Story selected. Fill in the words to begin.");
}
form.addEventListener("submit", event => {
  event.preventDefault(); if (!form.reportValidity()) return;
  const words = {};
  for (const key of keys) {
    const value = document.getElementById(key).value.trim();
    if (!value || value.length>60) {
      clearStory("Please enter 1-60 characters in every word field.");
      document.getElementById(key).focus(); return;
    }
    words[key] = value;
  }
  const selected = templates[template.value];
  document.getElementById("storyTitle").textContent = selected.title;
  document.getElementById("story").textContent = selected.build(words);
  document.getElementById("result").hidden = false;
  document.getElementById("status").textContent = "Your story is ready.";
});
template.addEventListener("change",updateTemplate);
document.getElementById("example").addEventListener("click", () => {
  const example = ["Thabiso","sparkly","Cape Town","penguin","dance","umbrella"];
  keys.forEach((key,i) => document.getElementById(key).value = example[i]);
  clearStory("Example words filled. Select Create story.");
});
document.getElementById("reset").addEventListener("click", () => {
  HTMLFormElement.prototype.reset.call(form); updateTemplate(); document.getElementById("status").textContent = "Ready for a new story.";
});
updateTemplate();
