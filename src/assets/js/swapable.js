 const isDifferPage = document.body.dataset.page === "differ-ticket";

document.addEventListener("click", (e) => {
  const swapButton = e.target.closest(".input-swap");
  if (!swapButton) return;

  const swap = swapButton.closest(".swapable");
  if (!swap) return;

  const boxes = swap.querySelectorAll(".swap-box");
  if (boxes.length < 2) return; // Ensure there are at least two boxes to swap

  const parent = boxes[0].parentNode;
  const firstBox = boxes[0];
  const secondBox = boxes[1];
  const inputSwap = parent.querySelector(".input-swap");

  if (isDifferPage) {
    if (inputSwap.parentElement.nextElementSibling === secondBox) {
      const reference = inputSwap.parentElement;
      parent.insertBefore(secondBox, reference);
      parent.insertBefore(firstBox, reference.nextElementSibling);
    } else {
      parent.insertBefore(firstBox, secondBox);
    }
  } else {
    if (firstBox.nextElementSibling === secondBox) {
      parent.insertBefore(secondBox, firstBox);
    } else {
      parent.insertBefore(firstBox, secondBox);
    }
  }
});

const initializeSwapables = () => {
  document.querySelectorAll(".swapable").forEach((swap) => {
    if (!swap.hasAttribute("data-initialized")) {
      swap.setAttribute("data-initialized", "true");
    }
  });
};

initializeSwapables();
