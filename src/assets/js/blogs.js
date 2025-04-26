import Splide from "@splidejs/splide";

const blog = new Splide(".splide", {
    type: "slide",
    perPage: 1,
    perMove: 1,
    gap: "1.5rem",
    direction: "rtl",
    pagination: false,
arrows :false,
    mediaQuery: "min",
    autoplay :  true,
 
  }).mount();

  const buttons = document.querySelectorAll('.custom-pagination button');

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const index = parseInt(button.getAttribute('data-slide'), 10);
      blog.go(index);
    });
  });
  
  // Track active slide
  blog.on('move', (newIndex) => {
    buttons.forEach((button, index) => {
      button.classList.toggle('active', index === newIndex);
    });
  });
  
  