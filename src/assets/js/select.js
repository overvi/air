class CustomSelect {
  constructor(containerElement, onSelect = () => {}) {
    this.container = containerElement;
    this.selectTrigger = this.container.querySelector(".select-trigger");
    this.optionsList = this.container.querySelector(".options-list");
    this.selectedValueSpan = this.container.querySelector(".selected-value");
    this.options = this.container.querySelectorAll(".option");
    this.onSelect = onSelect;
    this.hiddenSelect = this.container.querySelector(".hidden-select");
    this.maxLetters = 20;

    // Mark the select element with a unique data attribute
    this.container.setAttribute("data-custom-select", "true");

    this.init();
  }

  init() {
    this.setupTriggerListener();
    this.setupOptionsListeners();
  }

  setupTriggerListener() {
    document.addEventListener("click", (event) => {
      document.querySelectorAll('[data-custom-select="true"]').forEach((select) => {
        const optionsList = select.querySelector(".options-list");
        const isClickInside = select.contains(event.target);

        if (!isClickInside) {
          optionsList.classList.add("hidden");
          select.classList.remove("open");
        }
      });
    });

    this.selectTrigger.addEventListener("click", () => {
      document.querySelectorAll(".options-list").forEach((list) => {
        if (list !== this.optionsList) {
          list.classList.add("hidden");
        }
      });

      // Toggle current dropdown
      this.optionsList.classList.toggle("hidden");
      this.container.classList.toggle("open");
    });
  }

  setTextContent(value) {
    return value.length > this.maxLetters ? value.slice(0, this.maxLetters) + "..." : value;
  }

  setupOptionsListeners() {
    this.options.forEach((option) => {
      option.addEventListener("click", (event) => {
        if (event.target.closest("label")) {
          this.options.forEach((opt) => opt.classList.remove("selected"));
          this.container.classList.remove("open");
          this.container.classList.add("filled");

          option.classList.add("selected");
          const selectedValue = option.getAttribute("data-value");

          this.hiddenSelect.value = selectedValue;
          this.selectedValueSpan.textContent = this.setTextContent(selectedValue);
          this.optionsList.classList.add("hidden");

          this.hiddenSelect.dispatchEvent(new Event("change", { bubbles: true }));
          this.onSelect(option);
        }
      });
    });
  }

  // Static method to initialize only selects without the data attribute
  static initializeAll(onSelectCallback = () => {}) {
    const instances = [];
    document.querySelectorAll(".slct:not([data-custom-select])").forEach((select) => {
      instances.push(new CustomSelect(select, onSelectCallback));
    });
    return instances;
  }
}

export default CustomSelect;
