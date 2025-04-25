import myImage from "@assets/images/city.webp";
import Splide from "@splidejs/splide";
import CustomSelect from "./select"

CustomSelect.initializeAll()
const svgElements = document.querySelectorAll("object");

svgElements.forEach((svgElement) => {
  const originalSrc = svgElement.getAttribute("data");

  const svgObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.setAttribute("data", originalSrc);
        } else {
          entry.target.setAttribute("data", "about:blank");
        }
      });
    },
    { threshold: 0.1 },
  );

  svgObserver.observe(svgElement);
});

const days = {
  0: "saturday",
  1: "sunday",
  2: "monday",
  3: "tuesday",
  4: "wednesday",
  5: "thursday",
  6: "friday",
};

const mapDays = document.querySelector(".map-day-container");
const mapContainer = document.getElementById("map-container");

mapDays.addEventListener("click", (ev) => {
  const target = ev.target;
  const selectedItem = target.closest("li");

  if (!selectedItem) return;

  const childArray = Array.from(mapDays.children);

  childArray.forEach((child) => {
    child.classList.remove("selected-day");
  });
  selectedItem.classList.add("selected-day");

  const targetDay = `data-${days[childArray.indexOf(selectedItem)]}`;
  const dayCities = mapContainer.getAttribute(targetDay);

  resetFlightPaths();

  let poses = null;
  JSON.parse(dayCities.replace(/'/g, '"')).map((city) => {
    poses = drawFlightPath("tehran", city, poses, true);
  });
});

function getCityCenter(cityId) {
  const cityPath = document.getElementById(cityId);

  const bbox = cityPath.getBBox();

  return {
    x: bbox.x + bbox.width / 3,
    y: bbox.y + bbox.height / 1.8,
  };
}

