/**
 * Created by Evrim Persembe on 9/1/16.
 */

(function () {
  "use strict";

  var calculator = require("./calculator.js");

  describe("Calculator", function() {
    describe("can do basic operations, such as", function() {
      afterEach(function() {
        calculator.allClear();
      });

      it("adding two numbers", function() {
        calculator.inputOperand(5);
        calculator.setOperator(calculator.OperatorsEnum.ADDITION);
        calculator.inputOperand(6);

        var result = calculator.compute();

        assert.equal(result, 11);
      });

      it("subtracting two numbers", function() {
        calculator.inputOperand(7);
        calculator.setOperator(calculator.OperatorsEnum.SUBTRACTION);
        calculator.inputOperand(10);

        var result = calculator.compute();

        assert.equal(result, -3);
      });

      it("multiplying two numbers", function() {
        calculator.inputOperand(4);
        calculator.setOperator(calculator.OperatorsEnum.MULTIPLICATION);
        calculator.inputOperand(9);

        var result = calculator.compute();

        assert.equal(result, 36);
      });

      it("dividing two numbers", function() {
        calculator.inputOperand(10);
        calculator.setOperator(calculator.OperatorsEnum.DIVISION);
        calculator.inputOperand(2);

        var result = calculator.compute();

        assert.equal(result, 5);
      });
    });
  });
}());