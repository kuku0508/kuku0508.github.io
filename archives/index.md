---
layout: single
title: "時間軸"
permalink: /archives/
classes: wide portal-archive timeline-page
---

<div class="portal-shell">
  <section class="portal-card timeline-panel">
    <h1 class="portal-card__title">時間軸</h1>

    <section class="timeline-stream">
      <h2 class="timeline-stream__title">文章時間軸</h2>
      <section class="tag-filter" data-filter-scope="articles">
        <div class="tag-filter__top">
          <strong class="tag-filter__label">文章標籤篩選</strong>
          <div class="filter-mode" role="radiogroup" aria-label="文章篩選模式">
            <input type="radio" id="archives-articles-mode-or" name="filter-mode-archives-articles" value="or" checked>
            <label for="archives-articles-mode-or">OR</label>
            <input type="radio" id="archives-articles-mode-and" name="filter-mode-archives-articles" value="and">
            <label for="archives-articles-mode-and">AND</label>
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
        {% endif %}

        <div class="timeline-track" data-filter-items>
          {% if site.posts and site.posts.size > 0 %}
          {% assign posts_by_year = site.posts | group_by_exp: "post", "post.date | date: '%Y'" %}
          {% for year in posts_by_year %}
          <section class="timeline-year" data-filter-group>
            <h3 class="timeline-year__title">
              <span>{{ year.name }}</span>
              <span class="timeline-year__count" data-filter-group-count>{{ year.items.size }}</span>
            </h3>
            <ul class="timeline-list">
              {% for post in year.items %}
              {% capture post_tokens %}
                {% if post.tags and post.tags.size > 0 %}
                  {% for tag in post.tags %}
                    {{ tag | downcase | replace: " ", "-" | replace: "/", "-" | replace: "#", "" | replace: ",", "" }}{% unless forloop.last %} {% endunless %}
                  {% endfor %}
                {% endif %}
              {% endcapture %}
              <li class="timeline-item" data-tags="{{ post_tokens | strip }}">
                <span class="timeline-item__date">{{ post.date | date: "%m-%d" }}</span>
                <a class="timeline-item__link" href="{{ post.url | relative_url }}">{{ post.title }}</a>
              </li>
              {% endfor %}
            </ul>
          </section>
          {% endfor %}
          {% endif %}
        </div>

        <p class="filter-empty" data-filter-empty hidden>
          找不到符合條件的文章，請調整勾選標籤或切換 OR/AND。
        </p>
      </section>
    </section>

    <section class="timeline-stream">
      <h2 class="timeline-stream__title">專案時間軸</h2>
      <section class="tag-filter" data-filter-scope="projects">
        <div class="tag-filter__top">
          <strong class="tag-filter__label">專案標籤篩選</strong>
          <div class="filter-mode" role="radiogroup" aria-label="專案篩選模式">
            <input type="radio" id="archives-projects-mode-or" name="filter-mode-archives-projects" value="or" checked>
            <label for="archives-projects-mode-or">OR</label>
            <input type="radio" id="archives-projects-mode-and" name="filter-mode-archives-projects" value="and">
            <label for="archives-projects-mode-and">AND</label>
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

        <div class="timeline-track" data-filter-items>
          {% assign projects_sorted = site.data.projects | sort: "date" | reverse %}
          {% assign projects_by_year = projects_sorted | group_by_exp: "project", "project.date | slice: 0, 4" %}
          {% for year in projects_by_year %}
          <section class="timeline-year" data-filter-group>
            <h3 class="timeline-year__title">
              <span>{{ year.name }}</span>
              <span class="timeline-year__count" data-filter-group-count>{{ year.items.size }}</span>
            </h3>
            <ul class="timeline-list">
              {% for project in year.items %}
              {% capture project_tokens %}
                {% if project.tags and project.tags.size > 0 %}
                  {% for tag in project.tags %}
                    {{ tag | downcase | replace: " ", "-" | replace: "/", "-" | replace: "#", "" | replace: ",", "" }}{% unless forloop.last %} {% endunless %}
                  {% endfor %}
                {% endif %}
              {% endcapture %}
              <li class="timeline-item" data-tags="{{ project_tokens | strip }}">
                <span class="timeline-item__date">{{ project.date | slice: 5, 5 }}</span>
                <a class="timeline-item__link" href="{{ project.url | relative_url }}">{{ project.title }}</a>
                <span class="timeline-item__kind">專案</span>
              </li>
              {% endfor %}
            </ul>
          </section>
          {% endfor %}
        </div>

        <p class="filter-empty" data-filter-empty hidden>
          找不到符合條件的專案，請調整勾選標籤或切換 OR/AND。
        </p>
      </section>
    </section>
  </section>
</div>
