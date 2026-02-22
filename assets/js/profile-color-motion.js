(function () {
  var ACTIVE_CLASS = "is-color-active";

  function isTapTriggerContext() {
    if (window.matchMedia) {
      return window.matchMedia("(hover: none), (pointer: coarse)").matches;
    }
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var rows = Array.from(document.querySelectorAll(".profile-card__color-row"));
    if (!rows.length) return;

    function deactivate(row) {
      row.classList.remove(ACTIVE_CLASS);
      row.setAttribute("aria-expanded", "false");
      row.blur();
    }

    function activate(row) {
      row.classList.add(ACTIVE_CLASS);
      row.setAttribute("aria-expanded", "true");
    }

    rows.forEach(function (row) {
      row.setAttribute("aria-expanded", "false");
      row.addEventListener("click", function (event) {
        if (!isTapTriggerContext()) return;

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

      row.addEventListener("keydown", function (event) {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();

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
      if (!isTapTriggerContext()) return;
      rows.forEach(function (row) {
        if (!row.contains(event.target)) {
          deactivate(row);
        }
      });
    });

    window.addEventListener("resize", function () {
      if (isTapTriggerContext()) return;
      rows.forEach(deactivate);
    });
  });
})();
