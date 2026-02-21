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
    var ENTERING_CLASS = "is-entering";
    var VISIBLE_CLASS = "is-visible";
    var LEAVING_CLASS = "is-leaving";
    var TRANSITION_MS = 220;

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
    var hideJobs = new WeakMap();
    var hasRendered = false;
    var reduceMotion = false;

    if (window.matchMedia) {
      reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    function clearHideJob(item) {
      var job = hideJobs.get(item);
      if (!job) return;

      item.removeEventListener("transitionend", job.onTransitionEnd);
      item.removeEventListener("transitioncancel", job.onTransitionCancel);
      window.clearTimeout(job.fallbackTimer);
      hideJobs.delete(item);
    }

    function finalizeHide(item) {
      clearHideJob(item);
      item.classList.remove(ENTERING_CLASS, VISIBLE_CLASS, LEAVING_CLASS);
      item.classList.add(HIDDEN_CLASS);
      item.hidden = true;
      item.setAttribute("aria-hidden", "true");
    }

    function showItem(item, animate) {
      clearHideJob(item);
      item.hidden = false;
      item.classList.remove(HIDDEN_CLASS, LEAVING_CLASS);
      item.setAttribute("aria-hidden", "false");

      if (!animate) {
        item.classList.remove(ENTERING_CLASS);
        item.classList.add(VISIBLE_CLASS);
        return;
      }

      item.classList.remove(VISIBLE_CLASS);
      item.classList.add(ENTERING_CLASS);

      window.requestAnimationFrame(function () {
        if (item.hidden || item.classList.contains(HIDDEN_CLASS)) return;
        item.classList.add(VISIBLE_CLASS);
        item.classList.remove(ENTERING_CLASS);
      });
    }

    function hideItem(item, animate) {
      clearHideJob(item);

      if (!animate) {
        finalizeHide(item);
        return;
      }

      item.classList.remove(ENTERING_CLASS, VISIBLE_CLASS);
      item.classList.add(LEAVING_CLASS);
      item.setAttribute("aria-hidden", "true");

      var finished = false;
      var job = {
        onTransitionEnd: function (event) {
          if (event.target !== item) return;
          complete();
        },
        onTransitionCancel: function () {
          complete();
        },
        fallbackTimer: 0,
      };

      function complete() {
        if (finished) return;
        finished = true;
        finalizeHide(item);
      }

      job.fallbackTimer = window.setTimeout(complete, TRANSITION_MS + 80);
      hideJobs.set(item, job);
      item.addEventListener("transitionend", job.onTransitionEnd);
      item.addEventListener("transitioncancel", job.onTransitionCancel);
    }

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
      var shouldAnimate = hasRendered && !reduceMotion;

      items.forEach(function (item, index) {
        var wasVisible = !item.hidden && !item.classList.contains(HIDDEN_CLASS);
        var isVisible = matches(itemTokens[index], selected, mode);

        if (isVisible) {
          if (wasVisible) {
            clearHideJob(item);
            item.classList.remove(ENTERING_CLASS, LEAVING_CLASS, HIDDEN_CLASS);
            item.hidden = false;
            item.classList.add(VISIBLE_CLASS);
            item.setAttribute("aria-hidden", "false");
          } else {
            showItem(item, shouldAnimate);
          }
        } else {
          if (wasVisible) {
            hideItem(item, shouldAnimate);
          } else {
            finalizeHide(item);
          }
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
