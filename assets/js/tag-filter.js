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
    var TRANSITION_MS = 280;

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
    var groups = Array.from(root.querySelectorAll("[data-filter-group]"));
    var motionJobs = new WeakMap();
    var groupHideTimers = new WeakMap();
    var hasRendered = false;

    function clearMotionJob(item) {
      var job = motionJobs.get(item);
      if (!job) return;

      window.clearTimeout(job.fallbackTimer);
      if (job.animation) {
        job.animation.onfinish = null;
        job.animation.oncancel = null;
        try {
          job.animation.cancel();
        } catch (error) {}
      }
      motionJobs.delete(item);
      item.style.opacity = "";
      item.style.transform = "";
    }

    function clearGroupHideTimer(group) {
      var timerId = groupHideTimers.get(group);
      if (!timerId) return;
      window.clearTimeout(timerId);
      groupHideTimers.delete(group);
    }

    function runMotion(item, keyframes, onDone) {
      clearMotionJob(item);

      if (!item.animate) {
        onDone();
        return;
      }

      var job = {
        animation: null,
        fallbackTimer: 0,
      };

      function complete() {
        if (motionJobs.get(item) !== job) return;
        motionJobs.delete(item);
        item.style.opacity = "";
        item.style.transform = "";
        onDone();
      }

      var animation = item.animate(keyframes, {
        duration: TRANSITION_MS,
        easing: "ease",
        fill: "forwards",
      });

      job.animation = animation;
      job.fallbackTimer = window.setTimeout(complete, TRANSITION_MS + 100);
      motionJobs.set(item, job);
      animation.onfinish = complete;
      animation.oncancel = complete;
    }

    function finalizeHide(item) {
      clearMotionJob(item);
      item.classList.remove(ENTERING_CLASS, VISIBLE_CLASS, LEAVING_CLASS);
      item.classList.add(HIDDEN_CLASS);
      item.hidden = true;
      item.setAttribute("aria-hidden", "true");
    }

    function showItem(item, animate) {
      clearMotionJob(item);
      item.hidden = false;
      item.classList.remove(HIDDEN_CLASS, LEAVING_CLASS);
      item.setAttribute("aria-hidden", "false");

      if (!animate) {
        item.classList.remove(ENTERING_CLASS);
        item.classList.add(VISIBLE_CLASS);
        return;
      }

      item.classList.remove(VISIBLE_CLASS, LEAVING_CLASS);
      item.classList.add(ENTERING_CLASS);
      runMotion(
        item,
        [
          { opacity: 0, transform: "translateY(10px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        function () {
          item.classList.remove(ENTERING_CLASS, LEAVING_CLASS);
          item.classList.add(VISIBLE_CLASS);
          item.hidden = false;
          item.setAttribute("aria-hidden", "false");
        }
      );
    }

    function hideItem(item, animate) {
      clearMotionJob(item);

      if (!animate) {
        finalizeHide(item);
        return;
      }

      item.classList.remove(ENTERING_CLASS, VISIBLE_CLASS);
      item.classList.add(LEAVING_CLASS);
      item.setAttribute("aria-hidden", "true");
      runMotion(
        item,
        [
          { opacity: 1, transform: "translateY(0)" },
          { opacity: 0, transform: "translateY(-10px)" },
        ],
        function () {
          finalizeHide(item);
        }
      );
    }

    function setVisibleImmediately(item) {
      clearMotionJob(item);
      item.classList.remove(ENTERING_CLASS, LEAVING_CLASS, HIDDEN_CLASS);
      item.hidden = false;
      item.classList.add(VISIBLE_CLASS);
      item.setAttribute("aria-hidden", "false");
    }

    function setHiddenImmediately(item) {
      finalizeHide(item);
    }

    function isCurrentlyVisible(item) {
      return !item.hidden && !item.classList.contains(HIDDEN_CLASS);
    }

    function isLeaving(item) {
      return item.classList.contains(LEAVING_CLASS);
    }

    function updateGroups(visibilityMap, animate) {
      if (!groups.length) return;

      groups.forEach(function (group) {
        clearGroupHideTimer(group);

        var groupItems = Array.from(group.querySelectorAll("[data-tags]"));
        var visibleInGroup = 0;
        groupItems.forEach(function (item) {
          if (visibilityMap.get(item)) visibleInGroup += 1;
        });

        var groupCountNode = group.querySelector("[data-filter-group-count]");
        if (groupCountNode) {
          groupCountNode.textContent = String(visibleInGroup);
        }

        if (visibleInGroup > 0) {
          group.hidden = false;
          group.setAttribute("aria-hidden", "false");
          return;
        }

        if (!animate) {
          group.hidden = true;
          group.setAttribute("aria-hidden", "true");
          return;
        }

        var timerId = window.setTimeout(function () {
          group.hidden = true;
          group.setAttribute("aria-hidden", "true");
          groupHideTimers.delete(group);
        }, TRANSITION_MS + 20);
        groupHideTimers.set(group, timerId);
      });
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
      var shouldAnimate = hasRendered;
      var visibilityMap = new Map();

      items.forEach(function (item, index) {
        var wasVisible = isCurrentlyVisible(item);
        var isVisible = matches(itemTokens[index], selected, mode);
        visibilityMap.set(item, isVisible);

        if (isVisible) {
          if (wasVisible && !isLeaving(item)) {
            setVisibleImmediately(item);
          } else {
            showItem(item, shouldAnimate);
          }
        } else {
          if (wasVisible) {
            hideItem(item, shouldAnimate);
          } else {
            setHiddenImmediately(item);
          }
        }

        if (isVisible) visibleCount += 1;
      });

      updateGroups(visibilityMap, shouldAnimate);

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
