const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
const frame = document.getElementById("demo-frame");
let observer;
function selectTab(tab, focus = false) {
  for (const button of tabs) {
    const selected = button === tab;
    button.setAttribute("aria-selected", String(selected));
    button.tabIndex = selected ? 0 : -1;
  }
  if (observer) observer.disconnect();
  document.getElementById("demo-panel").setAttribute("aria-labelledby", tab.id);
  document.getElementById("standalone").href = tab.dataset.src;
  document.getElementById("source").href = tab.dataset.source;
  frame.title = tab.textContent;
  frame.style.height = "1100px";
  frame.src = tab.dataset.src;
  history.replaceState(null, "", "#" + tab.id.replace("tab-", ""));
  if (focus) tab.focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectTab(tab));
  tab.addEventListener("keydown", event => {
    let target;
    if (event.key === "ArrowRight") target = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft") target = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") target = 0;
    if (event.key === "End") target = tabs.length - 1;
    if (target !== undefined) { event.preventDefault(); selectTab(tabs[target], true); }
  });
});
frame.addEventListener("load", () => {
  try {
    const doc = frame.contentDocument;
    // Use the content wrapper rather than the viewport height to avoid resize loops.
    const content = doc.querySelector("main") || doc.body;
    const back = doc.querySelector('a[href="../index.html"]');
    if (back) back.hidden = true;
    const resize = () => {
      const styles = frame.contentWindow.getComputedStyle(content);
      frame.style.height = Math.ceil(content.getBoundingClientRect().height + (parseFloat(styles.marginTop) || 0) + (parseFloat(styles.marginBottom) || 0) + 32) + "px";
    };
    observer = new ResizeObserver(resize);
    observer.observe(content);
    resize();
  } catch (_) { /* Direct file previews can restrict iframe access; standalone links remain available. */ }
});
const initial = tabs.find(tab => tab.id === "tab-" + location.hash.slice(1));
if (initial && initial !== tabs[0]) selectTab(initial);

