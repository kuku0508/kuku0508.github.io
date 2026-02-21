---
layout: single
title: "文章"
permalink: /articles/
classes: wide portal-archive
---

<div class="portal-shell">
  <section class="portal-card">
    <h1 class="portal-card__title">文章總覽</h1>

    <section class="tag-filter" data-filter-scope="articles">
      <div class="tag-filter__top">
        <strong class="tag-filter__label">標籤篩選</strong>
        <div class="filter-mode" role="radiogroup" aria-label="文章篩選模式">
          <input type="radio" id="articles-mode-or" name="filter-mode-articles" value="or" checked>
          <label for="articles-mode-or">OR</label>
          <input type="radio" id="articles-mode-and" name="filter-mode-articles" value="and">
          <label for="articles-mode-and">AND</label>
        </div>
        <button type="button" class="filter-reset" data-filter-reset>清除篩選</button>
      </div>

      <p class="filter-summary" data-filter-count></p>

      {% if site.tags and site.tags.size > 0 %}
      {% assign sorted_tags = site.tags | sort %}
      <div class="filter-chip-list">
        {% for tag in sorted_tags %}
        {% assign tag_name = tag[0] %}
        {% assign tag_token = tag_name | downcase | replace: " ", "-" | replace: "/", "-" | replace: "#", "" | replace: ",", "" %}
        <label class="filter-chip">
          <input type="checkbox" value="{{ tag_token }}">
          <span>#{{ tag_name }} ({{ tag[1].size }})</span>
        </label>
        {% endfor %}
      </div>
      {% else %}
      <p class="post-item__excerpt">目前沒有可用標籤。</p>
      {% endif %}

      <div class="portal-list" data-filter-items>
        {% if site.posts and site.posts.size > 0 %}
          {% for post in site.posts %}
          {% capture post_tokens %}
            {% if post.tags and post.tags.size > 0 %}
              {% for tag in post.tags %}
                {{ tag | downcase | replace: " ", "-" | replace: "/", "-" | replace: "#", "" | replace: ",", "" }}{% unless forloop.last %} {% endunless %}
              {% endfor %}
            {% endif %}
          {% endcapture %}
          <article class="post-item" data-tags="{{ post_tokens | strip }}">
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
              <span class="chip">#{{ tag }}</span>
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

      <p class="filter-empty" data-filter-empty hidden>
        找不到符合條件的文章，請調整勾選標籤或切換 OR/AND。
      </p>
    </section>
  </section>
</div>
