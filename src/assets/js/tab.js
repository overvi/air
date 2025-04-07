const tabButtons = document.querySelectorAll("[role=tab]");
const tabPanels = document.querySelectorAll("[role=tabpanel]");

tabButtons.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    tabButtons.forEach((t) => t.classList.remove("active-tab"));
    tab.classList.add("active-tab");
    activateTab(index);
  });

  tab.addEventListener("keydown", (event) => {
    const key = event.key;
    if (
      key === "ArrowRight" ||
      key === "ArrowLeft" ||
      key === "Home" ||
      key === "End"
    ) {
      event.preventDefault();
      let newIndex;
      if (key === "ArrowRight") newIndex = (index + 1) % tabButtons.length;
      else if (key === "ArrowLeft")
        newIndex = (index - 1 + tabButtons.length) % tabButtons.length;
      else if (key === "Home") newIndex = 0;
      else if (key === "End") newIndex = tabButtons.length - 1;

      activateTab(newIndex);
      tabButtons[newIndex].focus();
    }
  });
});

function activateTab(index) {
  tabButtons.forEach((tab, i) => {
    const isActive = i === index;
    tab.setAttribute("aria-selected", isActive);
    tab.setAttribute("tabindex", isActive ? "0" : "-1");
    tab.classList.toggle("border-indigo-500", isActive);
    tabPanels[i].classList.toggle("hidden", !isActive);
  });
}