function drawFlightPath(fromCityId, toCityId, poses, highlight = false) {
  const fromCenter = getCityCenter(fromCityId);
  const toCenter = getCityCenter(toCityId);

  if (highlight) {
    document.getElementById(toCityId).setAttribute("fill", "#c6c6c6");
    document.getElementById(fromCityId).setAttribute("fill", "#C6C6C6");
    document.getElementById(fromCityId).setAttribute("stroke", "#000000");
    document.getElementById(fromCityId).setAttribute("stroke-width", "2");
  }

  const flightPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path",
  );
  const curveStrength = Math.abs(toCenter.x - fromCenter.x) / 3;
  const controlX = (fromCenter.x + toCenter.x) / 2;
  const controlY = (fromCenter.y + toCenter.y) / 2 - curveStrength;

  flightPath.setAttribute(
    "d",
    `M${fromCenter.x},${fromCenter.y} Q${controlX},${controlY} ${toCenter.x},${toCenter.y}`,
  );
  flightPath.setAttribute("class", "flight-path");
  flightPath.setAttribute("stroke-dasharray", "5,5");
  flightPath.setAttribute("stroke", "black");
  flightPath.setAttribute("stroke-width", "1");
  flightPath.setAttribute("fill", "none");

  const startCircle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle",
  );
  startCircle.setAttribute("cx", fromCenter.x);
  startCircle.setAttribute("cy", fromCenter.y);
  startCircle.setAttribute("r", "6");
  startCircle.setAttribute("fill", "black");

  const hole = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  hole.setAttribute("cx", fromCenter.x);
  hole.setAttribute("cy", fromCenter.y);
  hole.setAttribute("r", "3");
  hole.setAttribute("fill", "white");
  const endCircle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle",
  );
  endCircle.setAttribute("cx", toCenter.x);
  endCircle.setAttribute("cy", toCenter.y);
  endCircle.setAttribute("r", "6");
  endCircle.setAttribute("fill", "black");

  const svg = container.querySelector("svg");
  svg.appendChild(startCircle);
  svg.appendChild(hole);
  svg.appendChild(endCircle);

  function getPointOnCurve(t) {
    const x =
      (1 - t) ** 2 * fromCenter.x +
      2 * (1 - t) * t * controlX +
      t ** 2 * toCenter.x;
    const y =
      (1 - t) ** 2 * fromCenter.y +
      2 * (1 - t) * t * controlY +
      t ** 2 * toCenter.y;
    return { x, y };
  }

  function getTangentAngle(t, deltaT = 0.001) {
    const p1 = getPointOnCurve(t);
    const p2 = getPointOnCurve(1.5);

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;

    return Math.atan2(dy, dx) * (180 / Math.PI);
  }

  let t = 0.7;
  if (poses) {
    const distance = Math.sqrt(
      (poses.flightPos.x - fromCenter.x) ** 2 +
        (poses.flightPos.y - fromCenter.y) ** 2,
    );

    if (distance < 100) {
      t += 0.15;
    } else {
      t += distance / 5200;
    }
  }
  const flightPos = getPointOnCurve(t);
  const flightAngle = getTangentAngle(t);
  const isMovingLeft = toCenter.x < fromCenter.x;

  const flight = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  flight.innerHTML = `
<path style="transform-origin:center" fill-rule="evenodd" clip-rule="evenodd" d="M24.5857 14.6214L31.2548 13.6398C32.3548 13.4779 33.4498 12.8828 34.2989 11.9854C35.1481 11.088 35.6818 9.96176 35.7827 8.85453C35.8836 7.7473 35.5434 6.74974 34.837 6.08129C34.1306 5.41285 33.1157 5.12828 32.0158 5.29018L8.98595 8.67998C8.67796 8.72515 8.38396 8.68311 8.13688 8.55856C7.8898 8.43402 7.6994 8.23189 7.587 7.97481L6.97984 6.5913C6.86744 6.33422 6.67704 6.13209 6.42996 6.00755C6.18288 5.883 5.88888 5.84096 5.58089 5.88613L2.48691 6.34154C2.21226 6.38172 1.9356 6.48993 1.68174 6.65646C1.42789 6.82299 1.20479 7.04262 1.03246 7.29564C0.860135 7.54867 0.743978 7.82717 0.694415 8.10616C0.644853 8.38514 0.663435 8.65588 0.748493 8.89406L3.54268 16.7204C3.64329 17.0021 3.83282 17.2269 4.08775 17.3669C4.34267 17.5069 4.65178 17.5558 4.9767 17.5077L11.3853 16.5644C11.6562 16.5247 11.9169 16.5524 12.1446 16.6451C12.3722 16.7378 12.5599 16.8927 12.6912 17.0962C12.8225 17.2997 12.8934 17.5457 12.8978 17.8126C12.9021 18.0795 12.8398 18.3592 12.7162 18.6273L10.8776 22.6197C10.7544 22.8875 10.6924 23.1668 10.6968 23.4333C10.7013 23.6999 10.7722 23.9455 10.9033 24.1488C11.0343 24.352 11.2217 24.5068 11.4489 24.5996C11.6762 24.6924 11.9364 24.7204 12.207 24.6811L15.5946 24.1825C15.8434 24.1459 16.0941 24.0535 16.3283 23.9121C16.5624 23.7707 16.774 23.5839 16.9473 23.3655L23.2347 15.4381C23.4078 15.22 23.6191 15.0333 23.8529 14.892C24.0868 14.7506 24.3372 14.6582 24.5857 14.6214ZM13.9193 6.30631L21.7994 5.14642L18.9601 1.28079C18.8245 1.09613 18.6395 0.957292 18.4197 0.87526C18.1999 0.793228 17.9514 0.770256 17.6938 0.808165L14.5717 1.26772C14.289 1.30948 14.0044 1.42325 13.7449 1.59823C13.4854 1.77321 13.2596 2.0036 13.089 2.26753C12.9184 2.53147 12.8085 2.8202 12.7699 3.10632C12.7313 3.39244 12.7651 3.66647 12.8683 3.90241L13.9193 6.30631Z" fill="black"/>

`;

  flight.setAttribute("x", flightPos.x - 10);
  flight.setAttribute("y", flightPos.y - 50);
  flight.setAttribute("width", "40");
  flight.setAttribute("height", "35");
  const ROTATION_OFFSET = -15; // tweak this value until plane looks level

  flight
    .querySelector("path")
    .setAttribute(
      "transform",
      isMovingLeft
        ? `rotate(${flightAngle + ROTATION_OFFSET}) scale(1 , -1)`
        : `rotate(${flightAngle + ROTATION_OFFSET})`,
    );

  svg.appendChild(flight);

  container.querySelector("svg").appendChild(flightPath);

  createCityLabel(toCityId, toCenter, poses);

  return { flightPos, toCenter };
}

