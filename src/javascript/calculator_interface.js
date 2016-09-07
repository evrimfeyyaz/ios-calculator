/**
 * Created by Evrim Persembe on 9/6/16.
 */

(function () {
  "use strict";

  var calculator = require("./calculator.js");

  var opts, currentValue;

  exports.initialize = function(options) {
    resetValues();

    opts = options;

    opts.numberButtons.forEach(function(numberButton) {
      numberButton.addEventListener("click", numberButtonClickHandler);
    });

    opts.addButton.addEventListener("click", addButtonClickHandler);
    opts.subtractButton.addEventListener("click", subtractButtonClickHandler);
    opts.multiplyButton.addEventListener("click", multiplyButtonClickHandler);
    opts.divideButton.addEventListener("click", divideButtonClickHandler);

    opts.equalsButton.addEventListener("click", equalsButtonClickHandler);

    displayCurrentValue();
  };

  exports.terminate = function() {
    resetValues();
  };

  function numberButtonClickHandler(e) {
    var numberButton  = e.currentTarget;
    var numberValue   = +numberButton.dataset.value;

    currentValue = (currentValue * 10) + numberValue;
    displayCurrentValue();
  }

  function addButtonClickHandler() {
    operationButtonClick(calculator.OperationsEnum.ADDITION);
  }

  function subtractButtonClickHandler() {
    operationButtonClick(calculator.OperationsEnum.SUBTRACTION);
  }

  function multiplyButtonClickHandler() {
    operationButtonClick(calculator.OperationsEnum.MULTIPLICATION);
  }

  function divideButtonClickHandler() {
    operationButtonClick(calculator.OperationsEnum.DIVISION);
  }

  function equalsButtonClickHandler() {
    calculator.inputOperand(currentValue);
    currentValue = calculator.calculate();

    displayCurrentValue();
  }

  function operationButtonClick(operation) {
    calculator.inputOperand(currentValue);
    calculator.operation(operation);

    currentValue = 0;
  }

  function resetValues() {
    opts = {};
    currentValue = 0;

    calculator.allClear();
  }

  function displayCurrentValue() {
    opts.displayPanel.innerHTML = currentValue;
  }
}());