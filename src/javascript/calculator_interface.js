/**
 * Created by Evrim Persembe on 9/6/16.
 */

(function () {
  "use strict";

  var opts, currentValue;

  exports.initialize = function(options) {
    resetValues();

    opts = options;

    opts.numbers.forEach(function(number) {
      number.addEventListener("click", numberClickHandler);
    });

    displayCurrentValue();
  };

  function numberClickHandler(e) {
    var numberButton  = e.currentTarget;
    var numberValue   = +numberButton.dataset.value;

    currentValue = (currentValue * 10) + numberValue;
    displayCurrentValue();
  }

  function resetValues() {
    opts = {};
    currentValue = 0;
  }

  function displayCurrentValue() {
    opts.output.innerHTML = currentValue;
  }
}());