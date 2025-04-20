document.addEventListener("DOMContentLoaded", function () {
    const yearInput = document.getElementById("year");
    const monthInput = document.getElementById("month");
    const dayInput = document.getElementById("day");

    yearInput.addEventListener("input", function () {
      if (this.value.length === 4) {
        yearInput.blur();
      }
    });

    monthInput.addEventListener("input", function () {
      if (this.value.length === 2) {
        yearInput.focus();
      }
    });

    dayInput.addEventListener("input", function () {
      if (this.value.length === 2) {
        monthInput.focus(); // Optional: Remove focus after completing the date
      }
    });
  });