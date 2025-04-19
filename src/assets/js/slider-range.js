document.querySelectorAll(".range-container").forEach(initRangeSlider);

function initRangeSlider(container) {
  const inputLeft = container.querySelector(".input-left");
  const inputRight = container.querySelector(".input-right");
  const sliderRange = container.querySelector(".slider-range");
  const tooltipLeft = container.querySelector(".tooltip-left");
  const tooltipRight = container.querySelector(".tooltip-right");
  const thumbDotRight = container.querySelector(".thumb-dot-right");
  const thumbDotLeft = container.querySelector(".thumb-dot-left");
  thumbDotRight.style.top = "50%";
  thumbDotLeft.style.top = "50%";

  function calculatePosition(input) {
    const { width: containerWidth } = container.getBoundingClientRect();
    const thumbSize = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--thumb-size",
      ),
    );
    const min = Number(input.min);
    const max = Number(input.max);
    const value = Number(input.value);
    const clampedValue = Math.min(Math.max(value, min), max);
    const percentage = (clampedValue - min) / (max - min);
    const usableWidth = containerWidth - thumbSize;
    const position = percentage * usableWidth + thumbSize / 2;
    return position;
  }

  function updateSliderRange() {
    const percent1 = (inputRight.value / inputRight.max) * 100;
    const percent2 = (inputLeft.value / inputLeft.max) * 100;
    sliderRange.style.right = percent1 + "%";
    sliderRange.style.left = "auto";
    sliderRange.style.width = percent2 - percent1 + "%";
    updateTooltips();
  }

  function updateTooltips() {
    tooltipLeft.innerHTML = Number(inputLeft.value).toLocaleString("fa-IR");
    tooltipRight.innerHTML = Number(inputRight.value).toLocaleString("fa-IR");

    // Measure rendered width of tooltips
    const tooltipLeftWidth = tooltipLeft.getBoundingClientRect().width;
    const tooltipRightWidth = tooltipRight.getBoundingClientRect().width;

    const TOOLTIP_COLLISION_THRESHOLD =
      Math.max(tooltipLeftWidth, tooltipRightWidth) + 8;

    // Calculate positions
    const leftPosition = calculatePosition(inputLeft);
    const rightPosition = calculatePosition(inputRight);

    // Position thumbs and tooltips
    thumbDotRight.style.right = rightPosition + "px";
    thumbDotLeft.style.right = leftPosition + "px";
    tooltipLeft.style.right = leftPosition + "px";
    tooltipRight.style.right = rightPosition + "px";

    // Collision logic: put the active one on bottom
    const distance = Math.abs(leftPosition - rightPosition);

    if (distance < TOOLTIP_COLLISION_THRESHOLD) {
      if (document.activeElement === inputLeft) {
        tooltipLeft.classList.add("tooltip-bottom");
        tooltipRight.classList.remove("tooltip-bottom");
      } else if (document.activeElement === inputRight) {
        tooltipRight.classList.add("tooltip-bottom");
        tooltipLeft.classList.remove("tooltip-bottom");
      }
    } else {
      // Far enough apart — both on top
      tooltipLeft.classList.remove("tooltip-bottom");
      tooltipRight.classList.remove("tooltip-bottom");
    }
  }

  function initializeSlider() {
    updateSliderRange();
  }

  inputLeft.addEventListener("input", function () {
    const minGap = parseInt(inputRight.getAttribute("data-gap"));

    if (parseInt(inputLeft.value) - parseInt(inputRight.value) <= minGap) {
      inputLeft.value = parseInt(inputRight.value) + minGap;
    }
    thumbDotLeft.style.visibility = "visible";

    inputLeft.classList.add("range-input-moving");

    updateSliderRange();
  });

  inputRight.addEventListener("input", function () {
    const minGap = parseInt(inputRight.getAttribute("data-gap"));

    if (parseInt(inputLeft.value) - parseInt(inputRight.value) <= minGap) {
      inputRight.value = parseInt(inputLeft.value) - minGap;
    }
    thumbDotRight.style.visibility = "visible";
    inputRight.classList.add("range-input-moving");
    updateSliderRange();
  });

  inputLeft.addEventListener("mouseout", function () {
    if (!inputLeft.matches(":active")) {
      inputLeft.classList.remove("range-input-moving");
      thumbDotLeft.style.visibility = "hidden";
    }
  });

  inputRight.addEventListener("mouseout", function () {
    if (!inputRight.matches(":active")) {
      inputRight.classList.remove("range-input-moving");
      thumbDotRight.style.visibility = "hidden";
    }
  });

  // Add mouseup event listeners to handle when dragging stops
  inputLeft.addEventListener("mouseup", function () {
    setTimeout(() => {
      if (!inputLeft.matches(":active")) {
        inputLeft.classList.remove("range-input-moving");
        thumbDotLeft.style.visibility = "hidden";
      }
    }, 100);
  });

  inputRight.addEventListener("mouseup", function () {
    setTimeout(() => {
      if (!inputRight.matches(":active")) {
        inputRight.classList.remove("range-input-moving");
        thumbDotRight.style.visibility = "hidden";
      }
    }, 100);
  });

  initializeSlider();
}
