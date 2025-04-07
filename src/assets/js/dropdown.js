document.addEventListener("click", (e) => {
    const input = e.target.closest(".dropdown-input");


    if (input) {
        const dropdownId = input.getAttribute("data-dropdown");
        const dropdown = document.getElementById(dropdownId);

        if (!dropdown) return;

        const items = dropdown.querySelectorAll(".dropdown-item");
        let selectedIndex = -1;

        function updateAriaExpanded(expanded) {
            input.setAttribute("aria-expanded", expanded);
            if (!expanded) {
                input.removeAttribute("aria-activedescendant");
            }
        }

        // Close all other dropdowns
        document.querySelectorAll(".dropdown-list").forEach((d) => {
            if (d !== dropdown) d.classList.add("hidden");
        });

        // Toggle dropdown
        const isOpen = !dropdown.classList.contains("hidden");
        dropdown.classList.toggle("hidden", isOpen);
        updateAriaExpanded(!isOpen);
    } else {
        const clickedInput = e.target.closest(".dropdown-input");
    const clickedDropdown = e.target.closest(".dropdown-list");

    // If clicked inside a dropdown or its input, do nothing
    if (clickedInput || clickedDropdown) {
        return;
    }

        // Close dropdowns when clicking outside
        document.querySelectorAll(".dropdown-list").forEach((d) => d.classList.add("hidden"));
        document.querySelectorAll(".dropdown-input").forEach((input) => input.setAttribute("aria-expanded", "false"));
    }
});

// Handle input filtering dynamically
document.addEventListener("input", (e) => {
    if (!e.target.classList.contains("dropdown-input")) return;

    const input = e.target;
    const dropdownId = input.getAttribute("data-dropdown");
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown) return;

    const items = dropdown.querySelectorAll(".dropdown-item");
    const filter = input.value.toLowerCase();
    let hasVisibleItems = false;
    let selectedIndex = -1;

    items.forEach((item, index) => {
        const text = item.textContent.toLowerCase();
        const isVisible = text.includes(filter);
        item.classList.toggle("hidden", !isVisible);
        if (isVisible && selectedIndex === -1) {
            selectedIndex = index;
            hasVisibleItems = true;
        }
    });

    input.setAttribute("aria-expanded", hasVisibleItems);
});

// Handle keyboard navigation
document.addEventListener("keydown", (e) => {
    const input = e.target.closest(".dropdown-input");
    if (!input) return;

    const dropdownId = input.getAttribute("data-dropdown");
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown) return;

    const items = Array.from(dropdown.querySelectorAll(".dropdown-item:not(.hidden)"));
    let selectedIndex = items.findIndex((item) => item.id === input.getAttribute("aria-activedescendant"));

    if (e.key === "ArrowDown") {
        selectedIndex = (selectedIndex + 1) % items.length;
    } else if (e.key === "ArrowUp") {
        selectedIndex = (selectedIndex - 1 + items.length) % items.length;
    } else if (e.key === "Enter" && selectedIndex >= 0) {
        input.value = items[selectedIndex].textContent;
        dropdown.classList.add("hidden");
        input.setAttribute("aria-expanded", "false");
    } else if (e.key === "Escape") {
        dropdown.classList.add("hidden");
        input.setAttribute("aria-expanded", "false");
    }

    if (selectedIndex >= 0 && selectedIndex < items.length) {
        input.setAttribute("aria-activedescendant", items[selectedIndex].id);
        items[selectedIndex].scrollIntoView({ block: "nearest" });
    }
});

// Observe newly added dropdown elements
const observeNewDropdowns = () => {
    document.querySelectorAll(".dropdown-input").forEach((input) => {

        if (!input.hasAttribute("data-initialized")) {
            input.setAttribute("data-initialized", "true");
            // Initialize dropdown functionality
        }
    });
};

// MutationObserver to track new dropdown elements
const observer = new MutationObserver(() => observeNewDropdowns());
observer.observe(document.body, { childList: true, subtree: true });

// Initialize existing elements
observeNewDropdowns();
