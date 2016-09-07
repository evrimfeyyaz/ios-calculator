/**
 * Created by Evrim Persembe on 9/1/16.
 */

(function () {
  "use strict";

  var firstOperand      = null;
  var secondOperand     = null;
  var currentOperator   = null;

  var lastOperand    = null;
  var lastOperation  = null;

  var operatorIsSet  = true;

  var priorityOperator  = null;
  var thirdOperand      = null;

  exports.OperationsEnum = {
    ADDITION: 0,
    SUBTRACTION: 1,
    MULTIPLICATION: 2,
    DIVISION: 3
  };

  var ADDITION        = exports.OperationsEnum.ADDITION;
  var SUBTRACTION     = exports.OperationsEnum.SUBTRACTION;
  var MULTIPLICATION  = exports.OperationsEnum.MULTIPLICATION;
  var DIVISION        = exports.OperationsEnum.DIVISION;

  // TODO: Find a better name.
  exports.inputOperand = function(number) {
    if (priorityOperator !== null) {
      thirdOperand = number;
    } else if (currentOperator === null) {
      firstOperand = number;
    } else {
      secondOperand = number;
    }

    lastOperand = number;

    operatorIsSet = false;
  };

  exports.operation = function(newOperator) {
    if (firstOperand === null) {
      firstOperand = 0;
    }

    if (isOperatorAlreadySet()) {
      if (hasPendingPriorityOperation() && isNewOperatorPriority(newOperator)) {
        setPriorityOperator(newOperator);

        return;
      }

      if (hasPendingPriorityOperation() && !isNewOperatorPriority(newOperator)) {
        removePriorityOperator();

        exports.calculate();
      }

      setOperator(newOperator);
    }

    if (hasPendingPriorityOperation()) {
      calculatePendingPriorityOperation();
    }

    if (isNewOperatorPriority(newOperator)) {
      setPriorityOperator(newOperator);

      return;
    }

    if (hasPendingOperation()) {
      exports.calculate();
    }

    setOperator(newOperator);
  };

  exports.percentage = function() {
    if (hasPendingPriorityOperation()) {
      if (thirdOperand === null) thirdOperand = secondOperand;

      thirdOperand = secondOperand * (thirdOperand / 100);

      return;
    }

    if (firstOperand !== null && currentOperator !== null) {
      if (secondOperand === null) secondOperand = firstOperand;

      secondOperand = firstOperand * (secondOperand / 100);

      return;
    }

    firstOperand /= 100;
  };

  // TODO: Rename to "getResult".
  exports.calculate = function() {
    if (firstOperand === null) {
      return 0;
    }

    if (currentOperator === null || secondOperand === null) {
      if (lastOperand !== null && lastOperation !== null) {
        firstOperand = getOperationResult(firstOperand, lastOperand, lastOperation);
      }

      return firstOperand;
    }

    if (hasPendingPriorityOperation()) {
      calculatePendingPriorityOperation();
    }

    firstOperand = getOperationResult(firstOperand, secondOperand, currentOperator);

    removeOperator();

    return firstOperand;
  };

  exports.allClear = function() {
    firstOperand      = null;
    secondOperand     = null;
    currentOperator   = null;

    lastOperand     = null;
    lastOperation   = null;

    operatorIsSet  = true;

    priorityOperator  = null;
    thirdOperand      = null;
  };

  function getOperationResult(firstOperand, secondOperand, operator) {
    switch (operator) {
      case ADDITION:
        return firstOperand + secondOperand;
      case SUBTRACTION:
        return firstOperand - secondOperand;
      case MULTIPLICATION:
        return firstOperand * secondOperand;
      case DIVISION:
        return firstOperand / secondOperand;
    }
  }

  function calculatePendingPriorityOperation() {
    secondOperand = getOperationResult(secondOperand, thirdOperand, priorityOperator);
    removePriorityOperator();
    thirdOperand = null;
  }

  function hasPendingPriorityOperation() {
    return priorityOperator !== null;
  }

  function isNewOperatorPriority(newOperator) {
    return (currentOperator === ADDITION || currentOperator === SUBTRACTION) &&
    (newOperator === MULTIPLICATION || newOperator === DIVISION);
  }

  function hasPendingOperation() {
    if (isOperatorAlreadySet()) return false;

    return (currentOperator !== null && secondOperand !== null);
  }

  function setPriorityOperator(newPriorityOperator) {
    priorityOperator = newPriorityOperator;
    lastOperation = priorityOperator;

    operatorIsSet = true;
  }

  function removePriorityOperator() {
    priorityOperator = null;
  }

  function setOperator(newOperator) {
    currentOperator = newOperator;
    lastOperation = currentOperator;

    operatorIsSet = true;
  }

  function removeOperator() {
    currentOperator = null;
  }

  // TODO: Rename to something like "expectingNumberInput".
  function isOperatorAlreadySet() {
    return operatorIsSet && currentOperator !== null;
  }
}());