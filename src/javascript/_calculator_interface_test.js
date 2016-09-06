/**
 * Created by Evrim Persembe on 9/6/16.
 */

(function () {
  "use strict";

  var calculatorInterface = require("./calculator_interface.js");

  describe("Calculator interface", function() {
    it.only("can be initialized", function() {
      var container = document.createElement("div");
      document.body.appendChild(container);

      calculatorInterface.initialize(container);
      var result = container.innerHTML;

      assert.equal(result, "Hello world!");
    });
  });
}());