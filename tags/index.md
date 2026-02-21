---
layout: single
title: "標籤"
permalink: /tags/
classes: wide portal-archive
---

<div class="portal-shell">
  <section class="portal-card">
    <h1 class="portal-card__title">標籤</h1>
    {% if site.tags and site.tags.size > 0 %}
      {% assign sorted_tags = site.tags | sort %}
      {% for tag in sorted_tags %}
      {% assign tag_anchor = tag[0] | replace: " ", "-" | replace: "/", "-" | replace: "#", "" %}
      <section class="taxonomy-block" id="{{ tag_anchor }}">
        <h2>#{{ tag[0] }} ({{ tag[1].size }})</h2>
        <ul class="taxonomy-posts">
          {% for post in tag[1] %}
          <li>
            <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
            <span class="post-item__meta">({{ post.date | date: "%Y-%m-%d" }})</span>
          </li>
          {% endfor %}
        </ul>
      </section>
      {% endfor %}
    {% else %}
      <p>目前沒有標籤資料，新增文章後會自動生成。</p>
    {% endif %}
  </section>
</div>
