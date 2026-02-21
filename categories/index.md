---
layout: single
title: "分類"
permalink: /categories/
classes: wide portal-archive
---

<div class="portal-shell">
  <section class="portal-card">
    <h1 class="portal-card__title">分類</h1>
    {% if site.categories and site.categories.size > 0 %}
      {% assign sorted_categories = site.categories | sort %}
      {% for category in sorted_categories %}
      {% assign category_anchor = category[0] | replace: " ", "-" | replace: "/", "-" | replace: "#", "" %}
      <section class="taxonomy-block" id="{{ category_anchor }}">
        <h2>{{ category[0] }} ({{ category[1].size }})</h2>
        <ul class="taxonomy-posts">
          {% for post in category[1] %}
          <li>
            <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
            <span class="post-item__meta">({{ post.date | date: "%Y-%m-%d" }})</span>
          </li>
          {% endfor %}
        </ul>
      </section>
      {% endfor %}
    {% else %}
      <p>目前沒有分類資料，新增文章後會自動生成。</p>
    {% endif %}
  </section>
</div>
