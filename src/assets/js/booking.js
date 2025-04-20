import "@splidejs/splide/css/core";
import Splide from "@splidejs/splide";

const bookingDaysContainer = document.querySelector(".booking-days");

if (bookingDaysContainer) {

  bookingDaysContainer.addEventListener("click", function (event) {
    if (event.target && event.target.classList.contains("booking-day")) {
      const allBookingDays =
        bookingDaysContainer.querySelectorAll(".booking-day");
      allBookingDays.forEach((button) => button.classList.remove("active-day"));
      event.target.classList.add("active-day");
    }
  });
}

const bookingFilters = document.querySelector(".booking-filters");

bookingFilters.addEventListener("click", function (event) {
  if (event.target && event.target.classList.contains("booking-filter")) {
    const allFilterBtns = bookingFilters.querySelectorAll(".booking-filter");
    allFilterBtns.forEach((button) =>
      button.parentElement.classList.remove("active-booking-filter"),
    );
    event.target.parentElement.classList.add("active-booking-filter");
  }
});


if (document.querySelector(".splide")) {

  const bookingDays = new Splide(".splide", {
    direction: "rtl",
  
    autoWidth: true,
    arrows: false,
    perPage: 4,
  }).mount();
  
  document
    .querySelector(".external__splide__arrows .prev")
    .addEventListener("click", function () {
      bookingDays.go("<"); // Go to the previous slide
    });
  
  document
    .querySelector(".external__splide__arrows .next")
    .addEventListener("click", function () {
      bookingDays.go(">"); // Go to the next slide
    });
}

  const ticketBoxes = document.querySelectorAll(".ticket-box");

  ticketBoxes.forEach((tb) => {
    tb.addEventListener("click", (event) => {
      if (event.target && event.target.classList.contains("plan-toggle")) {
        const id = event.target.getAttribute("aria-controls");
        const group = event.target.getAttribute("data-group");
        const target = document.getElementById(id);
        const groupEls = tb.querySelectorAll(`[data-group='${group}']`);
  
        groupEls.forEach((el) => {
          if (el !== event.target) {
            el.classList.remove("plan-opened");
            const elTarget = el.getAttribute("aria-controls");
            document.getElementById(elTarget).parentElement.classList.add("hidden");
          }
        });
  
        event.target.classList.toggle("plan-opened");
        target.parentElement.classList.toggle("hidden");
  
        const anyOpen = tb.querySelectorAll(".plan-toggle").length > 0 &&
          Array.from(tb.querySelectorAll(".plan-toggle")).some((btn) => {
            const btnTargetId = btn.getAttribute("aria-controls");
            const btnTargetEl = document.getElementById(btnTargetId);
            return btnTargetEl && !btnTargetEl.parentElement.classList.contains("hidden");
          });
  
        if (anyOpen) {
          tb.classList.add("has-open");
        } else {
          tb.classList.remove("has-open");
        }
      }
    });
  });
  
const target = document.getElementById('outbound-variant');
const scrollingContainer = document.getElementById('scrolling-variant-container');
const buyTicket = document.getElementById("buy-ticket");
let triggered = false;

// Store original position for comparison
const originalPosition = target.getBoundingClientRect().top + window.scrollY;
const triggerOffset = 50; // Pixels to add as buffer

// Use ticking pattern to improve performance and stability
let ticking = false;
let lastKnownScrollPosition = 0;
let lastTriggeredState = false;

function updateSticky(scrollPos) {
  // Calculate if we should show sticky based on scroll position
  const shouldBeSticky = scrollPos > originalPosition + triggerOffset;
  
  // Only update DOM if state is changing
  if (shouldBeSticky !== triggered) {
    triggered = shouldBeSticky;
    
    if (triggered) {
      // Move to sticky container
      if (target.parentNode) {
        target.parentNode.removeChild(target);
      }
      scrollingContainer.appendChild(target);
      target.classList.add("scrolling-variant");
      scrollingContainer.classList.remove("hidden");
    } else {
      // Move back to original
      if (target.parentNode) {
        target.parentNode.removeChild(target);
      }
      buyTicket.appendChild(target);
      target.classList.remove("scrolling-variant");
      scrollingContainer.classList.add("hidden");
    }
    
    // Add a small delay before accepting new scroll events
    setTimeout(() => {
      ticking = false;
    }, 50);
  } else {
    ticking = false;
  }
}

window.addEventListener('scroll', () => {
  lastKnownScrollPosition = window.scrollY;
  
  if (!ticking) {
    ticking = true;
    
    // Use timeout instead of RAF for greater stability
    setTimeout(() => {
      updateSticky(lastKnownScrollPosition);
    }, 100);
  }
});

// Initial check
updateSticky(window.scrollY);