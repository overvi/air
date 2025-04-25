import DatePicker from "../../lib/datepicker.esm.js";
import "../../lib/datepicker.css";
import "./tab.js";
import "./dropdown.js";
import "./dp.js";
import "./swapable.js";
import safeCreateValidator from "./validation";
import CustomSelect from "./select.js";
import citySelectCallback from "./citySelect.js";

new DatePicker("outbound_date_picker");

const validators = {
  outbound: safeCreateValidator(
    "#buy-ticket-outbound",
    "#outbound-from-hidden",
    "#outbound-to-hidden",
  ),
};

document.querySelectorAll(".swap-box").forEach((box, index) => {
  if (!box.hasAttribute("data-initialized")) {
    box.setAttribute("data-initialized", "true");
    new CustomSelect(box, (value) => {
      citySelectCallback(value, index);
    });
  }
});
