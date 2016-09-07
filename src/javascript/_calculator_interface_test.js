/**
 * Created by Evrim Persembe on 9/6/16.
 */

(function () {
  "use strict";

  var calculatorInterface = require("./calculator_interface.js");

  describe("Calculator interface", function() {
    var container,
        output,
        numbers = []
      ;

    beforeEach(function() {
      container = document.createElement("div");
      document.body.appendChild(container);

      createDOMElementsForCalculator();
      initializeCalculator();
    });

    afterEach(function() {

      removeElement(container);
    });

    it("displays '0' when first started", function() {
      assert.equal(displayedNumber(), "0");
    });

    it("can display pressed numbers", function() {
      for (var i = 1; i < 10; i++) {
        numbers[i].click();
      }
      numbers[0].click();

      assert.equal(displayedNumber(), "1234567890");
    });

    it("doesn't display a '0' in front of numbers, even if it's pressed", function() {
      numbers[0].click();
      numbers[1].click();

      assert.equal(displayedNumber(), "1");
    });

    // Helper functions

    function createDOMElementsForCalculator() {
      output = createElementInContainer("div");

      for (var i = 0; i < 10; i++) {
        numbers[i] = createElementInContainer("button");
        numbers[i].dataset.value = i;
      }
    }

    function initializeCalculator() {
      calculatorInterface.initialize({
        output: output,
        numbers: numbers
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
      return output.innerHTML;
    }
  });
}());