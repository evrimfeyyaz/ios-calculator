/**
 * Created by Evrim Persembe on 9/1/16.
 */

(function () {
  "use strict";

  var calculator = require("./calculator.js");

  var ADDITION = calculator.OperationsEnum.ADDITION;
  var SUBTRACTION = calculator.OperationsEnum.SUBTRACTION;
  var MULTIPLICATION = calculator.OperationsEnum.MULTIPLICATION;
  var DIVISION = calculator.OperationsEnum.DIVISION;

  describe("Calculator", function() {
    afterEach(function() {
      calculator.allClear();
    });

    it("can add two numbers", function() {
      calculator.inputOperand(5);
      calculator.operation(ADDITION);
      calculator.inputOperand(6);

      var result = calculator.calculate();

      assert.equal(result, 11);
    });

    it("can subtract two numbers", function() {
      calculator.inputOperand(7);
      calculator.operation(SUBTRACTION);
      calculator.inputOperand(10);

      var result = calculator.calculate();

      assert.equal(result, -3);
    });

    it("can multiply two numbers", function() {
      calculator.inputOperand(4);
      calculator.operation(MULTIPLICATION);
      calculator.inputOperand(9);

      var result = calculator.calculate();

      assert.equal(result, 36);
    });

    it("can divide two numbers", function() {
      calculator.inputOperand(10);
      calculator.operation(DIVISION);
      calculator.inputOperand(2);

      var result = calculator.calculate();

      assert.equal(result, 5);
    });

    it("can combine additions and subtractions together", function() {
      calculator.inputOperand(5);
      calculator.operation(ADDITION);
      calculator.inputOperand(10);
      calculator.operation(SUBTRACTION);
      calculator.inputOperand(3);

      var result = calculator.calculate();

      assert.equal(result, 12);
    });

    it("can combine multiplications and divisions together", function() {
      calculator.inputOperand(5);
      calculator.operation(MULTIPLICATION);
      calculator.inputOperand(10);
      calculator.operation(DIVISION);
      calculator.inputOperand(2);

      var result = calculator.calculate();

      assert.equal(result, 25);
    });

    it("can combine operands of multiple multiplication right after addition (e.g. '3+(5*6*2)')", function() {
      calculator.inputOperand(3);
      calculator.operation(ADDITION);
      calculator.inputOperand(5);
      calculator.operation(MULTIPLICATION);
      calculator.inputOperand(6);
      calculator.operation(MULTIPLICATION);
      calculator.inputOperand(2);

      var result = calculator.calculate();

      assert.equal(result, 63);
    });

    it("can combine operands of multiple divisions right after subtraction (e.g. '12-(14/2/7)')", function() {
      calculator.inputOperand(12);
      calculator.operation(SUBTRACTION);
      calculator.inputOperand(14);
      calculator.operation(DIVISION);
      calculator.inputOperand(2);
      calculator.operation(DIVISION);
      calculator.inputOperand(7);

      var result = calculator.calculate();

      assert.equal(result, 11);
    });

    it("can combine all four operations (e.g. '3+(5*6)+2-(10/2)'", function() {
      calculator.inputOperand(3);
      calculator.operation(ADDITION);
      calculator.inputOperand(5);
      calculator.operation(MULTIPLICATION);
      calculator.inputOperand(6);
      calculator.operation(ADDITION);
      calculator.inputOperand(2);
      calculator.operation(SUBTRACTION);
      calculator.inputOperand(10);
      calculator.operation(DIVISION);
      calculator.inputOperand(2);

      var result = calculator.calculate();

      assert.equal(result, 30);
    });

    it("can change a non-priority operation to another non-priority operation when it is already set", function() {
      calculator.inputOperand(10);
      calculator.operation(ADDITION);
      calculator.operation(SUBTRACTION);
      calculator.inputOperand(2);
      calculator.operation(SUBTRACTION);
      calculator.operation(ADDITION);
      calculator.inputOperand(5);

      var result = calculator.calculate();

      assert.equal(result, 13);
    });

    it("can change a non-priority operation to a priority operation when it is already set", function() {
      calculator.inputOperand(10);
      calculator.operation(ADDITION);
      calculator.operation(MULTIPLICATION);
      calculator.inputOperand(2);
      calculator.operation(ADDITION);
      calculator.operation(DIVISION);
      calculator.inputOperand(5);

      var result = calculator.calculate();

      assert.equal(result, 4);
    });

    it("can change a priority operation to non-priority operation when it is already set", function() {
      calculator.inputOperand(8);
      calculator.operation(ADDITION);
      calculator.inputOperand(5);
      calculator.operation(MULTIPLICATION);
      calculator.operation(ADDITION);
      calculator.inputOperand(10);

      var result = calculator.calculate();

      assert.equal(result, 23);
    });

    it("can change a priority operation to another priority operation when it is already set", function() {
      calculator.inputOperand(8);
      calculator.operation(ADDITION);
      calculator.inputOperand(10);
      calculator.operation(MULTIPLICATION);
      calculator.operation(DIVISION);
      calculator.inputOperand(2);

      var result = calculator.calculate();

      assert.equal(result, 13);
    });

    it("repeats the last operation when repeatedly asked for the calculated result (e.g. 5,*,2,=,= is '5*2*2')", function() {
      calculator.inputOperand(5);
      calculator.operation(MULTIPLICATION);
      calculator.inputOperand(2);
      calculator.calculate();

      var result = calculator.calculate();

      assert.equal(result, 20);
    });

    it("repeats the last priority operation when repeatedly asked for the calculated result (e.g. 5,+,6,*,5,=,= is '(5+(6*5))*5", function() {
      calculator.inputOperand(5);
      calculator.operation(ADDITION);
      calculator.inputOperand(6);
      calculator.operation(MULTIPLICATION);
      calculator.inputOperand(5);
      calculator.calculate();

      var result = calculator.calculate();

      assert.equal(result, 175);
    });

    it("doesn't create a priority operation if the result was already calculated (e.g. 5,+,6,*,5,=,*,2,= is '(5+(6*5))*2", function() {
      calculator.inputOperand(5);
      calculator.operation(ADDITION);
      calculator.inputOperand(6);
      calculator.operation(MULTIPLICATION);
      calculator.inputOperand(5);
      calculator.calculate();
      calculator.operation(MULTIPLICATION);
      calculator.inputOperand(2);

      var result = calculator.calculate();

      assert.equal(result, 70);
    });

    it("repeats the operation on the same number when repeatedly set the same operation (e.g. 5,*,=,= is '5*5*5", function() {
      calculator.inputOperand(5);
      calculator.operation(MULTIPLICATION);
      calculator.calculate();

      var result = calculator.calculate();

      assert.equal(result, 125);
    });

    it("pushes a result notification when an intermediate result is calculated when a priority operation is set");

    it("uses 0 as the first operand if it isn't set", function() {
      calculator.operation(MULTIPLICATION);
      calculator.inputOperand(5);
      calculator.operation(ADDITION);
      calculator.inputOperand(2);

      var result = calculator.calculate();

      assert.equal(result, 2);
    });

    it("clears last operand and operation memory when asked to 'all clear'");

    it("pushes a notification when an intermediate or end result is calculated");

    it("doesn't push a result notification when a priority operation is set, but there is no intermediate result");
  });
}());