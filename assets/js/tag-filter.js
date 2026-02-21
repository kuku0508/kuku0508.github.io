(function () {
  function normalizeToken(value) {
    return (value || "")
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[\s/]+/g, "-")
      .replace(/[#,]/g, "");
  }

  function parseTokenSet(raw) {
    var tokens = (raw || "").split(/\s+/).map(normalizeToken).filter(Boolean);
    return new Set(tokens);
  }

  function setupFilter(root) {
    var HIDDEN_CLASS = "is-filter-hidden";
    var REVEAL_CLASS = "is-filter-reveal";
    var itemsContainer = root.querySelector("[data-filter-items]");
    if (!itemsContainer) return;

    var items = Array.from(itemsContainer.querySelectorAll("[data-tags]"));
    if (!items.length) return;

    var itemTokens = items.map(function (item) {
      return parseTokenSet(item.dataset.tags);
    });

    var scopeName = root.dataset.filterScope === "projects" ? "專案" : "文章";
    var checkboxes = Array.from(root.querySelectorAll(".filter-chip input[type='checkbox']"));
    var modeInputs = Array.from(root.querySelectorAll("input[type='radio'][name^='filter-mode-']"));
    var resetButton = root.querySelector("[data-filter-reset]");
    var countNode = root.querySelector("[data-filter-count]");
    var emptyNode = root.querySelector("[data-filter-empty]");
    var hasRendered = false;

    function getMode() {
      var checked = modeInputs.find(function (input) {
        return input.checked;
      });
      return checked ? checked.value : "or";
    }

    function getSelectedTokens() {
      return checkboxes
        .filter(function (checkbox) {
          return checkbox.checked;
        })
        .map(function (checkbox) {
          return normalizeToken(checkbox.value);
        })
        .filter(Boolean);
    }

    function matches(tokens, selected, mode) {
      if (!selected.length) return true;
      if (mode === "and") {
        return selected.every(function (token) {
          return tokens.has(token);
        });
      }
      return selected.some(function (token) {
        return tokens.has(token);
      });
    }

    function render() {
      var selected = getSelectedTokens();
      var mode = getMode();
      var visibleCount = 0;

      items.forEach(function (item, index) {
        var wasHidden = item.classList.contains(HIDDEN_CLASS) || item.hidden;
        var isVisible = matches(itemTokens[index], selected, mode);
        item.hidden = !isVisible;
        item.classList.toggle(HIDDEN_CLASS, !isVisible);
        item.setAttribute("aria-hidden", String(!isVisible));

        if (isVisible) {
          item.classList.remove(REVEAL_CLASS);
          if (hasRendered && selected.length && wasHidden) {
            void item.offsetWidth;
            item.classList.add(REVEAL_CLASS);
          }
        } else {
          item.classList.remove(REVEAL_CLASS);
        }

        if (isVisible) visibleCount += 1;
      });

      if (countNode) {
        if (!selected.length) {
          countNode.textContent = "目前顯示全部 " + visibleCount + " 筆" + scopeName + "。";
        } else {
          countNode.textContent =
            "符合條件：" + visibleCount + " / " + items.length + " 筆" + scopeName + "（模式：" + mode.toUpperCase() + "）";
        }
      }

      if (emptyNode) {
        emptyNode.hidden = visibleCount !== 0;
      }

      hasRendered = true;
    }

    checkboxes.forEach(function (checkbox) {
      checkbox.addEventListener("change", render);
    });

    modeInputs.forEach(function (modeInput) {
      modeInput.addEventListener("change", render);
    });

    if (resetButton) {
      resetButton.addEventListener("click", function () {
        checkboxes.forEach(function (checkbox) {
          checkbox.checked = false;
        });
        var defaultMode = root.querySelector("input[type='radio'][value='or']");
        if (defaultMode) defaultMode.checked = true;
        render();
      });
    }

    render();
  }

  document.addEventListener("DOMContentLoaded", function () {
    var filterBlocks = document.querySelectorAll(".tag-filter[data-filter-scope]");
    filterBlocks.forEach(setupFilter);
  });
})();
