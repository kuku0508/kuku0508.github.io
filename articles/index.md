---
layout: single
title: "文章"
permalink: /articles/
classes: wide portal-archive
---

<div class="portal-shell">
  <section class="portal-card">
    <h1 class="portal-card__title">文章總覽</h1>
    <div class="portal-list">
      {% if site.posts and site.posts.size > 0 %}
        {% for post in site.posts %}
        <article class="post-item">
          <h2 class="post-item__title">
            <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
          </h2>
          <div class="post-item__meta">
            {{ post.date | date: "%Y-%m-%d" }}
            {% if post.categories and post.categories.size > 0 %} / {{ post.categories | join: ", " }}{% endif %}
          </div>
          <p class="post-item__excerpt">{{ post.excerpt | strip_html | truncate: 220 }}</p>
          {% if post.tags and post.tags.size > 0 %}
          <div class="post-item__chips">
            {% for tag in post.tags %}
            {% assign tag_anchor = tag | replace: " ", "-" | replace: "/", "-" | replace: "#", "" %}
            <a class="chip" href="{{ '/tags/' | relative_url }}#{{ tag_anchor }}">#{{ tag }}</a>
            {% endfor %}
          </div>
          {% endif %}
        </article>
        {% endfor %}
      {% else %}
        <article class="post-item">
          <p class="post-item__excerpt">目前尚無文章。你可以先到「專案」頁看完整作品。</p>
        </article>
      {% endif %}
    </div>
  </section>
</div>
