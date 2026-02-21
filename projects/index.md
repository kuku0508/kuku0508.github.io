---
layout: single
title: "專案"
permalink: /projects/
classes: wide portal-archive projects-page
---

<div class="portal-shell">
  <section class="portal-card">
    <h1 class="portal-card__title">專案作品集</h1>
    <p class="post-item__excerpt">可透過標籤勾選快速篩選，預覽後可直接點進專案頁。</p>

    {% if site.data.projects and site.data.projects.size > 0 %}
    <section class="tag-filter" data-filter-scope="projects">
      <div class="tag-filter__top">
        <strong class="tag-filter__label">標籤篩選</strong>
        <div class="filter-mode" role="radiogroup" aria-label="專案篩選模式">
          <input type="radio" id="projects-mode-or" name="filter-mode-projects" value="or" checked>
          <label for="projects-mode-or">OR</label>
          <input type="radio" id="projects-mode-and" name="filter-mode-projects" value="and">
          <label for="projects-mode-and">AND</label>
        </div>
        <button type="button" class="filter-reset" data-filter-reset>清除篩選</button>
      </div>

      <p class="filter-summary" data-filter-count></p>

      {% assign project_tag_string = "" %}
      {% for project in site.data.projects %}
        {% for tag in project.tags %}
          {% assign project_tag_string = project_tag_string | append: tag | append: "||" %}
        {% endfor %}
      {% endfor %}
      {% assign project_tags = project_tag_string | split: "||" | uniq | sort %}

      <div class="filter-chip-list">
        {% for tag_name in project_tags %}
          {% if tag_name != "" %}
            {% assign project_tag_count = 0 %}
            {% for project in site.data.projects %}
              {% if project.tags contains tag_name %}
                {% assign project_tag_count = project_tag_count | plus: 1 %}
              {% endif %}
            {% endfor %}
            {% assign tag_token = tag_name | downcase | replace: " ", "-" | replace: "/", "-" | replace: "#", "" | replace: ",", "" %}
            <label class="filter-chip">
              <input type="checkbox" value="{{ tag_token }}">
              <span>#{{ tag_name }} ({{ project_tag_count }})</span>
            </label>
          {% endif %}
        {% endfor %}
      </div>

      <div class="projects-grid" data-filter-items>
        {% for project in site.data.projects %}
        {% capture project_tokens %}
          {% if project.tags and project.tags.size > 0 %}
            {% for tag in project.tags %}
              {{ tag | downcase | replace: " ", "-" | replace: "/", "-" | replace: "#", "" | replace: ",", "" }}{% unless forloop.last %} {% endunless %}
            {% endfor %}
          {% endif %}
        {% endcapture %}
        <a class="project-card project-card--tile" href="{{ project.url | relative_url }}" data-tags="{{ project_tokens | strip }}">
          <div class="project-card__media">
            {% if project.image %}
            <img src="{{ project.image | relative_url }}" alt="{{ project.title }}">
            {% else %}
            <div class="project-card__placeholder">
              <span>PROJECT DEMO</span>
            </div>
            {% endif %}
          </div>

          <div class="project-card__body">
            <h2 class="project-card__title">{{ project.title }}</h2>
            <p class="project-card__desc">{{ project.summary }}</p>
            {% if project.tags and project.tags.size > 0 %}
            <div class="project-card__meta">
              {% for tag in project.tags %}
              <span class="tag">#{{ tag }}</span>
              {% endfor %}
            </div>
            {% endif %}
          </div>

          <div class="project-card__footer">
            <span>查看專案 →</span>
          </div>
        </a>
        {% endfor %}
      </div>

      <p class="filter-empty" data-filter-empty hidden>
        找不到符合條件的專案，請調整勾選標籤或切換 OR/AND。
      </p>
    </section>
    {% else %}
    <article class="post-item">
      <p class="post-item__excerpt">目前尚無專案資料。</p>
    </article>
    {% endif %}
  </section>
</div>
