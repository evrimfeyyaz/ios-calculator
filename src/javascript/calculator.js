/**
 * Created by Evrim Persembe on 9/1/16.
 */

(function () {
  "use strict";

  var ADDITION        = 0;
  var SUBTRACTION     = 1;
  var MULTIPLICATION  = 2;
  var DIVISION        = 3;

  var AC  = "AC";
  var C   = "C";

  var opts;

  var firstOperand      = null;
  var secondOperand     = null;
  var operation         = null;
  var fractionalDigits  = null;
  var lastOperand       = null;
  var lastOperation     = null;
  var waitingForOperand = true;
  var priorityOperation = null;
  var thirdOperand      = null;
  var currentValue      = null;

  exports.initialize = function(options) {
    opts = options;

    attachEventHandlers();

    setClearButtonFunctionality(AC);

    displayCurrentValue();
  };

  exports.terminate = function() {
    opts = {};
    currentValue = null;
    allClear();
  };

  function attachEventHandlers() {
    opts.numberButtons.forEach(function (numberButton) {
      numberButton.addEventListener("click", numberButtonClickHandler);
    });

    opts.addButton.addEventListener("click", addButtonClickHandler);
    opts.subtractButton.addEventListener("click", subtractButtonClickHandler);
    opts.multiplyButton.addEventListener("click", multiplyButtonClickHandler);
    opts.divideButton.addEventListener("click", divideButtonClickHandler);

    opts.percentButton.addEventListener("click", percentButtonClickHandler);
    opts.decimalButton.addEventListener("click", decimalButtonClickHandler);
    opts.changeSignButton.addEventListener("click", changeSignButtonClickHandler);

    opts.equalsButton.addEventListener("click", equalsButtonClickHandler);
    opts.clearButton.addEventListener("click", clearButtonClickHandler);
  }

  // BEGIN EVENT HANDLERS

  function numberButtonClickHandler(e) {
    var numberButton  = e.currentTarget;
    var numberValue   = +numberButton.dataset.value;

    if (currentValue === null) currentValue = 0;

    if (fractionalDigits === null) {
      currentValue = (currentValue * 10) + numberValue;
    } else {
      currentValue = currentValue + (numberValue / Math.pow(10, fractionalDigits));
      fractionalDigits++;
    }

    displayCurrentValue();

    setClearButtonFunctionality(C);
  }

  function addButtonClickHandler() {
    operationButtonClick(ADDITION);
  }

  function subtractButtonClickHandler() {
    operationButtonClick(SUBTRACTION);
  }

  function multiplyButtonClickHandler() {
    operationButtonClick(MULTIPLICATION);
  }

  function divideButtonClickHandler() {
    operationButtonClick(DIVISION);
  }

  function percentButtonClickHandler() {
    if (currentValue !== null) inputOperand(currentValue);
    calculatePercentage();

    resetCurrentValueAndWaitForNewOperand();
  }

  function decimalButtonClickHandler() {
    if (fractionalDigits === null) {
      fractionalDigits = 1;

      var value = currentValue === null ? 0 : currentValue;
      value += ".";

      displayValue(value);
    }
  }

  function changeSignButtonClickHandler() {
    if (currentValue !== null) {
      currentValue = -currentValue;
      displayCurrentValue();
    } else {
      firstOperand = -firstOperand;
      displayValue(firstOperand);
    }

  }

  function equalsButtonClickHandler() {
    inputCurrentValue();

    calculateResult();

    resetCurrentValueAndWaitForNewOperand();
  }

  function clearButtonClickHandler() {
    var currentFunctionality = getClearButtonFunctionality();

    if (currentFunctionality === AC) {
      allClear();
    } else {
      setClearButtonFunctionality(AC);
    }

    resetCurrentValueAndWaitForNewOperand();
    displayCurrentValue();
  }

  // END EVENT HANDLERS


  // BEGIN OPERAND FUNCTIONS

  function inputCurrentValue() {
    if (currentValue !== null) inputOperand(currentValue);
  }

  function inputOperand(number) {
    if (hasPendingPriorityOperation()) {
      thirdOperand = number;
    } else if (hasNoOperation()) {
      firstOperand = number;
    } else {
      secondOperand = number;
    }

    lastOperand = number;

    waitingForOperand = false;
  }

  // END OPERAND FUNCTIONS


  // BEGIN OPERATION FUNCTIONS

  function operationButtonClick(operation) {
    inputCurrentValue();
    inputOperation(operation);

    resetCurrentValueAndWaitForNewOperand();
  }

  function inputOperation(newOperation) {
    if (firstOperand === null) {
      firstOperand = 0;
    }

    if (waitingForOperand) {
      if (hasPendingPriorityOperation() && isNewOperationPriority(newOperation)) {
        setPriorityOperation(newOperation);

        return;
      }

      if (hasPendingPriorityOperation() && !isNewOperationPriority(newOperation)) {
        removePriorityOperation();

        calculateResult();
      }

      setOperation(newOperation);
    }

    if (hasPendingPriorityOperation()) {
      calculatePendingPriorityOperation();
    }

    if (isNewOperationPriority(newOperation)) {
      setPriorityOperation(newOperation);
      waitingForOperand = true;

      return;
    }

    if (hasPendingOperation()) {
      calculateResult();
    }

    waitingForOperand = true;
    setOperation(newOperation);
  }

  function isNewOperationPriority(newOperation) {
    return (operation === ADDITION || operation === SUBTRACTION) &&
      (newOperation === MULTIPLICATION || newOperation === DIVISION);
  }

  function setOperation(newOperation) {
    operation = newOperation;
    lastOperation = operation;
  }

  function removeOperation() {
    operation = null;
  }

  function hasPendingOperation() {
    if (waitingForOperand) return false;

    return (operation !== null && secondOperand !== null);
  }

  function hasNoOperation() {
    return operation === null;
  }

  // END OPERATION FUNCTIONS


  // BEGIN PRIORITY OPERATION FUNCTIONS

  function hasPendingPriorityOperation() {
    return priorityOperation !== null;
  }

  function calculatePendingPriorityOperation() {
    secondOperand = getOperationResult(secondOperand, thirdOperand, priorityOperation);
    removePriorityOperation();
    thirdOperand = null;

    displayValue(secondOperand);
  }

  function setPriorityOperation(newPriorityOperation) {
    priorityOperation = newPriorityOperation;
    lastOperation = priorityOperation;
  }

  function removePriorityOperation() {
    priorityOperation = null;
  }

  // END PRIORITY OPERATION FUNCTIONS


  // BEGIN PERCENT OPERATION FUNCTIONS

  function getPercentage(number, percent) {
    if (percent === null) percent = number;

    return number * (percent / 100);
  }

  function calculatePercentage() {
    if (hasPendingPriorityOperation()) {
      thirdOperand = getPercentage(secondOperand, thirdOperand);
    } else if (firstOperand !== null && operation !== null) {
      secondOperand = getPercentage(firstOperand, secondOperand);
    } else {
      firstOperand /= 100;
    }
  }

  // END PERCENT OPERATION FUNCTIONS


  // BEGIN CLEAR FUNCTIONS

  function allClear() {
    firstOperand      = null;
    secondOperand     = null;
    operation         = null;
    fractionalDigits  = null;

    lastOperand     = null;
    lastOperation   = null;

    waitingForOperand  = true;

    priorityOperation  = null;
    thirdOperand      = null;
  }

  function getClearButtonFunctionality() {
    return opts.clearButton.dataset.currentFunctionality;
  }

  function setClearButtonFunctionality(functionality) {
    // TODO: Use an internal variable for this, and send notifications when this changes.
    opts.clearButton.dataset.currentFunctionality = functionality;
  }

  // END CLEAR FUNCTIONS


  // BEGIN DISPLAY FUNCTIONS

  function displayCurrentValue() {
    var value = currentValue === null ? 0 : currentValue;

    displayValue(value);
  }

  // TODO: Try notifying the interface of the result calculation here.
  function displayValue(valueString) {
    opts.displayPanel.innerHTML = valueString;
  }

  // END DISPLAY FUNCTIONS


  // BEGIN GENERAL FUNCTIONS

  function calculateResult() {
    if (firstOperand === null) {
      displayValue(0);

      return 0;
    }

    if (operation === null || secondOperand === null) {
      if (lastOperand !== null && lastOperation !== null) {
        firstOperand = getOperationResult(firstOperand, lastOperand, lastOperation);
      }

      displayValue(firstOperand);

      return firstOperand;
    }

    if (hasPendingPriorityOperation()) {
      calculatePendingPriorityOperation();
    }

    firstOperand = getOperationResult(firstOperand, secondOperand, operation);

    removeOperation();
    secondOperand = null;

    displayValue(firstOperand);

    return firstOperand;
  }

  function resetCurrentValueAndWaitForNewOperand() {
    currentValue = null;
    fractionalDigits = null;
  }

  function getOperationResult(firstOperand, secondOperand, operation) {
    var result;

    switch (operation) {
      case ADDITION:
        result = firstOperand + secondOperand;
        break;
      case SUBTRACTION:
        result = firstOperand - secondOperand;
        break;
      case MULTIPLICATION:
        result = firstOperand * secondOperand;
        break;
      case DIVISION:
        result = firstOperand / secondOperand;
        break;
    }

    return result;
  }

  // END GENERAL FUNCTIONS
}());