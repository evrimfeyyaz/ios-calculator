/**
 * Created by Evrim Persembe on 9/1/16.
 */

(function () {
  "use strict";

  var calculator = require("./calculator.js");

  window.addEventListener("DOMContentLoaded", function() {
    var displayPanel = document.getElementById("result");
    var numberButtons = [
      document.getElementById("zero-btn"),
      document.getElementById("one-btn"),
      document.getElementById("two-btn"),
      document.getElementById("three-btn"),
      document.getElementById("four-btn"),
      document.getElementById("five-btn"),
      document.getElementById("six-btn"),
      document.getElementById("seven-btn"),
      document.getElementById("eight-btn"),
      document.getElementById("nine-btn")
    ];
    var addButton = document.getElementById("add-btn");
    var subtractButton = document.getElementById("subtract-btn");
    var multiplyButton = document.getElementById("multiply-btn");
    var divideButton = document.getElementById("divide-btn");
    var percentButton = document.getElementById("percent-btn");
    var decimalButton = document.getElementById("decimal-btn");
    var changeSignButton = document.getElementById("change-sign-btn");
    var equalsButton = document.getElementById("equals-btn");
    var clearButton = document.getElementById("clear-btn");

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

    function displayValueUpdated(newValue) {
      displayPanel.innerHTML = newValue;
    }

    function clearButtonFunctionalityChanged(newFunctionality) {
      clearButton.innerHTML = newFunctionality;
    }
  });
}());