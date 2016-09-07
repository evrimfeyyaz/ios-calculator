/**
 * Created by Evrim Persembe on 9/6/16.
 */

(function () {
  "use strict";

  var calculatorInterface = require("./calculator_interface.js");

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

      calculatorInterface.terminate();
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
      calculatorInterface.initialize({
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
}());