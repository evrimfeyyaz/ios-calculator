/**
 * Created by Evrim Persembe on 9/1/16.
 */

(function () {
  "use strict";

  var firstOperand  = null;
  var secondOperand = null;
  var operator      = null;

  var OperatorsEnum = {
    ADDITION: 0,
    SUBTRACTION: 1,
    MULTIPLICATION: 2,
    DIVISION: 3
  };
  exports.OperatorsEnum = OperatorsEnum;

  exports.inputOperand = function(number) {
    if (operator === null) {
      firstOperand = number;
    } else {
      secondOperand = number;
    }
  };

  exports.setOperator = function(operatorEnum) {
    operator = operatorEnum;
  };

  exports.compute = function() {
    switch (operator) {
      case OperatorsEnum.ADDITION:
        return firstOperand + secondOperand;
      case OperatorsEnum.SUBTRACTION:
        return firstOperand - secondOperand;
      case OperatorsEnum.MULTIPLICATION:
        return firstOperand * secondOperand;
      case OperatorsEnum.DIVISION:
        return firstOperand / secondOperand;
    }
  };

  exports.allClear = function() {
    firstOperand  = null;
    secondOperand = null;
    operator      = null;
  };
}());