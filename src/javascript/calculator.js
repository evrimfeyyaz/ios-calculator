/**
 * Created by Evrim Persembe on 9/1/16.
 */

(function () {
  "use strict";

  var firstOperand      = null;
  var secondOperand     = null;
  var currentOperator   = null;

  var lastOperand   = null;
  var lastOperation  = null;

  var isOperatorAlreadySet  = true;

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

    isOperatorAlreadySet = false;
  };

  exports.operation = function(newOperator) {
    if (isOperatorAlreadySet) {
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

  exports.calculate = function() {
    if (currentOperator === null || secondOperand === null) {
      firstOperand = getOperationResult(firstOperand, lastOperand, lastOperation);

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
    if (isOperatorAlreadySet) return false;

    return (currentOperator !== null && secondOperand !== null);
  }

  function setPriorityOperator(newPriorityOperator) {
    priorityOperator = newPriorityOperator;
    lastOperation = priorityOperator;

    isOperatorAlreadySet = true;
  }

  function removePriorityOperator() {
    priorityOperator = null;
  }

  function setOperator(newOperator) {
    currentOperator = newOperator;
    lastOperation = currentOperator;

    isOperatorAlreadySet = true;
  }

  function removeOperator() {
    currentOperator = null;
  }
}());