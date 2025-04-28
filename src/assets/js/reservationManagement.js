
import "./tab.js";
import "./dropdown.js";

const openBtn = document.getElementById("open-more");
const more = document.getElementById("more");
const dialogs = document.querySelectorAll("dialog");

openBtn.addEventListener("click", () => {
  more.classList.toggle("hidden");
  openBtn.parentElement.classList.toggle("rounded-[1.25rem]");
  openBtn.classList.toggle("opened");
});

const openModal = document.querySelectorAll(".open-modal");
const closeModal = document.querySelectorAll(".close-modal");

openModal.forEach((btn) => {
  btn.addEventListener("click", () => {
    const dialogId = btn.getAttribute("aria-controls");
    const dialog = document.getElementById(dialogId);

    dialog.showModal();
  });
});

closeModal.forEach((btn) => {
  btn.addEventListener("click", () => {
    const dialogId = btn.getAttribute("aria-controls");
    const dialog = document.getElementById(dialogId);
    dialog?.close();
  });
});

dialogs.forEach((d) => {
  d.addEventListener("click", (event) => {
    const rect = d.getBoundingClientRect();
    const isInDialog =
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width;

    if (!isInDialog) {
      d.close();
    }
  });
});



