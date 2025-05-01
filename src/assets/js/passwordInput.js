const passwordInput = document.querySelectorAll(".password-input");

passwordInput.forEach((pi) => {
  const passwordVisibilityToggle = pi
    .closest("label")
    .querySelector(".password-visibility");

  passwordVisibilityToggle.addEventListener("click", () => {
    pi.type = pi.type == "text" ? "password" : "text";
  });
});

document
  .querySelector("input[type='number']")
  .addEventListener("input", function (e) {
    this.value = this.value.replace(/[^0-9.-]/g, "");
  });
