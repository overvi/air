

class CustomSelect {
  constructor(containerElement, onSelect = () => {}) {
    this.container = containerElement;
    this.selectTrigger = this.container.querySelector(".select-trigger");
    this.optionsList = this.container.querySelector(".options-list");
    this.selectedValueSpan = this.container.querySelector(".selected-value");
    this.options = this.container.querySelectorAll(".option");
    this.onSelect = onSelect;
    this.selects = document.querySelectorAll(".slct");
    this.hiddenSelect = this.container.querySelector(".hidden-select");
    this.maxLetters = 20;
    this.init();
  }

  init() {
    this.setupTriggerListener();
    this.setupOptionsListeners();
  }

  setupTriggerListener() {
    document.addEventListener("click", (event) => {
      this.selects.forEach((select) => {
        const optionsList = select.querySelector(".options-list");
        const isClickInside = select.contains(event.target);

        if (!isClickInside) {
          optionsList.classList.add("hidden");
          select.classList.remove("open");
        }
      });
    });

    this.selectTrigger.addEventListener("click", (e) => {
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
    if (value.length > this.maxLetters) {
      return value.slice(0, this.maxLetters) + "...";
    }
    return value;
  }

  setupOptionsListeners() {
    this.options.forEach((option) => {
      option.addEventListener("click", (event) => {
        if (event.target.closest("label")) {
          // Remove previous selection in this select

          this.options.forEach((opt) => opt.classList.remove("selected"));
          this.container.classList.remove("open");
          this.container.classList.add("filled");

          // Mark current option as selected
          option.classList.add("selected");
          const selectedValue = option.getAttribute("data-value");

          this.hiddenSelect.value = selectedValue;

          const finalText = this.setTextContent(this.hiddenSelect.value);

          // Update trigger text
          this.selectedValueSpan.textContent = finalText;

          // Close dropdown
          this.optionsList.classList.add("hidden");

          this.hiddenSelect.dispatchEvent(
            new Event("change", { bubbles: true }),
          );

          this.onSelect(option);
        }
      });
    });
  }

  // Static method to initialize all custom selects
  static initializeAll(onSelectCallback) {
    const allSelects = document.querySelectorAll(".slct");
    return Array.from(allSelects).map(
      (select) => new CustomSelect(select, onSelectCallback),
    );
  }
}

export default CustomSelect;

