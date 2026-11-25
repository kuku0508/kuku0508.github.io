---
layout: single
author_profile: true
title: "首頁"
permalink: /
classes: wide portal-home
---

<div class="portal-shell">

  <section class="portal-hero">
    <h1 class="portal-hero__title">Kuku's Portfolio & Notes</h1>
    <p class="portal-hero__lead">
      這個網站用來整理我的作品與文章，主題聚焦在資料分析相關的內容，但當然也可能有一些雜七雜八的東西。  
      希望你可以找到你所好奇的東西。
    </p>
  </section>

  <div class="portal-layout">
    <div class="portal-column">

      <section class="portal-card">
        <h2 class="portal-card__title">最新文章</h2>

        <div class="portal-list">
          {% if site.posts and site.posts.size > 0 %}
            {% for post in site.posts limit: 6 %}
              <article class="post-item" data-clickable-card>
                <h3 class="post-item__title">
                  <a href="{{ post.url | relative_url }}" data-card-primary>
                    {{ post.title }}
                  </a>
                </h3>

                <div class="post-item__meta">
                  {{ post.date | date: "%Y-%m-%d" }}
                  {% if post.categories and post.categories.size > 0 %}
                    / {{ post.categories | join: ", " }}
                  {% endif %}
                </div>

                <p class="post-item__excerpt">
                  {{ post.excerpt | strip_html | truncate: 180 }}
                </p>

                {% if post.tags and post.tags.size > 0 %}
                  <div class="post-item__chips">
                    {% for tag in post.tags limit: 4 %}
                      <a class="chip" href="{{ '/articles/' | relative_url }}">
                        #{{ tag }}
                      </a>
                    {% endfor %}
                  </div>
                {% endif %}
              </article>
            {% endfor %}
          {% else %}
            <article class="post-item">
              <p class="post-item__excerpt">
                目前還沒有文章，之後會持續新增分析筆記與專案方法紀錄。
              </p>
            </article>
          {% endif %}
        </div>

        <a class="section-link" href="{{ '/articles/' | relative_url }}">
          看所有文章 →
        </a>
      </section>

      <section class="portal-card">
        <h2 class="portal-card__title">精選作品</h2>

        <div class="portal-list">
          {% assign featured_projects = site.data.projects | where_exp: "project", "project.hidden != true" %}
          {% for project in featured_projects %}
          <article class="project-mini" data-clickable-card>
            <h3>
              <a href="{{ project.url | relative_url }}" data-card-primary>
                {{ project.title }}
              </a>
            </h3>
            <p>{{ project.summary }}</p>
            <a class="chip" href="{{ project.url | relative_url }}">
              查看專案
            </a>
          </article>
          {% endfor %}
        </div>
      </section>

    </div>
  </div>

</div>

