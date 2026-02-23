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
    var timelineRoot = document.querySelector(".timeline-page [data-timeline-items]");
    var sidebarRoot = document.querySelector("[data-archive-sidebar-filter]");
    if (!timelineRoot || !sidebarRoot) return;

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

    function render() {
      var articleState = readFilterState(articleBox);
      var projectState = readFilterState(projectBox);
      var visibleTotal = 0;
      var visibleArticles = 0;
      var visibleProjects = 0;

      allItems.forEach(function (item) {
        var kind = item.dataset.kind;
        var shouldShow = true;

        if (kind === "article") {
          shouldShow = matches(parseTokens(item.dataset.postTags), articleState.selected, articleState.mode);
        } else if (kind === "project") {
          shouldShow = matches(parseTokens(item.dataset.projectTags), projectState.selected, projectState.mode);
        }

        item.hidden = !shouldShow;
        item.setAttribute("aria-hidden", shouldShow ? "false" : "true");

        if (shouldShow) {
          visibleTotal += 1;
          if (kind === "article") visibleArticles += 1;
          if (kind === "project") visibleProjects += 1;
        }
      });

      yearGroups.forEach(function (group) {
        var visibleInYear = Array.from(group.querySelectorAll(".timeline-item[data-kind]")).filter(function (item) {
          return !item.hidden;
        }).length;
        group.hidden = visibleInYear === 0;
        group.setAttribute("aria-hidden", visibleInYear === 0 ? "true" : "false");
        var countNode = group.querySelector("[data-timeline-year-count]");
        if (countNode) countNode.textContent = String(visibleInYear);
      });

      updateSummary(articleBox, visibleArticles, totalArticles, "文章");
      updateSummary(projectBox, visibleProjects, totalProjects, "專案");

      if (emptyNode) {
        emptyNode.hidden = visibleTotal !== 0;
      }
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
