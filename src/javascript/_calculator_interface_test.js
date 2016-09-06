/**
 * Created by Evrim Persembe on 9/6/16.
 */

(function () {
  "use strict";

  var calculatorInterface = require("./calculator_interface.js");

  describe("Calculator interface", function() {
    it.only("can display pressed numbers", function() {
      var container = document.createElement("div");
      document.body.appendChild(container);

      var output = document.createElement("div");
      container.appendChild(output);

      var i, numbers = [];
      for (i = 0; i < 10; i++) {
        numbers[i] = document.createElement("button");
        numbers[i].dataset.value = i;
        container.appendChild(numbers[i]);
      }

      calculatorInterface.initialize({
        output: output,
        numbers: numbers
      });

      for (i = 1; i < 10; i++) {
        numbers[i].click();
      }
      numbers[0].click();

      var result = output.innerHTML;

      assert.equal(result, "1234567890");
    });
  });
}());