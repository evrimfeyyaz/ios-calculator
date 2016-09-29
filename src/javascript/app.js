/**
 * Created by Evrim Persembe on 9/1/16.
 */

(function () {
  "use strict";

  var calculator = require("./calculator.js");

  window.addEventListener("DOMContentLoaded", function() {
    var ACTIVE_OPERATION_BUTTON_CLASS_NAME = "is-active-operation";
    var OPERATION_BUTTON_CLASS_NAME = "calc-buttons-operation";

    var displayPanel = document.querySelector(".calc-display .content");
    var numberButtons = [
      document.getElementById("zero-button"),
      document.getElementById("one-button"),
      document.getElementById("two-button"),
      document.getElementById("three-button"),
      document.getElementById("four-button"),
      document.getElementById("five-button"),
      document.getElementById("six-button"),
      document.getElementById("seven-button"),
      document.getElementById("eight-button"),
      document.getElementById("nine-button")
    ];
    var addButton = document.getElementById("add-button");
    var subtractButton = document.getElementById("subtract-button");
    var multiplyButton = document.getElementById("multiply-button");
    var divideButton = document.getElementById("divide-button");
    var percentButton = document.getElementById("percent-button");
    var decimalButton = document.getElementById("decimal-button");
    var changeSignButton = document.getElementById("change-sign-button");
    var equalsButton = document.getElementById("equals-button");
    var clearButton = document.getElementById("clear-button");

    var buttons = document.querySelectorAll(".calc-buttons > button");
    var operationButtons = [addButton, subtractButton, multiplyButton, divideButton];

    document.body.addEventListener("touchstart", preventZoom);

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

    for (var i = 0; i < buttons.length; i++) {
      makeButtonSquare(buttons[i]);
      attachHandlerForActiveOperation(buttons[i], operationButtons, changeSignButton, percentButton);
    }

    function displayValueUpdated(newValue) {
      displayPanel.innerHTML = newValue;
      fitDisplayValueToContainer();
    }

    function fitDisplayValueToContainer() {
      var displayContainerSize = displayPanel.parentNode.offsetWidth;
      var displayValueRightOffset = parseInt(window.getComputedStyle(displayPanel, null).getPropertyValue("right"));
      var displayValueLeftOffset = displayValueRightOffset * 0.2;

      displayContainerSize -= displayValueRightOffset + displayValueLeftOffset;

      var displayValueSize = parseInt(displayPanel.clientWidth);
      var scaleFactor = displayContainerSize / displayValueSize;

      if (scaleFactor < 1) {
        displayPanel.style.transform = "scale(" + scaleFactor + ")";
      } else {
        displayPanel.style.transform = "scale(1)";
      }
    }

    function clearButtonFunctionalityChanged(newFunctionality) {
      clearButton.innerHTML = newFunctionality;
    }

    function makeButtonSquare(button) {
      if (button.id === "zero-button") return;
      button.style.height = window.getComputedStyle(button, null).getPropertyValue("width");
    }

    function attachHandlerForActiveOperation(button, operationButtons, changeSignButton, percentButton) {
      button.addEventListener("click", function() {
        if (button === changeSignButton || button === percentButton) return;

        var isOperationButton = button.classList.contains(OPERATION_BUTTON_CLASS_NAME);

        for (var i = 0; i < operationButtons.length; i++) {
          operationButtons[i].classList.remove(ACTIVE_OPERATION_BUTTON_CLASS_NAME);
        }

        if (isOperationButton) {
          button.classList.add(ACTIVE_OPERATION_BUTTON_CLASS_NAME);
        }
      });
    }

    // Adapted from: http://stackoverflow.com/a/10910547
    function preventZoom(e) {
      var t2 = e.timeStamp;
      var t1 = e.currentTarget.dataset.lastTouch || t2;
      var dt = t2 - t1;
      var fingers = e.touches.length;
      e.currentTarget.dataset.lastTouch = t2;
      if (!dt || dt > 500 || fingers > 1) return; // not double-tap

      e.preventDefault(); // double tap - prevent the zoom
      // also synthesize click events we just swallowed up

      e.target.click();
    }
  });
}());