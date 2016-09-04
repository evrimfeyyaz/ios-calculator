/**
 * Created by Evrim Persembe on 9/1/16.
 */

(function () {
  "use strict";

  var calculator = require("./calculator.js");

  describe("Calculator", function() {
    afterEach(function() {
      calculator.allClear();
    });

    it("can add two numbers", function() {
      calculator.inputOperand(5);
      calculator.setOperator(calculator.OperatorsEnum.ADDITION);
      calculator.inputOperand(6);

      var result = calculator.compute();

      assert.equal(result, 11);
    });

    it("can subtract two numbers", function() {
      calculator.inputOperand(7);
      calculator.setOperator(calculator.OperatorsEnum.SUBTRACTION);
      calculator.inputOperand(10);

      var result = calculator.compute();

      assert.equal(result, -3);
    });

    it("can multiply two numbers", function() {
      calculator.inputOperand(4);
      calculator.setOperator(calculator.OperatorsEnum.MULTIPLICATION);
      calculator.inputOperand(9);

      var result = calculator.compute();

      assert.equal(result, 36);
    });

    it("can divide two numbers", function() {
      calculator.inputOperand(10);
      calculator.setOperator(calculator.OperatorsEnum.DIVISION);
      calculator.inputOperand(2);

      var result = calculator.compute();

      assert.equal(result, 5);
    });

    it("can combine additions and subtractions together", function() {
      calculator.inputOperand(5);
      calculator.setOperator(calculator.OperatorsEnum.ADDITION);
      calculator.inputOperand(10);
      calculator.setOperator(calculator.OperatorsEnum.SUBTRACTION);
      calculator.inputOperand(3);

      var result = calculator.compute();

      assert.equal(result, 12);
    });

    it("can combine multiplications and divisions together", function() {
      calculator.inputOperand(5);
      calculator.setOperator(calculator.OperatorsEnum.MULTIPLICATION);
      calculator.inputOperand(10);
      calculator.setOperator(calculator.OperatorsEnum.DIVISION);
      calculator.inputOperand(2);

      var result = calculator.compute();

      assert.equal(result, 25);
    });

    it("can combine operands of multiple multiplication right after addition (e.g. '3+(5*6*2)')", function() {
      calculator.inputOperand(3);
      calculator.setOperator(calculator.OperatorsEnum.ADDITION);
      calculator.inputOperand(5);
      calculator.setOperator(calculator.OperatorsEnum.MULTIPLICATION);
      calculator.inputOperand(6);
      calculator.setOperator(calculator.OperatorsEnum.MULTIPLICATION);
      calculator.inputOperand(2);

      var result = calculator.compute();

      assert.equal(result, 63);
    });

    it("can combine operands of multiple divisions right after subtraction (e.g. '12-(14/2/7)')", function() {
      calculator.inputOperand(12);
      calculator.setOperator(calculator.OperatorsEnum.SUBTRACTION);
      calculator.inputOperand(14);
      calculator.setOperator(calculator.OperatorsEnum.DIVISION);
      calculator.inputOperand(2);
      calculator.setOperator(calculator.OperatorsEnum.DIVISION);
      calculator.inputOperand(7);

      var result = calculator.compute();

      assert.equal(result, 11);
    });

    it("can combine all four operations (e.g. '3+(5*6)+2-(10/2)'", function() {
      calculator.inputOperand(3);
      calculator.setOperator(calculator.OperatorsEnum.ADDITION);
      calculator.inputOperand(5);
      calculator.setOperator(calculator.OperatorsEnum.MULTIPLICATION);
      calculator.inputOperand(6);
      calculator.setOperator(calculator.OperatorsEnum.ADDITION);
      calculator.inputOperand(2);
      calculator.setOperator(calculator.OperatorsEnum.SUBTRACTION);
      calculator.inputOperand(10);
      calculator.setOperator(calculator.OperatorsEnum.DIVISION);
      calculator.inputOperand(2);

      var result = calculator.compute();

      assert.equal(result, 30);
    });

    it("can change the operation when it is already set");

    it("can change the priority operation when it is already set");

    it("repeats the last operation when repeatedly asked for the computation (e.g. 5,*,2,=,= is '5*2*2*2')");

    it("repeats the operation on the same number when repeatedly set the same operation (e.g. 5,*,=,= is '5*5*5*5");

    it("can clear the operand when there is no operation set");

    it("can clear the operand when there is an operation set");

    it("can clear the operand when there is a priority operation set");

    it("pushes a notification when an intermediate or end result is calculated");

    it("doesn't push a result notification when a priority operation is set, but there is no intermediate result");

    it("pushes a result notification when an intermediate result is calculated when a priority operation is set");
  });
}());