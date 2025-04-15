import JustValidate from "just-validate";
import CustomSelect from "./select";

CustomSelect.initializeAll();

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
      monthInput.focus();
    }
  });
});
const validator = new JustValidate("#profile");

validator.addField(
  "#shaba-number",
  [
    {
      rule: "required",
      errorMessage: "شماره شبا با کد ملی مطابقت ندارد.",
    },
    {
      validator: () => {
        return false; // always fails
      },
      errorMessage: "شماره شبا با کد ملی مطابقت ندارد.",
    },
  ],
  {
    errorsContainer: "#shaba-err",
    errorLabelStyle: {
      color: "#d70000",
    },
  },
);


const sendCode = document.getElementById("send-code")
const phone = document.getElementById("phone-number")
let countdown;

sendCode.addEventListener("click" , () => {
  // Prevent multiple timers
  if (countdown) return;

  let duration = 2 * 60; // 2 minutes in seconds
  sendCode.disabled = true; // disable the sendCode

  // Initial update
  updateDisplay(duration);

  countdown = setInterval(() => {
    duration--;

    if (duration < 0) {
      clearInterval(countdown);
      countdown = null;
      sendCode.textContent = "دریافت کد";
      button.disabled = false;
      return;
    }

    updateDisplay(duration);
  }, 1000);
});


function updateDisplay(seconds) {
  const minutes = Math.floor(seconds / 60);
  const sec = seconds % 60;
  sendCode.innerText = 
    `دریافت مجدد کد ${minutes.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')} `;
}
