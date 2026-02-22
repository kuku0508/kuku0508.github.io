(function () {
  var ACTIVE_CLASS = "is-color-active";
  var AUTO_HIDE_MS = 1500;

  function isCoarsePointer() {
    if (window.matchMedia) {
      return window.matchMedia("(pointer: coarse)").matches;
    }
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!isCoarsePointer()) return;

    var rows = Array.from(document.querySelectorAll(".profile-card__color-row"));
    if (!rows.length) return;

    var timers = new WeakMap();

    function clearTimer(row) {
      var timerId = timers.get(row);
      if (!timerId) return;
      window.clearTimeout(timerId);
      timers.delete(row);
    }

    function deactivate(row) {
      clearTimer(row);
      row.classList.remove(ACTIVE_CLASS);
      row.setAttribute("aria-expanded", "false");
    }

    function activate(row) {
      clearTimer(row);
      row.classList.add(ACTIVE_CLASS);
      row.setAttribute("aria-expanded", "true");

      var timerId = window.setTimeout(function () {
        deactivate(row);
      }, AUTO_HIDE_MS);
      timers.set(row, timerId);
    }

    rows.forEach(function (row) {
      row.setAttribute("aria-expanded", "false");
      row.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();

        if (row.classList.contains(ACTIVE_CLASS)) {
          deactivate(row);
          return;
        }

        rows.forEach(function (otherRow) {
          if (otherRow !== row) deactivate(otherRow);
        });
        activate(row);
      });
    });

    document.addEventListener("click", function (event) {
      rows.forEach(function (row) {
        if (!row.contains(event.target)) {
          deactivate(row);
        }
      });
    });
  });
})();
