import JustValidate from "just-validate";

function safeCreateValidator(formId, fromField, toField) {
    const form = document.querySelector(formId);
    if (!form) return null;
  
    const validator = new JustValidate(formId, {
      errorLabelStyle: { display: "none" },
    });
  
    validator
      .addField(fromField, [{ rule: "required" }])
      .addField(toField, [{ rule: "required" }])
      .onValidate((info) => {
        handleValidationResult(info, fromField, toField);
      });
  
    return validator;
  }

  const err = document.getElementById("unselected-city-error");



// Handles validation results dynamically
function handleValidationResult(info, fromField, toField) {
  if (!info.isSubmitted) return;
  if (info.isValid) {
    ticketOutboundValidateField("success");
  } else {
    if (info.fields[fromField] || info.fields[toField]) {
      ticketOutboundValidateField("error", "لطفا مبدا و مقصد را مشخص کنید");
    }
  }
}

function ticketOutboundValidateField(type, message = "") {
  if (type === "success") {
    err.classList.add("opacity-0");
  } else {
    err.classList.remove("opacity-0");
    err.querySelector("p").textContent = message;
  }
}

export default safeCreateValidator