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

    it("can do combine operands of multiple multiplication right after addition (e.g. '3+(5*6)')", function() {
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

    it("can do combine operands of division right after subtraction (e.g. '12-(6/2)')", function() {
      calculator.inputOperand(12);
      calculator.setOperator(calculator.OperatorsEnum.SUBTRACTION);
      calculator.inputOperand(6);
      calculator.setOperator(calculator.OperatorsEnum.DIVISION);
      calculator.inputOperand(2);

      var result = calculator.compute();

      assert.equal(result, 9);
    });

    it("can change operation when it already has a chosen operation");
  });
}());