const container = document.getElementById("map");
function createCityLabel(cityId, endPos, poses) {
  const el = document.getElementById(cityId);
  const cityLabel = document.createElement("div");
  cityLabel.classList.add("city-label");
  cityLabel.innerHTML = `
    <div class="label-box text-sm bg-[#DFDFDF]/40 py-1 border border-[#ABABAB] ps-1 pe-4 rounded-xl flex items-center gap-8.5">
      <img src=${myImage} alt="${cityId}" />
      <span>${el.getAttribute("data-name")}</span>
    </div>
  `;

  function isMoreThan100Apart(num1, num2) {
    return Math.abs(num1 - num2) > 100;
  }

  container.appendChild(cityLabel);

  let top = null;
  if (poses && !isMoreThan100Apart(poses.toCenter.y, endPos.y)) {
    cityLabel.style.left = `${endPos.x - 104}px`;
    cityLabel.style.top = `${endPos.y + 30}px`;
    top = endPos.y + 30;
  } else {
    cityLabel.style.left = `${endPos.x - 50}px`;
    cityLabel.style.top = `${endPos.y - 120}px`;
    top = endPos.y - 55;
  }

  cityLabel.style.position = "absolute";

  const lineX1 = endPos.x;
  const lineY1 = endPos.y;
  const lineX2 = endPos.x;
  const lineY2 = top;

  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", lineX1);
  line.setAttribute("y1", lineY1);
  line.setAttribute("x2", lineX2);
  line.setAttribute("y2", lineY2);
  line.setAttribute("stroke", "#ABABAB");
  line.setAttribute("stroke-width", "2");

  container.querySelector("svg").appendChild(line);
}

function resetFlightPaths() {
  const svg = container.querySelector("svg");
  const labels = document.querySelectorAll(".city-label");

  // Only remove dynamically added elements
  svg
    .querySelectorAll("path.flight-path, circle, line, svg")
    .forEach((el) => el.remove());

  labels.forEach((label) => label.remove());
  document.querySelectorAll("[id]").forEach((city) => {
    if (
      city.getAttribute("fill") === "#C6C6C6" ||
      city.getAttribute("fill") === "#c6c6c6"
    ) {
      city.setAttribute("fill", "#EFEFEF");
    }
    city.removeAttribute("stroke");
    city.removeAttribute("stroke-width");
  });
}

function drawInitial() {
  setTimeout(() => {
    let poses = null;
    poses = drawFlightPath("tehran", "alborz", poses);
    poses = drawFlightPath("tehran", "sistan", poses);
    poses = drawFlightPath("tehran", "ardabil", poses);
    poses = drawFlightPath("tehran", "khuzestan", poses);
    poses = drawFlightPath("tehran", "khorasan-razavi", poses);
  }, 550);
}

drawInitial();

let lastHoveredRegion = null;

container.querySelectorAll("path[data-name]").forEach((path) => {
  path.addEventListener("mouseover", (ev) => {
    resetFlightPaths();
    const event = ev.target;

    if (!event.getAttribute("data-name")) return;

    if (lastHoveredRegion && lastHoveredRegion !== event) {
      resetStyles(lastHoveredRegion);
    }

    const tehran = mapContainer.querySelector("path[id='tehran']");
    if (tehran) {
      tehran.classList.add("!fill-black");
    }

    const tehranBbox = tehran.getBBox();
    const tehranCenterX = tehranBbox.x + tehranBbox.width / 2;
    const tehranCenterY = tehranBbox.y + tehranBbox.height / 2;

    const tehranIcon = document.getElementById("tehran-svg");
    const tehranLabel = document.getElementById("tehran-label");

    tehranIcon.classList.remove("hidden");
    tehranLabel.classList.remove("hidden");

    tehranIcon.style.top = `${tehranCenterY - 15}px`;
    tehranIcon.style.left = `${tehranCenterX - 45}px`;
    tehranLabel.style.top = `${tehranCenterY - 75}px`;
    tehranLabel.style.left = `${tehranCenterX - 45}px`;

    const targetIcon = mapContainer.querySelector(`#${event.id}-icon`);
    if (targetIcon) {
      const bbox = event.getBBox();
      const centerX = bbox.x + bbox.width / 2;
      const centerY = bbox.y + bbox.height / 2;

      targetIcon.classList.remove("hidden");
      targetIcon.style.top = `${centerY - 50}px`;
      targetIcon.style.left = `${centerX}px`;
    }

    const targetFlies = mapContainer.querySelector(`#${event.id}-flies`);
    if (targetFlies) {
      const bbox = event.getBBox();
      const centerX = bbox.x + bbox.width / 2;
      const centerY = bbox.y + bbox.height / 2;

      targetFlies.classList.remove("hidden");
      targetFlies.style.top = `${centerY - 190}px`;
      targetFlies.style.left = `${centerX - 130}px`;
    }

    // Update the last hovered region
    lastHoveredRegion = event;
  });
});

