document.addEventListener("click", (event) => {
    document.querySelectorAll(".dp").forEach((picker) => {
      const input = picker.querySelector(".date");
      const calendar = picker.querySelector(".date_picker_calendar");
  
      if (input.contains(event.target)) {
        document.querySelectorAll(".date_picker_calendar").forEach((cal) => {
          if (cal !== calendar) cal.classList.add("hidden");
        });
        calendar.classList.toggle("hidden");
        picker.classList.toggle("open");
      } else if (!picker.contains(event.target)) {
        calendar.classList.add("hidden");
        picker.classList.remove("open");
      }
    });
  });