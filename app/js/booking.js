document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form");
  const status = document.getElementById("status");

  // Party Size Stepper
  const MIN_GUESTS = 1;
  const MAX_GUESTS = 20;
  let partyCount = 1;

  const countLabel = document.getElementById("party-count");
  const countValue = document.getElementById("party-size-value");
  const decreaseBtn = document.getElementById("decrease");
  const increaseBtn = document.getElementById("increase");

  const updatePartyCount = () => {
    countLabel.textContent = `${partyCount} ${partyCount === 1 ? "person" : "people"}`;
    countValue.value = partyCount;
    decreaseBtn.disabled = partyCount <= MIN_GUESTS;
    increaseBtn.disabled = partyCount >= MAX_GUESTS;
  };

  decreaseBtn.addEventListener("click", () => {
    if (partyCount > MIN_GUESTS) {
      partyCount--;
      updatePartyCount();
    }
  });

  increaseBtn.addEventListener("click", () => {
    if (partyCount < MAX_GUESTS) {
      partyCount++;
      updatePartyCount();
    }
  });

  updatePartyCount();

  // Validation Helpers
  const toggleFieldError = (field, message = "") => {
    const isInvalid = Boolean(message);
    field.setAttribute("aria-invalid", isInvalid);
    field
      .closest(".form__field")
      .classList.toggle("form__field--error", isInvalid);
  };

  const toggleGroupError = (inputs, groupEl, message = "") => {
    const isInvalid = Boolean(message);
    inputs.forEach((input) => input.setAttribute("aria-invalid", isInvalid));
    groupEl.classList.toggle("form__group--error", isInvalid);
  };

  // Field References
  const nameInput = document.getElementById("form-name");
  const emailInput = document.getElementById("form-email");

  const dateGroup = document.getElementById("date-group");
  const dateInputs = [
    document.getElementById("date-dd"),
    document.getElementById("date-mm"),
    document.getElementById("date-yyyy"),
  ];

  const timeGroup = document.getElementById("time-group");
  const timeInputs = [
    document.getElementById("time-hh"),
    document.getElementById("time-mm"),
    document.getElementById("time-period"),
  ];

  // Validators
  const validateName = () => {
    const value = nameInput.value.trim();
    if (!value) {
      toggleFieldError(nameInput, "This field is required");
      return false;
    }
    toggleFieldError(nameInput);
    return true;
  };

  const validateEmail = () => {
    const value = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!value) {
      toggleFieldError(emailInput, "This field is required");
      return false;
    }
    if (!emailPattern.test(value)) {
      toggleFieldError(emailInput, "Please use a valid email address");
      return false;
    }
    toggleFieldError(emailInput);
    return true;
  };

  const validateGroup = (inputs, group) => {
    const isIncomplete = inputs.some((input) => input.value.trim() === "");
    if (isIncomplete) {
      toggleGroupError(inputs, group, "This field is incomplete");
      return false;
    }
    toggleGroupError(inputs, group);
    return true;
  };

  // Restrict inputs to numbers
  [...dateInputs, timeInputs[0], timeInputs[1]].forEach((input) => {
    input.addEventListener("input", () => {
      input.value = input.value.replace(/[^0-9]/g, "");
    });
  });

  // Blur Event Listeners
  nameInput.addEventListener("blur", validateName);
  emailInput.addEventListener("blur", validateEmail);
  dateInputs.forEach((input) =>
    input.addEventListener("blur", () => validateGroup(dateInputs, dateGroup)),
  );
  timeInputs.forEach((input) => {
    const eventType = input.tagName === "SELECT" ? "change" : "blur";
    input.addEventListener(eventType, () =>
      validateGroup(timeInputs, timeGroup),
    );
  });

  // Submit Handler
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    status.hidden = true;

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isDateValid = validateGroup(dateInputs, dateGroup);
    const isTimeValid = validateGroup(timeInputs, timeGroup);

    const isValid = isNameValid && isEmailValid && isDateValid && isTimeValid;

    if (!isValid) {
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    status.hidden = false;

    setTimeout(() => {
      form.reset();
      partyCount = 1;
      updatePartyCount();
      status.hidden = true;
    }, 1000);
  });
});
