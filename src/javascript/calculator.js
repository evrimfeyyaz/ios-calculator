/**
 * Created by Evrim Persembe on 9/1/16.
 */

(function () {
  "use strict";

  var firstOperand      = null;
  var secondOperand     = null;
  var currentOperator   = null;

  var priorityOperator  = null;
  var thirdOperand      = null;

  exports.OperatorsEnum = {
    ADDITION: 0,
    SUBTRACTION: 1,
    MULTIPLICATION: 2,
    DIVISION: 3
  };

  var ADDITION        = exports.OperatorsEnum.ADDITION;
  var SUBTRACTION     = exports.OperatorsEnum.SUBTRACTION;
  var MULTIPLICATION  = exports.OperatorsEnum.MULTIPLICATION;
  var DIVISION        = exports.OperatorsEnum.DIVISION;

  exports.inputOperand = function(number) {
    if (priorityOperator !== null) {
      thirdOperand = number;
    } else if (currentOperator === null) {
      firstOperand = number;
    } else {
      secondOperand = number;
    }
  };

  exports.setOperator = function(newOperator) {
    if (priorityOperator !== null) {
      secondOperand = getOperationResult(secondOperand, thirdOperand, priorityOperator);
      thirdOperand = null;
    }

    if ((currentOperator === ADDITION || currentOperator === SUBTRACTION) &&
      (newOperator === MULTIPLICATION || newOperator === DIVISION)) {
      priorityOperator = newOperator;
    } else {
      if (currentOperator !== null) {
        firstOperand = exports.compute();
        secondOperand = null;
      }

      currentOperator = newOperator;
    }
  };

  exports.compute = function() {
    if (priorityOperator !== null) {
      secondOperand = getOperationResult(secondOperand, thirdOperand, priorityOperator);
    }

    return getOperationResult(firstOperand, secondOperand, currentOperator);
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
}());