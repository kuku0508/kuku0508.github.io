(function () {
  function normalizeToken(value) {
    return (value || "")
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[\s/]+/g, "-")
      .replace(/[#,]/g, "");
  }

  function parseTokens(raw) {
    return (raw || "")
      .split(/\s+/)
      .map(normalizeToken)
      .filter(Boolean);
  }

  function setupTimelineSidebarFilter() {
    var sidebarRoot = document.querySelector("[data-archive-sidebar-filter]");
    if (!sidebarRoot) return;

    var timelineRoot = document.querySelector("[data-timeline-items]");
    if (!timelineRoot) {
      sidebarRoot.hidden = true;
      return;
    }
    sidebarRoot.hidden = false;

    var allItems = Array.from(timelineRoot.querySelectorAll(".timeline-item[data-kind]"));
    if (!allItems.length) return;

    var yearGroups = Array.from(timelineRoot.querySelectorAll("[data-timeline-year]"));
    var emptyNode = document.querySelector(".timeline-page [data-timeline-empty]");

    var articleBox = sidebarRoot.querySelector("[data-archive-filter='articles']");
    var projectBox = sidebarRoot.querySelector("[data-archive-filter='projects']");
    if (!articleBox || !projectBox) return;

    var totalArticles = allItems.filter(function (item) {
      return item.dataset.kind === "article";
    }).length;
    var totalProjects = allItems.filter(function (item) {
      return item.dataset.kind === "project";
    }).length;
    var TRANSITION_MS = 480;
    var motionJobs = new WeakMap();
    var groupTimers = new WeakMap();
    var hasRendered = false;

    function clearMotion(item) {
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

    function runMotion(item, keyframes, onDone) {
      clearMotion(item);

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
        easing: "cubic-bezier(0.22, 0.61, 0.36, 1)",
        fill: "forwards",
      });

      job.animation = animation;
      job.fallbackTimer = window.setTimeout(complete, TRANSITION_MS + 100);
      motionJobs.set(item, job);
      animation.onfinish = complete;
      animation.oncancel = complete;
    }

    function finalizeHide(item) {
      clearMotion(item);
      item.hidden = true;
      item.setAttribute("aria-hidden", "true");
    }

    function showItem(item, animate) {
      clearMotion(item);
      item.hidden = false;
      item.setAttribute("aria-hidden", "false");

      if (!animate) {
        item.style.opacity = "";
        item.style.transform = "";
        return;
      }

      runMotion(
        item,
        [
          { opacity: 0, transform: "translateY(14px) scale(0.985)" },
          { opacity: 1, transform: "translateY(0) scale(1)" },
        ],
        function () {
          item.hidden = false;
          item.setAttribute("aria-hidden", "false");
        }
      );
    }

    function hideItem(item, animate) {
      clearMotion(item);

      if (!animate) {
        finalizeHide(item);
        return;
      }

      item.hidden = false;
      item.setAttribute("aria-hidden", "true");
      runMotion(
        item,
        [
          { opacity: 1, transform: "translateY(0) scale(1)" },
          { opacity: 0, transform: "translateY(-14px) scale(0.985)" },
        ],
        function () {
          finalizeHide(item);
        }
      );
    }

    function clearGroupTimer(group) {
      var timerId = groupTimers.get(group);
      if (!timerId) return;
      window.clearTimeout(timerId);
      groupTimers.delete(group);
    }

    function readFilterState(box) {
      var checkedMode = box.querySelector("input[type='radio']:checked");
      var mode = checkedMode ? checkedMode.value : "or";
      var selected = Array.from(box.querySelectorAll(".filter-chip input[type='checkbox']:checked"))
        .map(function (input) {
          return normalizeToken(input.value);
        })
        .filter(Boolean);
      return { mode: mode, selected: selected };
    }

    function matches(tokens, selected, mode) {
      if (!selected.length) return true;
      if (!tokens.length) return false;
      if (mode === "and") {
        return selected.every(function (token) {
          return tokens.indexOf(token) !== -1;
        });
      }
      return selected.some(function (token) {
        return tokens.indexOf(token) !== -1;
      });
    }

    function updateSummary(box, visible, total, label) {
      var node = box.querySelector("[data-archive-filter-count]");
      if (!node) return;

      var state = readFilterState(box);
      if (!state.selected.length) {
        node.textContent = "目前顯示全部 " + visible + " 筆" + label + "。";
      } else {
        node.textContent = "符合條件：" + visible + " / " + total + " 筆" + label + "（" + state.mode.toUpperCase() + "）";
      }
    }

    function updateGroups(visibilityMap, animate) {
      yearGroups.forEach(function (group) {
        clearGroupTimer(group);

        var groupItems = Array.from(group.querySelectorAll(".timeline-item[data-kind]"));
        var visibleInYear = 0;
        groupItems.forEach(function (item) {
          if (visibilityMap.get(item)) visibleInYear += 1;
        });

        var countNode = group.querySelector("[data-timeline-year-count]");
        if (countNode) countNode.textContent = String(visibleInYear);

        if (visibleInYear > 0) {
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
          groupTimers.delete(group);
        }, TRANSITION_MS + 20);
        groupTimers.set(group, timerId);
      });
    }

    function render() {
      var articleState = readFilterState(articleBox);
      var projectState = readFilterState(projectBox);
      var visibleTotal = 0;
      var visibleArticles = 0;
      var visibleProjects = 0;
      var shouldAnimate = hasRendered;
      var visibilityMap = new Map();

      allItems.forEach(function (item) {
        var kind = item.dataset.kind;
        var shouldShow = true;

        if (kind === "article") {
          shouldShow = matches(parseTokens(item.dataset.postTags), articleState.selected, articleState.mode);
        } else if (kind === "project") {
          shouldShow = matches(parseTokens(item.dataset.projectTags), projectState.selected, projectState.mode);
        }

        visibilityMap.set(item, shouldShow);

        if (shouldShow) {
          showItem(item, shouldAnimate);
        } else {
          hideItem(item, shouldAnimate);
        }

        if (shouldShow) {
          visibleTotal += 1;
          if (kind === "article") visibleArticles += 1;
          if (kind === "project") visibleProjects += 1;
        }
      });

      updateGroups(visibilityMap, shouldAnimate);

      updateSummary(articleBox, visibleArticles, totalArticles, "文章");
      updateSummary(projectBox, visibleProjects, totalProjects, "專案");

      if (emptyNode) {
        emptyNode.hidden = visibleTotal !== 0;
      }

      hasRendered = true;
    }

    function bindBox(box) {
      Array.from(box.querySelectorAll("input[type='checkbox'], input[type='radio']")).forEach(function (control) {
        control.addEventListener("change", render);
      });

      var resetButton = box.querySelector("[data-archive-filter-reset]");
      if (resetButton) {
        resetButton.addEventListener("click", function () {
          Array.from(box.querySelectorAll(".filter-chip input[type='checkbox']")).forEach(function (checkbox) {
            checkbox.checked = false;
          });
          var defaultMode = box.querySelector("input[type='radio'][value='or']");
          if (defaultMode) defaultMode.checked = true;
          render();
        });
      }
    }

    bindBox(articleBox);
    bindBox(projectBox);
    render();
  }

  document.addEventListener("DOMContentLoaded", setupTimelineSidebarFilter);
})();
