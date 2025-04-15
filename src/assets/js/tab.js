const allTabButtons = document.querySelectorAll("[role=tab]");

allTabButtons.forEach((tab) => {
  const groupName = tab.getAttribute("data-tab-group");
  const tabButtons = document.querySelectorAll(
    `[role=tab][data-tab-group="${groupName}"]`,
  );
  const tabPanels = document.querySelectorAll(
    `[role=tabpanel][data-tab-group="${groupName}"]`,
  );

  tab.addEventListener("click", () => {
    tabButtons.forEach((t) => t.classList.remove("active-tab"));
    tab.classList.add("active-tab");
    const index = Array.from(tabButtons).indexOf(tab);
    activateTab(index, tabButtons, tabPanels);
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
      const currentIndex = Array.from(tabButtons).indexOf(tab);
      let newIndex;
      if (key === "ArrowRight")
        newIndex = (currentIndex + 1) % tabButtons.length;
      else if (key === "ArrowLeft")
        newIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length;
      else if (key === "Home") newIndex = 0;
      else if (key === "End") newIndex = tabButtons.length - 1;

      activateTab(newIndex, tabButtons, tabPanels);
      tabButtons[newIndex].focus();
    }
  });
});

function activateTab(index, tabButtons, tabPanels) {
  tabButtons.forEach((tab, i) => {
    const isActive = i === index;
    tab.setAttribute("aria-selected", isActive);
    tab.setAttribute("tabindex", isActive ? "0" : "-1");
    tab.classList.toggle("border-indigo-500", isActive);
    tab.classList.toggle("active-tab", isActive);
  });

  tabPanels.forEach((panel, i) => {
    panel.classList.toggle("hidden", i !== index);
  });
}
