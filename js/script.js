const body = document.body;

const bill = document.getElementById("bill");
const custom = document.getElementById("custom");
const people = document.getElementById("people");
const tip = document.getElementById("tip");
const tipButtons = Array.from(document.querySelectorAll(".percent"));

const tipAmountElement = document.getElementById("tip-amount");
const totalAmountElement = document.getElementById("total-amount");

const billHeader = document.querySelector(".bill-header");
const tipHeader = document.querySelector(".tip-header");
const peopleHeader = document.querySelector(".people-header");

bill.addEventListener("input", () => {
  calculateTip();
});
custom.addEventListener("input", () => {
  calculateTip();
});
people.addEventListener("input", () => {
  calculateTip();
});

// inputFilter function by emkey08

function setInputFilter(input, inputFilter) {
  [
    "input",
    "keydown",
    "keyup",
    "mousedown",
    "mouseup",
    "select",
    "contextmenu",
    "drop",
  ].forEach(function (event) {
    input.addEventListener(event, function () {
      if (inputFilter(this.value)) {
        this.oldValue = this.value;
        this.oldSelectionStart = this.selectionStart;
        this.oldSelectionEnd = this.selectionEnd;
      } else if (this.hasOwnProperty("oldValue")) {
        this.value = this.oldValue;
        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
      } else {
        this.value = "";
      }
    });
  });
}

setInputFilter(bill, (value) => {
  return /^-?\d*[.,]?\d*$/.test(value);
});
setInputFilter(custom, (value) => {
  return /^\d*$/.test(value) && (value === "" || parseInt(value) <= 100);
});
setInputFilter(people, (value) => {
  return /^\d*$/.test(value) && (value === "" || parseInt(value) <= 100);
});

//Input Filter end

body.addEventListener("click", (e) => {
  checkClickedButton(e);
});

function checkClickedButton(e) {
  if (e.target.className === "percent") {
    addActiveState(e);
  } else if (e.target.className === "reset") {
    resetEverything();
  }
}

function addActiveState(e) {
  removeAllActiveStates();
  e.target.classList.add("active");
  calculateTip();
}

function removeAllActiveStates() {
  for (let i = 0; i < tipButtons.length; i++) {
    tipButtons[i].classList.remove("active");
  }
}

function resetEverything() {
  bill.value = "";
  custom.value = "";
  people.value = "";

  tipAmountElement.textContent = "0.00";
  totalAmountElement.textContent = "0.00";

  window.location.reload();
}

function calculateTip() {
  let billVal = parseFloat(bill.value);
  let noOfPeople = parseFloat(people.value);
  let tipPercentValue = checkTipPercent();

  let tipAmount = parseFloat(billVal * (tipPercentValue / 100));
  let total = parseFloat(billVal + tipAmount);

  let tipAmountPerPerson = (tipAmount / noOfPeople).toFixed(2);
  let totalPerPerson = (total / noOfPeople).toFixed(2);

  displayOutput(tipAmountPerPerson, totalPerPerson);
  showErr(billVal, tipPercentValue, noOfPeople);
}

function checkTipPercent() {
  let buttonActive = tipButtons.find((item) =>
    item.classList.contains("active")
  );

  if (buttonActive === undefined) {
    return checkCustom();
  } else if (buttonActive !== undefined && custom.value !== "") {
    return checkCustom();
  } else {
    let tipPercentValue = parseFloat(buttonActive.id);
    return tipPercentValue;
  }
}

function checkCustom() {
  removeAllActiveStates();
  let customPercentValue = parseFloat(custom.value);

  return customPercentValue;
}

function displayOutput(tipAmountPerPerson, totalPerPerson) {
  tipAmountElement.textContent = tipAmountPerPerson;
  totalAmountElement.textContent = totalPerPerson;
}

function showErr(billVal, tipPercentValue, noOfPeople) {
  if (isNaN(billVal)) {
    createErrElement(bill);
  } else if (!isNaN(billVal) && bill.classList.contains("error-outline")) {
    removeErrElement(bill);
  }

  if (isNaN(tipPercentValue)) {
    createErrElement(tip);
  } else if (
    !isNaN(tipPercentValue) &&
    tip.classList.contains("error-outline")
  ) {
    removeErrElement(tip);
  }

  if (isNaN(noOfPeople)) {
    createErrElement(people);
  } else if (!isNaN(noOfPeople) && people.classList.contains("error-outline")) {
    removeErrElement(people);
  }
}

function createErrElement(inputID) {
  if (!inputID.classList.contains("error-outline")) {
    let errorMsg = document.createElement("h2");
    errorMsg.textContent = "Can't be empty";
    errorMsg.classList.add("error");

    inputID.previousElementSibling.appendChild(errorMsg);
    inputID.classList.add("error-outline");
  }
}

function removeErrElement(removeInputID) {
  removeInputID.classList.remove("error-outline");
  removeInputID.previousElementSibling.children[1].remove();
}
