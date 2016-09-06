/**
 * Created by Evrim Persembe on 9/6/16.
 */

(function () {
  "use strict";

  exports.initialize = function(options) {
    options.numbers.forEach(function(number) {
      number.addEventListener("click", function() {
        var numberValue = this.dataset.value;

        options.output.innerHTML += numberValue;
      });
    });
  };
}());