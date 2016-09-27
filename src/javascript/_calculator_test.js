/**
 * Created by Evrim Persembe on 9/1/16.
 */

(function () {
  "use strict";

  var calculator = require("./calculator.js");

  describe("Calculator", function() {
    var container;
    var displayPanel;
    var numberButtons;
    var addButton;
    var subtractButton;
    var multiplyButton;
    var divideButton;
    var percentButton;
    var decimalButton;
    var changeSignButton;
    var equalsButton;
    var clearButton;
    var displayValueUpdated;
    var clearButtonFunctionalityChanged;

    beforeEach(function() {
      container = document.createElement("div");
      document.body.appendChild(container);

      displayValueUpdated = sinon.spy();
      clearButtonFunctionalityChanged = sinon.spy();

      createDOMElementsForCalculator();
      initializeCalculator();
    });

    afterEach(function() {
      removeElement(container);

      calculator.terminate();
    });

    // BEGIN BASIC FUNCTIONALITY TESTS

    it("displays '0' when first started", function() {
      assertCurrentDisplayValue("0");
    });

    it("can display pressed number buttons", function() {
      for (var i = 1; i < 10; i++) {
        pressNumber(i);
      }
      pressNumber(0);

      assertCurrentDisplayValue("1,234,567,890");
    });

    it("doesn't display a '0' in front of numbers, even if it's pressed", function() {
      pressNumber(0);
      pressNumber(1);

      assertCurrentDisplayValue("1");
    });

    it("comma separates thousands", function() {
      pressNumber(1);
      pressNumber(2);
      pressNumber(3);
      pressNumber(4);
      pressNumber(5);
      pressNumber(6);
      pressNumber(7);

      assertCurrentDisplayValue("1,234,567");
    });

    it("comma separates values after putting a decimal point", function() {
      pressNumber(1);
      pressNumber(2);
      pressNumber(3);
      pressNumber(4);
      pressDecimal();

      assertCurrentDisplayValue("1,234.");
    });

    // END BASIC FUNCTIONALITY TESTS


    // BEGIN BASIC FOUR OPERATIONS TESTS

    it("can add two numbers", function() {
      pressNumber(5);
      pressAdd();
      pressNumber(3);

      pressEquals();

      assertCurrentDisplayValue("8");
    });

    it("can subtract two numbers", function() {
      pressNumber(5);
      pressSubtract();
      pressNumber(3);

      pressEquals();

      assertCurrentDisplayValue("2");
    });

    it("can multiply two numbers", function() {
      pressNumber(5);
      pressMultiply();
      pressNumber(3);

      pressEquals();

      assertCurrentDisplayValue("15");
    });

    it("can divide two numbers", function() {
      pressNumber(6);
      pressDivide();
      pressNumber(3);

      pressEquals();

      assertCurrentDisplayValue("2");
    });

    it("can combine additions and subtractions together", function() {
      pressNumber(5);
      pressAdd();
      pressNumber(1);
      pressNumber(0);
      pressSubtract();
      pressNumber(3);

      pressEquals();

      assertCurrentDisplayValue("12");
    });

    it("can combine multiplications and divisions together", function() {
      pressNumber(5);
      pressMultiply();
      pressNumber(1);
      pressNumber(0);
      pressDivide();
      pressNumber(2);

      pressEquals();

      assertCurrentDisplayValue("25");
    });

    // END BASIC FOUR OPERATIONS TESTS


    // BEGIN PRIORITY OPERATIONS TESTS

    it("can combine operands of multiple multiplications right after addition (e.g. '3+(5*6*2)')", function() {
      pressNumber(3);
      pressAdd();
      pressNumber(5);
      pressMultiply();
      pressNumber(6);
      pressMultiply();
      pressNumber(2);

      pressEquals();

      assertCurrentDisplayValue("63");
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

      assertCurrentDisplayValue("11");
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

      assertCurrentDisplayValue("30");
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

      assertCurrentDisplayValue("70");
    });

    // END PRIORITY OPERATIONS TESTS


    // BEGIN OPERATION CHANGE TESTS

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

      assertCurrentDisplayValue("13");
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

      assertCurrentDisplayValue("4");
    });

    it("can change a priority operation to a non-priority operation when it is already set", function() {
      pressNumber(8);
      pressAdd();
      pressNumber(5);
      pressMultiply();
      pressAdd();
      pressNumber(1);
      pressNumber(0);

      pressEquals();

      assertCurrentDisplayValue("23");
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

      assertCurrentDisplayValue("13");
    });

    // END OPERATION CHANGE TESTS


    // BEGIN REPEATED OPERATIONS TESTS

    it("repeats the last operation when asked for the calculated result after the first time (e.g. 5,*,2,=,= is '5*2*2')", function() {
      pressNumber(5);
      pressMultiply();
      pressNumber(2);

      pressEquals();
      pressEquals();

      assertCurrentDisplayValue("20");
    });

    it("repeats the last priority operation when asked for the calculated result after the first time (e.g. 5,+,6,*,5,=,= is '(5+(6*5))*5", function() {
      pressNumber(5);
      pressAdd();
      pressNumber(6);
      pressMultiply();
      pressNumber(5);

      pressEquals();
      pressEquals();

      assertCurrentDisplayValue("175");
    });

    it("repeats the operation on the same number when a user inputs one operand, the operation, and asks for the result (e.g. 5,*,=,= is '5*5*5", function() {
      pressNumber(5);
      pressMultiply();

      pressEquals();
      pressEquals();

      assertCurrentDisplayValue("125");
    });

    // END REPEATED OPERATIONS TESTS


    // BEGIN OPERATION EDGE CASES TESTS

    it("uses 0 as the first operand if it isn't set", function() {
      pressMultiply();
      pressNumber(5);
      pressAdd();
      pressNumber(2);

      pressEquals();

      assertCurrentDisplayValue("2");
    });

    it("returns the number itself when only one operand and no operation is input", function() {
      pressNumber(1);
      pressNumber(0);

      pressEquals();

      assertCurrentDisplayValue("10");
    });

    // END OPERATION EDGE CASES TESTS


    // BEGIN CLEAR BUTTON TESTS

    it("clears last operand and operation memory when asked to 'all clear'", function() {
      pressNumber(5);
      pressAdd();
      pressNumber(1);
      pressNumber(0);
      pressEquals();
      pressClear();
      pressClear();

      pressEquals();

      assertCurrentDisplayValue("0");
    });

    it("shows the 'all clear' button when the calculator starts", function() {
      assertClearButtonFunctionalityChangedTo("AC");
    });

    it("shows the 'clear' button when the user inputs a number", function() {
      pressNumber(5);

      assertClearButtonFunctionalityChangedTo("C");
    });

    it("clears the current result when the user presses the clear button", function() {
      pressNumber(1);
      pressAdd();
      pressNumber(5);
      pressClear();

      assertCurrentDisplayValue("0");

      pressNumber(6);
      pressEquals();

      assertCurrentDisplayValue("7");
    });

    it("shows the 'all clear' button after the user presses the 'clear' button", function() {
      pressNumber(5);
      pressClear();

      assertClearButtonFunctionalityChangedTo("AC");
    });

    it("resets the calculator when the user presses the 'all clear' button", function() {
      pressNumber(1);
      pressAdd();
      pressNumber(5);
      pressClear();
      pressClear();
      pressNumber(6);

      pressEquals();

      assertCurrentDisplayValue("6");
    });

    it("clears the result when the user presses the 'clear' button after the 'equals' button, but still uses it if the user presses an operation button", function() {
      pressNumber(1);
      pressAdd();
      pressNumber(5);
      pressEquals();
      pressClear();
      pressAdd();
      pressNumber(2);

      pressEquals();

      assertCurrentDisplayValue("8");
    });

    it("clears the result when the user presses the 'clear' button after the 'equals' button, and doesn't use the result if the user inputs another number", function() {
      pressNumber(1);
      pressAdd();
      pressNumber(5);
      pressEquals();
      pressClear();
      pressNumber(2);
      pressAdd();

      pressEquals();

      assertCurrentDisplayValue("4");
    });

    it("doesn't keep adding fractional digits after the user presses the clear button", function() {
      pressDecimal();
      pressNumber(5);
      pressClear();
      pressNumber(5);

      assertCurrentDisplayValue("5");
    });

    // END CLEAR BUTTON TESTS


    // BEGIN PERCENTAGE OPERATION TESTS

    it("calculates the percentage of the last operand and outputs it after putting both operands", function() {
      pressNumber(1);
      pressNumber(2);
      pressAdd();
      pressNumber(5);
      pressNumber(0);
      pressPercent();

      assertCurrentDisplayValue("6");

      pressEquals();

      assertCurrentDisplayValue("18");
    });

    it("calculates the percentage of the first operand and shows it when asked after only putting the first operand and an operator", function() {
      pressNumber(1);
      pressNumber(0);
      pressAdd();
      pressPercent();

      assertCurrentDisplayValue("1");

      pressEquals();

      assertCurrentDisplayValue("11");
    });

    it("outputs '0' when the user presses the percentage button without any operand or operator, and then asks for the result", function() {
      pressPercent();

      assertCurrentDisplayValue("0");

      pressEquals();

      assertCurrentDisplayValue("0");
    });

    it("calculates the percentage of the second operand when asked for the percentage with a third operand and a priority operator", function() {
      pressNumber(5);
      pressAdd();
      pressNumber(6);
      pressMultiply();
      pressNumber(5);
      pressNumber(0);
      pressPercent();

      assertCurrentDisplayValue("3");

      pressEquals();

      assertCurrentDisplayValue("23");
    });

    it("uses the second operand as the third operand when asked for the percentage with a priority operation, but no third operand", function() {
      pressNumber(5);
      pressAdd();
      pressNumber(1);
      pressNumber(0);
      pressMultiply();
      pressPercent();

      assertCurrentDisplayValue("1");

      pressEquals();

      assertCurrentDisplayValue("15");
    });

    it("turns the number to a percentage when there is no operation set", function() {
      pressNumber(2);
      pressNumber(0);
      pressNumber(0);
      pressPercent();

      assertCurrentDisplayValue("2");

      pressEquals();

      assertCurrentDisplayValue("2");
    });

    it("uses the calculated percent value when repeating an operation", function() {
      pressNumber(1);
      pressNumber(0);
      pressAdd();
      pressNumber(5);
      pressNumber(0);
      pressPercent();

      pressEquals();
      pressEquals();

      assertCurrentDisplayValue("20");
    });

    // END PERCENTAGE OPERATION TESTS


    // BEGIN DECIMAL BUTTON TESTS

    it("can create a non-integer decimal number using the dot button, and use it as an operand", function() {
      pressNumber(5);
      pressDecimal();
      pressNumber(2);
      pressNumber(5);
      pressMultiply();
      pressNumber(4);

      pressEquals();

      assertCurrentDisplayValue("21");
    });

    it("shows a decimal point when the user presses the decimal button", function() {
      pressDecimal();

      assertCurrentDisplayValue("0.");
    });

    it("ignores the decimal point if the user doesn't add any decimal places", function() {
      pressNumber(5);
      pressDecimal();
      pressAdd();
      pressNumber(2);

      pressEquals();

      assertCurrentDisplayValue("7");
    });

    it("doesn't add a second decimal point", function() {
      pressNumber(1);
      pressDecimal();
      pressNumber(2);
      pressDecimal();

      assertCurrentDisplayValue("1.2");
    });

    it("shows zeroes after decimal point", function() {
      pressDecimal();
      pressNumber(0);
      pressNumber(0);
      pressNumber(0);

      assertCurrentDisplayValue("0.000");
    });

    // END DECIMAL BUTTON TESTS


    // BEGIN CHANGE SIGN BUTTON TESTS

    it("changes the sign of the currently input number when the user presses the change sign button", function() {
      pressNumber(5);
      pressChangeSign();
      pressAdd();
      pressNumber(6);

      pressEquals();

      assertCurrentDisplayValue("1");
    });

    it("changes the sign of the calculated result when the user presses the change sign button", function() {
      pressNumber(5);
      pressAdd();
      pressNumber(6);
      pressEquals();
      pressChangeSign();
      pressAdd();
      pressNumber(6);

      pressEquals();

      assertCurrentDisplayValue("-5");
    });

    // END CHANGE SIGN BUTTON TESTS


    // BEGIN DISPLAY UPDATE TESTS

    it("shows the last operand when the user inputs an operation", function() {
      pressNumber(5);
      pressAdd();

      assertCurrentDisplayValue("5");
    });

    it("shows the intermediate result when the user inputs a second operation", function() {
      pressNumber(5);
      pressAdd();
      pressNumber(6);
      pressAdd();

      assertCurrentDisplayValue("11");
    });

    it("shows the last operand when the user inputs a priority operation", function() {
      pressNumber(5);
      pressAdd();
      pressNumber(6);
      pressMultiply();

      assertCurrentDisplayValue("6");
    });

    it("shows the intermediate result of the priority operation when the user inputs a second priority operation", function() {
      pressNumber(5);
      pressAdd();
      pressNumber(6);
      pressMultiply();
      pressNumber(5);
      pressDivide();

      assertCurrentDisplayValue(30);
    });

    it("changes the sign of the operand and updates the displayed value even after the user has set an operation", function() {
      pressNumber(5);
      pressAdd();
      pressChangeSign();

      assertCurrentDisplayValue("-5");
    });

    // END DISPLAY UPDATE TESTS


    // Helper functions

    function createDOMElementsForCalculator() {
      displayPanel = createElementInContainer("div");

      numberButtons = [];
      for (var i = 0; i < 10; i++) {
        numberButtons[i] = createElementInContainer("button");
        numberButtons[i].dataset.value = i;
      }

      addButton         = createElementInContainer("button");
      subtractButton    = createElementInContainer("button");
      multiplyButton    = createElementInContainer("button");
      divideButton      = createElementInContainer("button");
      percentButton     = createElementInContainer("button");
      decimalButton     = createElementInContainer("button");
      changeSignButton  = createElementInContainer("button");
      equalsButton      = createElementInContainer("button");
      clearButton       = createElementInContainer("button");
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
        decimalButton: decimalButton,
        changeSignButton: changeSignButton,
        equalsButton: equalsButton,
        clearButton: clearButton,
        onDisplayValueUpdate: displayValueUpdated,
        onClearButtonFunctionalityChange: clearButtonFunctionalityChanged
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

    function pressDecimal() {
      decimalButton.click();
    }

    function pressChangeSign() {
      changeSignButton.click();
    }

    function pressEquals() {
      equalsButton.click();
    }

    function pressClear() {
      clearButton.click();
    }

    function assertCurrentDisplayValue(expectedNumberString) {
      sinon.assert.called(displayValueUpdated);
      assert.equal(displayValueUpdated.lastCall.args[0], expectedNumberString);
    }

    function assertClearButtonFunctionalityChangedTo(expectedFunctionality) {
      sinon.assert.called(clearButtonFunctionalityChanged);
      assert.equal(clearButtonFunctionalityChanged.lastCall.args[0], expectedFunctionality);
    }
  });
}());