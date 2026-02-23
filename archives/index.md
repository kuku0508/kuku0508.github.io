---
layout: single
title: "文章與專案時間軸"
permalink: /archives/
classes: wide portal-archive timeline-page
---

<div class="portal-shell">
  <section class="portal-card timeline-panel">
    <section class="timeline-stream">
      <p class="timeline-stream__desc">左側 sidebar 可分別設定文章與專案標籤篩選（各自 OR / AND）。</p>

      {% assign year_string = "" %}
      {% for post in site.posts %}
        {% assign post_year = post.date | date: "%Y" %}
        {% assign year_string = year_string | append: post_year | append: "||" %}
      {% endfor %}
      {% for project in site.data.projects %}
        {% if project.date %}
          {% assign project_year = project.date | slice: 0, 4 %}
          {% assign year_string = year_string | append: project_year | append: "||" %}
        {% endif %}
      {% endfor %}
      {% assign timeline_years = year_string | split: "||" | uniq | sort | reverse %}

      <div class="timeline-track" data-timeline-items>
        {% for year in timeline_years %}
          {% if year != "" %}
            {% assign merged_rows = "" %}
            {% assign year_total = 0 %}
            {% assign year_article_total = 0 %}
            {% assign year_project_total = 0 %}

            {% for post in site.posts %}
              {% assign post_year = post.date | date: "%Y" %}
              {% if post_year == year %}
                {% capture post_tokens %}
                  {% if post.tags and post.tags.size > 0 %}
                    {% for tag in post.tags %}
                      {{ tag | downcase | replace: " ", "-" | replace: "/", "-" | replace: "#", "" | replace: ",", "" }}{% unless forloop.last %} {% endunless %}
                    {% endfor %}
                  {% endif %}
                {% endcapture %}
                {% assign post_row = post.date | date: "%Y-%m-%d" | append: "||article||" | append: post.url | append: "||" | append: post.title | append: "||" | append: post_tokens | strip %}
                {% assign merged_rows = merged_rows | append: post_row | append: "%%" %}
                {% assign year_total = year_total | plus: 1 %}
                {% assign year_article_total = year_article_total | plus: 1 %}
              {% endif %}
            {% endfor %}

            {% for project in site.data.projects %}
              {% if project.date %}
                {% assign row_year = project.date | slice: 0, 4 %}
                {% if row_year == year %}
                  {% capture project_tokens %}
                    {% if project.tags and project.tags.size > 0 %}
                      {% for tag in project.tags %}
                        {{ tag | downcase | replace: " ", "-" | replace: "/", "-" | replace: "#", "" | replace: ",", "" }}{% unless forloop.last %} {% endunless %}
                      {% endfor %}
                    {% endif %}
                  {% endcapture %}
                  {% assign project_row = project.date | append: "||project||" | append: project.url | append: "||" | append: project.title | append: "||" | append: project_tokens | strip %}
                  {% assign merged_rows = merged_rows | append: project_row | append: "%%" %}
                  {% assign year_total = year_total | plus: 1 %}
                  {% assign year_project_total = year_project_total | plus: 1 %}
                {% endif %}
              {% endif %}
            {% endfor %}

            {% if year_total > 0 %}
              {% assign merged_items = merged_rows | split: "%%" | sort | reverse %}
              <section class="timeline-year" data-timeline-year>
                <h3 class="timeline-year__title">
                  <span>{{ year }}</span>
                  <span class="timeline-year__counts">
                    <span class="timeline-year__count timeline-year__count--article">
                      <span class="timeline-year__count-icon" aria-hidden="true">
                        <i class="fas fa-feather-alt"></i>
                      </span>
                      <span class="timeline-year__count-divider" aria-hidden="true"></span>
                      <span class="timeline-year__count-number" data-timeline-year-article-count>{{ year_article_total }}</span>
                    </span>
                    <span class="timeline-year__count timeline-year__count--project">
                      <span class="timeline-year__count-icon" aria-hidden="true">
                        <i class="fas fa-folder-open"></i>
                      </span>
                      <span class="timeline-year__count-divider" aria-hidden="true"></span>
                      <span class="timeline-year__count-number" data-timeline-year-project-count>{{ year_project_total }}</span>
                    </span>
                  </span>
                </h3>
                <ul class="timeline-list">
                  {% for item in merged_items %}
                    {% if item != "" %}
                      {% assign fields = item | split: "||" %}
                      {% assign item_date = fields[0] %}
                      {% assign item_kind = fields[1] %}
                      {% assign item_url = fields[2] %}
                      {% assign item_title = fields[3] %}
                      {% assign item_tags = fields[4] | default: "" %}
                      <li
                        class="timeline-item"
                        data-kind="{{ item_kind }}"
                        data-post-tags="{% if item_kind == 'article' %}{{ item_tags | strip }}{% endif %}"
                        data-project-tags="{% if item_kind == 'project' %}{{ item_tags | strip }}{% endif %}"
                      >
                        <span class="timeline-item__marker" aria-hidden="true">
                          {% if item_kind == "article" %}
                            <i class="fas fa-feather-alt"></i>
                          {% else %}
                            <i class="fas fa-folder-open"></i>
                          {% endif %}
                        </span>
                        <span class="timeline-item__date">{{ item_date | slice: 5, 5 }}</span>
                        <a class="timeline-item__link" href="{{ item_url | relative_url }}">{{ item_title }}</a>
                        <span class="timeline-item__kind">{% if item_kind == "article" %}文章{% else %}專案{% endif %}</span>
                      </li>
                    {% endif %}
                  {% endfor %}
                </ul>
              </section>
            {% endif %}
          {% endif %}
        {% endfor %}
      </div>

      <p class="filter-empty timeline-empty" data-timeline-empty hidden>
        找不到符合條件的內容，請在左側調整文章或專案的標籤篩選條件。
      </p>
    </section>
  </section>
</div>
