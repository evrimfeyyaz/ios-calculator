/**
 * Created by Evrim Persembe on 9/1/16.
 */

(function () {
  "use strict";

  var calculator = require("./calculator.js");

  describe("Calculator", function() {
    var container;
    var displayPanel;
    var numberButtons = [];
    var addButton;
    var subtractButton;
    var multiplyButton;
    var divideButton;
    var percentButton;
    var equalsButton;
    var allClearButton;

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
      assertDisplayedNumberString("0");
    });

    it("can display pressed numberButtons", function() {
      for (var i = 1; i < 10; i++) {
        pressNumber(i);
      }
      pressNumber(0);

      assertDisplayedNumberString("1234567890");
    });

    it("doesn't display a '0' in front of numbers, even if it's pressed", function() {
      pressNumber(0);
      pressNumber(1);

      assertDisplayedNumberString("1");
    });

    it("can add two numbers", function() {
      pressNumber(5);
      pressAdd();
      pressNumber(3);

      pressEquals();

      assertDisplayedNumberString("8");
    });

    it("can subtract two numbers", function() {
      pressNumber(5);
      pressSubtract();
      pressNumber(3);

      pressEquals();

      assertDisplayedNumberString("2");
    });

    it("can multiply two numbers", function() {
      pressNumber(5);
      pressMultiply();
      pressNumber(3);

      pressEquals();

      assertDisplayedNumberString("15");
    });

    it("can divide two numbers", function() {
      pressNumber(6);
      pressDivide();
      pressNumber(3);

      pressEquals();

      assertDisplayedNumberString("2");
    });

    it("can combine additions and subtractions together", function() {
      pressNumber(5);
      pressAdd();
      pressNumber(1);
      pressNumber(0);
      pressSubtract();
      pressNumber(3);

      pressEquals();

      assertDisplayedNumberString("12");
    });

    it("can combine multiplications and divisions together", function() {
      pressNumber(5);
      pressMultiply();
      pressNumber(1);
      pressNumber(0);
      pressDivide();
      pressNumber(2);

      pressEquals();

      assertDisplayedNumberString("25");
    });

    it("can combine operands of multiple multiplications right after addition (e.g. '3+(5*6*2)')", function() {
      pressNumber(3);
      pressAdd();
      pressNumber(5);
      pressMultiply();
      pressNumber(6);
      pressMultiply();
      pressNumber(2);

      pressEquals();

      assertDisplayedNumberString("63");
    });

    it("can combine operands of multiple divisions right after subtraction (e.g. '12-(14/2/7)')", function() {
      pressNumber(1);
      pressNumber(2);
      pressSubtract();
      pressNumber(1);
      pressNumber(4);
      pressDivide();
      pressNumber(2);
      pressDivide();
      pressNumber(7);

      pressEquals();

      assertDisplayedNumberString("11");
    });

    it("can combine all four operations (e.g. '3+(5*6)+2-(10/2)'", function() {
      pressNumber(3);
      pressAdd();
      pressNumber(5);
      pressMultiply();
      pressNumber(6);
      pressAdd();
      pressNumber(2);
      pressSubtract();
      pressNumber(1);
      pressNumber(0);
      pressDivide();
      pressNumber(2);

      pressEquals();

      assertDisplayedNumberString("30");
    });

    it("can change a non-priority operation to another non-priority operation when it is already set", function() {
      pressNumber(1);
      pressNumber(0);
      pressAdd();
      pressSubtract();
      pressNumber(2);
      pressSubtract();
      pressAdd();
      pressNumber(5);

      pressEquals();

      assertDisplayedNumberString("13");
    });

    it("can change a non-priority operation to a priority operation when it is already set", function() {
      pressNumber(1);
      pressNumber(0);
      pressAdd();
      pressMultiply();
      pressNumber(2);
      pressAdd();
      pressDivide();
      pressNumber(5);

      pressEquals();

      assertDisplayedNumberString("4");
    });

    it("can change a priority operation to non-priority operation when it is already set", function() {
      pressNumber(8);
      pressAdd();
      pressNumber(5);
      pressMultiply();
      pressAdd();
      pressNumber(1);
      pressNumber(0);

      pressEquals();

      assertDisplayedNumberString("23");
    });

    it("can change a priority operation to another priority operation when it is already set", function() {
      pressNumber(8);
      pressAdd();
      pressNumber(1);
      pressNumber(0);
      pressMultiply();
      pressDivide();
      pressNumber(2);

      pressEquals();

      assertDisplayedNumberString("13");
    });

    it("repeats the last operation when repeatedly asked for the calculated result (e.g. 5,*,2,=,= is '5*2*2')", function() {
      pressNumber(5);
      pressMultiply();
      pressNumber(2);

      pressEquals();
      pressEquals();

      assertDisplayedNumberString("20");
    });

    it("repeats the last priority operation when repeatedly asked for the calculated result (e.g. 5,+,6,*,5,=,= is '(5+(6*5))*5", function() {
      pressNumber(5);
      pressAdd();
      pressNumber(6);
      pressMultiply();
      pressNumber(5);

      pressEquals();
      pressEquals();

      assertDisplayedNumberString("175");
    });

    it("doesn't create a priority operation if the result was already calculated (e.g. 5,+,6,*,5,=,*,2,= is '(5+(6*5))*2", function() {
      pressNumber(5);
      pressAdd();
      pressNumber(6);
      pressMultiply();
      pressNumber(5);
      pressEquals();
      pressMultiply();
      pressNumber(2);

      pressEquals();

      assertDisplayedNumberString("70");
    });

    it("repeats the operation on the same number when repeatedly set the same operation (e.g. 5,*,=,= is '5*5*5", function() {
      pressNumber(5);
      pressMultiply();

      pressEquals();
      pressEquals();

      assertDisplayedNumberString("125");
    });

    it("uses 0 as the first operand if it isn't set", function() {
      pressMultiply();
      pressNumber(5);
      pressAdd();
      pressNumber(2);

      pressEquals();

      assertDisplayedNumberString("2");
    });

    it("clears last operand and operation memory when asked to 'all clear'", function() {
      pressNumber(5);
      pressAdd();
      pressNumber(1);
      pressNumber(0);
      pressEquals();
      pressAllClear();

      pressEquals();

      assertDisplayedNumberString("0");
    });

    it("calculates the percentage of the last operand when asked after putting both operands", function() {
      pressNumber(1);
      pressNumber(2);
      pressAdd();
      pressNumber(5);
      pressNumber(0);
      pressPercent();

      pressEquals();

      assertDisplayedNumberString("18");
    });

    it("calculates the percentage of the first operand when asked after only putting the first operand and operator", function() {
      pressNumber(1);
      pressNumber(0);
      pressAdd();
      pressPercent();

      pressEquals();

      assertDisplayedNumberString("11");
    });

    it("outputs 0 when the percentage is asked without inputting any operand or operator and asking for the result", function() {
      pressPercent();

      pressEquals();

      assertDisplayedNumberString("0");
    });

    it("calculates the percentage of the second operand when asked for the percentage with a third operand and a priority operator", function() {
      pressNumber(5);
      pressAdd();
      pressNumber(6);
      pressMultiply();
      pressNumber(5);
      pressNumber(0);
      pressPercent();

      pressEquals();

      assertDisplayedNumberString("23");
    });

    it("uses the second operand as the third operand too when asked for the percentage with a priority operation, but no third operand", function() {
      pressNumber(5);
      pressAdd();
      pressNumber(1);
      pressNumber(0);
      pressMultiply();
      pressPercent();

      pressEquals();

      assertDisplayedNumberString("15");
    });

    it("turns the number to a percentage when there is no operation set", function() {
      pressNumber(2);
      pressNumber(0);
      pressNumber(0);
      pressPercent();

      pressEquals();

      assertDisplayedNumberString("2");
    });

    it("returns the number itself when only one operand and no operation is input", function() {
      pressNumber(1);
      pressNumber(0);

      pressEquals();

      assertDisplayedNumberString("10");
    });

    xit("pushes a result notification when an intermediate result is calculated when a priority operation is set");

    xit("pushes a notification when an intermediate or end result is calculated");

    xit("doesn't push a result notification when a priority operation is set, and there is no intermediate result");

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

      percentButton   = createElementInContainer("button");

      equalsButton    = createElementInContainer("button");
      allClearButton  = createElementInContainer("button");
    }

    function initializeCalculator() {
      calculator.initialize({
        displayPanel: displayPanel,
        numberButtons: numberButtons,
        addButton: addButton,
        subtractButton: subtractButton,
        multiplyButton: multiplyButton,
        divideButton: divideButton,
        percentButton: percentButton,
        equalsButton: equalsButton,
        allClearButton: allClearButton
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

    function displayedNumberString() {
      return displayPanel.innerHTML;
    }

    function pressNumber(number) {
      numberButtons[number].click();
    }

    function pressAdd() {
      addButton.click();
    }

    function pressSubtract() {
      subtractButton.click();
    }

    function pressMultiply() {
      multiplyButton.click();
    }

    function pressDivide() {
      divideButton.click();
    }

    function pressPercent() {
      percentButton.click();
    }

    function pressEquals() {
      equalsButton.click();
    }

    function pressAllClear() {
      allClearButton.click();
    }

    function assertDisplayedNumberString(numberString) {
      assert.equal(displayedNumberString(), numberString);
    }
  });
}());