const citySelectCallback = (value, index) => {
  const svg = value.querySelector("svg");
  const city_icon = value.closest(".swap-box").querySelector(`.city-icon`);

  if (svg && city_icon.children.length > 0) {
    city_icon.replaceChild(svg.cloneNode(true), city_icon.children[0]);
  }
};

export default citySelectCallback;
