---
layout: single
title: "標籤"
permalink: /tags/
classes: wide portal-archive
---

<div class="portal-shell">
  <section class="portal-card">
    <h1 class="portal-card__title">標籤篩選已整合到文章頁</h1>
    <p class="post-item__excerpt">
      你現在可以直接在「文章」頁勾選多個標籤，並切換 OR/AND 來篩選內容。
    </p>
    <a class="section-link" href="{{ '/articles/' | relative_url }}">前往文章頁篩選 →</a>
  </section>
</div>

<script>
  window.location.replace("{{ '/articles/' | relative_url }}");
</script>
