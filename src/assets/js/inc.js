document.addEventListener("click", (e) => {

    if (e.target.closest(".increment")) {
      const button = e.target.closest("button");
      const target = button.getAttribute("aria-controls");
      const input = document.getElementById(target);
  
      let prefix;
      prefix = target.slice(target.indexOf("-"));
  
      if (input) {
        input.stepUp(1);
        updatePassengerText(prefix);
      }
    }
  
    // Decrement logic
    if (e.target.closest(".decrement")) {
      const button = e.target.closest("button");
      const target = button.getAttribute("aria-controls");
      const input = document.getElementById(target);
  
      let prefix;
      prefix = target.slice(target.indexOf("-"));
  
      if (input) {
        input.stepDown(1);
        updatePassengerText(prefix);
      }
    }
  });
  
  function updatePassengerText(prefix) {
    prefix = prefix || "";
    const adults = document.getElementById(`adults${prefix}`).value;
    const children = document.getElementById(`child${prefix}`).value;
    const infants = document.getElementById(`soChild${prefix}`).value;
  
    const passengerInput = document.getElementById(`passengers${prefix}`);
  
    let parts = [];
  
    if (adults > 0) parts.push(`${adults} بزرگسال`);
    if (children > 0) parts.push(`${children} کودک`);
    if (infants > 0) parts.push(`${infants} نوزاد`);
  
    let text = parts.join(" , ");
  
    passengerInput.value = text;
  }
  