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

  describe("Calculator interface", function() {
    var container,
      displayPanel,
      numberButtons = [],
      addButton,
      subtractButton,
      multiplyButton,
      divideButton,
      equalsButton
      ;

    beforeEach(function() {
      container = document.createElement("div");
      document.body.appendChild(container);

      createDOMElementsForCalculator();
      initializeCalculator();
    });

    afterEach(function() {
      removeElement(container);

      calculator.terminate();
    });

    it("displays '0' when first started", function() {
      assert.equal(displayedNumber(), "0");
    });

    it("can display pressed numberButtons", function() {
      for (var i = 1; i < 10; i++) {
        numberButtons[i].click();
      }
      numberButtons[0].click();

      assert.equal(displayedNumber(), "1234567890");
    });

    it("doesn't display a '0' in front of numbers, even if it's pressed", function() {
      numberButtons[0].click();
      numberButtons[1].click();

      assert.equal(displayedNumber(), "1");
    });

    it("can add two numbers", function() {
      numberButtons[5].click();
      addButton.click();
      numberButtons[3].click();

      equalsButton.click();

      assert.equal(displayedNumber(), "8");
    });

    it("can subtract two numbers", function() {
      numberButtons[5].click();
      subtractButton.click();
      numberButtons[3].click();

      equalsButton.click();

      assert.equal(displayedNumber(), "2");
    });

    it("can multiply two numbers", function() {
      numberButtons[5].click();
      multiplyButton.click();
      numberButtons[3].click();

      equalsButton.click();

      assert.equal(displayedNumber(), "15");
    });

    it("can divide two numbers", function() {
      numberButtons[6].click();
      divideButton.click();
      numberButtons[3].click();

      equalsButton.click();

      assert.equal(displayedNumber(), "2");
    });

    it("can change operators even after the user has already set one");

    it("can repeat the last operation when clicked on equals after the first time");

    // Helper functions

    function createDOMElementsForCalculator() {
      displayPanel = createElementInContainer("div");

      for (var i = 0; i < 10; i++) {
        numberButtons[i] = createElementInContainer("button");
        numberButtons[i].dataset.value = i;
      }

      addButton       = createElementInContainer("button");
      subtractButton  = createElementInContainer("button");
      multiplyButton  = createElementInContainer("button");
      divideButton    = createElementInContainer("button");

      equalsButton = createElementInContainer("button");
    }

    function initializeCalculator() {
      calculator.initialize({
        displayPanel: displayPanel,
        numberButtons: numberButtons,
        addButton: addButton,
        subtractButton: subtractButton,
        multiplyButton: multiplyButton,
        divideButton: divideButton,
        equalsButton: equalsButton
      });
    }

    function createElementInContainer(tagName) {
      var element = document.createElement(tagName);
      container.appendChild(element);

      return element;
    }

    function removeElement(element) {
      element.parentNode.removeChild(element);
    }

    function displayedNumber() {
      return displayPanel.innerHTML;
    }
  });

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

    it("uses 0 as the first operand if it isn't set", function() {
      calculator.operation(MULTIPLICATION);
      calculator.inputOperand(5);
      calculator.operation(ADDITION);
      calculator.inputOperand(2);

      var result = calculator.calculate();

      assert.equal(result, 2);
    });

    it("clears last operand and operation memory when asked to 'all clear'", function() {
      calculator.inputOperand(5);
      calculator.operation(ADDITION);
      calculator.inputOperand(10);
      calculator.calculate();
      calculator.allClear();

      var result = calculator.calculate();

      assert.equal(result, 0);
    });

    it("calculates the percentage of the last operand when asked after putting both operands", function() {
      calculator.inputOperand(12);
      calculator.operation(ADDITION);
      calculator.inputOperand(50);
      calculator.percentage();

      var result = calculator.calculate();

      assert.equal(result, 18);
    });

    it("calculates the percentage of the first operand when asked after only putting the first operand and operator", function() {
      calculator.inputOperand(10);
      calculator.operation(ADDITION);
      calculator.percentage();

      var result = calculator.calculate();

      assert.equal(result, 11);
    });

    it("outputs 0 when the percentage is asked without inputting any operand or operator and asking for the result", function() {
      calculator.percentage();

      var result = calculator.calculate();

      assert.equal(result, 0);
    });

    it("calculates the percentage of the second operand when asked for the percentage with a third operand and a priority operator", function() {
      calculator.inputOperand(5);
      calculator.operation(ADDITION);
      calculator.inputOperand(6);
      calculator.operation(MULTIPLICATION);
      calculator.inputOperand(50);
      calculator.percentage();

      var result = calculator.calculate();

      assert.equal(result, 23);
    });

    it("uses the second operand as the third operand too when asked for the percentage with a priority operation, but no third operand", function() {
      calculator.inputOperand(5);
      calculator.operation(ADDITION);
      calculator.inputOperand(10);
      calculator.operation(MULTIPLICATION);
      calculator.percentage();

      var result = calculator.calculate();

      assert.equal(result, 15);
    });

    it("turns the number to a percentage when there is no operation set", function() {
      calculator.inputOperand(200);
      calculator.percentage();

      var result = calculator.calculate();

      assert.equal(result, 2);
    });

    it("returns the number itself when only one operand and no operation is input", function() {
      calculator.inputOperand(10);

      var result = calculator.calculate();

      assert.equal(result, 10);
    });

    it("pushes a result notification when an intermediate result is calculated when a priority operation is set");

    it("pushes a notification when an intermediate or end result is calculated");

    it("doesn't push a result notification when a priority operation is set, and there is no intermediate result");
  });
}());