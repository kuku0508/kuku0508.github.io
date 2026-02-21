(function () {
  function toSafeCount(value) {
    var parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed < 0) return 0;
    return Math.floor(parsed);
  }

  document.addEventListener("DOMContentLoaded", function () {
    var source = document.getElementById("profile-stats-source");
    if (!source) return;

    var authorContent = document.querySelector(".sidebar .author__content");
    if (!authorContent || authorContent.querySelector(".profile-stats")) return;

    var postCount = toSafeCount(source.dataset.postCount);
    var projectCount = toSafeCount(source.dataset.projectCount);

    var stats = document.createElement("div");
    stats.className = "profile-stats";

    var postLine = document.createElement("p");
    postLine.className = "profile-stats__item";
    postLine.innerHTML = "<strong>" + postCount + "</strong> 篇文章";

    var projectLine = document.createElement("p");
    projectLine.className = "profile-stats__item";
    projectLine.innerHTML = "<strong>" + projectCount + "</strong> 個專案";

    stats.appendChild(postLine);
    stats.appendChild(projectLine);
    authorContent.appendChild(stats);
  });
})();