function resetStyles(region) {
  const icon = mapContainer.querySelector(`#${region.id}-icon`);
  if (icon) icon.classList.add("hidden");

  const flies = mapContainer.querySelector(`#${region.id}-flies`);
  if (flies) flies.classList.add("hidden");
}

container.addEventListener("mouseleave", () => {
  const tehran = mapContainer.querySelector("path[id='tehran']");
  if (tehran) {
    tehran.classList.remove("!fill-black");
  }

  const tehranIcon = document.getElementById("tehran-svg");
  const tehranLabel = document.getElementById("tehran-label");

  if (tehranIcon) tehranIcon.classList.add("hidden");
  if (tehranLabel) tehranLabel.classList.add("hidden");

  const allIcons = mapContainer.querySelectorAll("[id$='-icon']");
  allIcons.forEach((icon) => icon.classList.add("hidden"));

  const allFlies = mapContainer.querySelectorAll("[id$='-flies']");
  allFlies.forEach((flies) => flies.classList.add("hidden"));

  const selectedDay = document.querySelector("li.selected-day");
  if (selectedDay) {
    selectedDay.click();
  } else {
    drawInitial();
  }
});

const blog = new Splide(".splide", {
  type: "slide",
  perPage: 4,
  perMove: 1,
  gap: "1.5rem",
  direction: "rtl",

  arrows: false,

  mediaQuery: "min",
  breakpoints: {
    1440: {
      perPage: 5,
    },
    1660: {
      perPage: 6,
    },
  },
}).mount();

document
  .querySelector(".external__splide__arrows .prev")
  .addEventListener("click", function () {
    blog.go("<"); // Go to the previous slide
  });

document
  .querySelector(".external__splide__arrows .next")
  .addEventListener("click", function () {
    blog.go(">"); // Go to the next slide
  });

const wrapper = document.querySelector(".card-wrapper");
let cards = Array.from(wrapper.children);
let isAnimating = false;
const autoSlideInterval = 3000;
let autoSlideTimer;

function layoutCards() {
  const gap = 16;
  let offset = 0;

  cards.forEach((card, index) => {
    const isSelected = card.classList.contains("selected");
    card.style.transform = `translateX(${offset}px)`;
    card.dataset.index = index;
    offset += card.offsetWidth + gap;
  });
}

function moveCardToEnd() {
  if (isAnimating) return;
  isAnimating = true;

  const randomIndex = Math.floor(Math.random() * (cards.length - 1));
  const selectedCard = cards[randomIndex];

  selectedCard.classList.add("fading-out");

  // Wait for fade-out to complete
  setTimeout(() => {
    selectedCard.classList.remove("fading-out");

    cards.splice(randomIndex, 1);
    cards.push(selectedCard);

    cards.forEach((c) => c.classList.remove("selected"));
    cards[cards.length - 1].classList.add("selected");

    layoutCards();

    // Fade-in handled by CSS as opacity resets to 1
    setTimeout(() => {
      isAnimating = false;
    }, 500);
  }, 500); // Duration matches fade-out transition
}

setTimeout(() => {
  layoutCards();
  addCardHoverListeners();
  startAutoSlide();
}, 300);

function startAutoSlide() {
  clearInterval(autoSlideTimer);
  autoSlideTimer = setInterval(moveCardToEnd, autoSlideInterval);
}

function stopAutoSlide() {
  clearInterval(autoSlideTimer);
}

function addCardHoverListeners() {
  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      cards.forEach((c) => c.classList.remove("selected"));
      card.classList.add("selected");

      layoutCards(); // no stopAutoSlide here
    });

    card.addEventListener("mouseleave", () => {
      cards.forEach((c) => c.classList.remove("selected"));
      cards[cards.length - 1].classList.add("selected");
      layoutCards(); // no startAutoSlide here
    });
  });
}

wrapper.addEventListener("mouseenter", stopAutoSlide);
wrapper.addEventListener("mouseleave", startAutoSlide);

const mobileNavToggle = document.getElementById("mobile-nav-toggle");
const closeNav = document.getElementById("close-nav");
const mobileNav = document.getElementById("mobile-nav");

mobileNavToggle.addEventListener("click", () => {
  mobileNav.classList.remove("hidden");
  mobileNav.classList.add("flex");
});

closeNav.addEventListener("click", () => {
  mobileNav.classList.add("hidden");
  mobileNav.classList.remove("flex");
});
