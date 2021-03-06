/**
 * Created by Evrim Persembe on 9/1/16.
 */

(function () {
  "use strict";

  var Decimal = require("decimal.js");

  var ADDITION        = 0;
  var SUBTRACTION     = 1;
  var MULTIPLICATION  = 2;
  var DIVISION        = 3;

  var AC  = "AC";
  var C   = "C";

  var opts;

  var firstOperand;
  var secondOperand;
  var operation;
  var fractionalDigits;
  var lastOperand;
  var lastOperation;
  var waitingForOperand;
  var priorityOperation;
  var thirdOperand;
  var currentValue;
  var clearButtonFunctionality;

  exports.initialize = function(options) {
    initializeProperties();

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

  function initializeProperties() {
    firstOperand              = null;
    secondOperand             = null;
    operation                 = null;
    fractionalDigits          = null;
    lastOperand               = null;
    lastOperation             = null;
    waitingForOperand         = true;
    priorityOperation         = null;
    thirdOperand              = null;
    currentValue              = null;
    clearButtonFunctionality  = "AC";
  }

  // BEGIN EVENT HANDLERS

  function numberButtonClickHandler(e) {
    var numberButton  = e.currentTarget;
    var numberValue   = new Decimal(numberButton.dataset.value);

    if (currentValue === null) currentValue = new Decimal(0);

    if (fractionalDigits === null) {
      currentValue = currentValue.times(10).plus(numberValue);

      displayCurrentValue();
    } else {
      currentValue = currentValue.plus(numberValue.dividedBy(Decimal.pow(10, fractionalDigits)));

      displayCurrentValue(fractionalDigits);

      fractionalDigits++;
    }

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

      var value = currentValue === null ? new Decimal(0) : currentValue;

      displayString(formatNumberString(value.toString()) + ".");
    }
  }

  function changeSignButtonClickHandler() {
    if (currentValue !== null) {
      currentValue = currentValue.negated();
      displayCurrentValue();
    } else {
      firstOperand = firstOperand.negated();
      displayNumber(firstOperand);
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
      firstOperand = new Decimal(0);
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

    displayNumber(secondOperand);
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

    return number.times(percent.dividedBy(100));
  }

  function calculatePercentage() {
    var displayValue;

    if (hasPendingPriorityOperation()) {
      thirdOperand = getPercentage(secondOperand, thirdOperand);
      displayValue = thirdOperand;
    } else if (firstOperand !== null && operation !== null) {
      secondOperand = getPercentage(firstOperand, secondOperand);
      displayValue = secondOperand;
    } else {
      if (firstOperand === null) firstOperand = new Decimal(0);
      firstOperand = firstOperand.dividedBy(100);
      displayValue = firstOperand;
    }

    lastOperand = displayValue;
    displayNumber(displayValue);
  }

  // END PERCENT OPERATION FUNCTIONS


  // BEGIN CLEAR FUNCTIONS

  function allClear() {
    initializeProperties();
  }

  function getClearButtonFunctionality() {
    return clearButtonFunctionality;
  }

  function setClearButtonFunctionality(functionality) {
    clearButtonFunctionality = functionality;
    opts.onClearButtonFunctionalityChange(functionality);
  }

  // END CLEAR FUNCTIONS


  // BEGIN DISPLAY FUNCTIONS

  function displayCurrentValue(toFixed) {
    var value = currentValue === null ? new Decimal(0) : currentValue;

    displayNumber(value, toFixed);
  }

  function displayNumber(number, toFixed) {
    if (toFixed !== undefined && toFixed !== null) {
      displayString(formatNumberString(number.toFixed(toFixed).toString()));
    } else {
      displayString(formatNumberString(number.toString()));
    }
  }

  function displayString(stringValue) {
    opts.onDisplayValueUpdate(stringValue);
  }

  function formatNumberString(numberString) {
    return numberStringWithCommas(numberString);
  }

  // Adapted from a snippet by Elias Zamaria: http://stackoverflow.com/a/2901298
  function numberStringWithCommas(numberString) {
    var parts = numberString.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }

  // END DISPLAY FUNCTIONS


  // BEGIN GENERAL FUNCTIONS

  function calculateResult() {
    if (firstOperand === null) {
      displayNumber(0);

      return 0;
    }

    if (operation === null || secondOperand === null) {
      if (lastOperand !== null && lastOperation !== null) {
        firstOperand = getOperationResult(firstOperand, lastOperand, lastOperation);
      }

      displayNumber(firstOperand);

      return firstOperand;
    }

    if (hasPendingPriorityOperation()) {
      calculatePendingPriorityOperation();
    }

    firstOperand = getOperationResult(firstOperand, secondOperand, operation);

    removeOperation();
    secondOperand = null;

    displayNumber(firstOperand);

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
        result = firstOperand.plus(secondOperand);
        break;
      case SUBTRACTION:
        result = firstOperand.minus(secondOperand);
        break;
      case MULTIPLICATION:
        result = firstOperand.times(secondOperand);
        break;
      case DIVISION:
        result = firstOperand.dividedBy(secondOperand);
        break;
    }

    return result;
  }

  // END GENERAL FUNCTIONS
}());