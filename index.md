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
      這個網站用來整理我的作品與文章，主題聚焦在資料分析、預測建模、模型解釋與視覺化。
      你可以先看最新文章，再到專案頁看完整案例與方法細節。
    </p>
  </section>

  <div class="portal-layout">
    <div class="portal-column">
      <section class="portal-card">
        <h2 class="portal-card__title">最新文章</h2>
        <div class="portal-list">
          {% if site.posts and site.posts.size > 0 %}
            {% for post in site.posts limit: 6 %}
            <article class="post-item">
              <h3 class="post-item__title">
                <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
              </h3>
              <div class="post-item__meta">
                {{ post.date | date: "%Y-%m-%d" }}
                {% if post.categories and post.categories.size > 0 %} / {{ post.categories | join: ", " }}{% endif %}
              </div>
              <p class="post-item__excerpt">{{ post.excerpt | strip_html | truncate: 180 }}</p>
              {% if post.tags and post.tags.size > 0 %}
              <div class="post-item__chips">
                {% for tag in post.tags limit: 4 %}
                <a class="chip" href="{{ '/articles/' | relative_url }}">#{{ tag }}</a>
                {% endfor %}
              </div>
              {% endif %}
            </article>
            {% endfor %}
          {% else %}
            <article class="post-item">
              <p class="post-item__excerpt">目前還沒有文章，之後會持續新增分析筆記與專案方法紀錄。</p>
            </article>
          {% endif %}
        </div>
        <a class="section-link" href="{{ '/articles/' | relative_url }}">看所有文章 →</a>
      </section>

      <section class="portal-card">
        <h2 class="portal-card__title">精選作品</h2>
        <div class="portal-grid-2">
          <article class="project-mini">
            <h3><a href="{{ '/projects/youbike_sna/' | relative_url }}">YouBike 站點互動網路與生活圈辨識</a></h3>
            <p>用 SNA 與社群偵測理解站點角色，並結合地圖視覺化觀察城市流動結構。</p>
            <a class="chip" href="{{ '/projects/youbike_sna/' | relative_url }}">查看專案</a>
          </article>
          <article class="project-mini">
            <h3><a href="{{ '/projects/survival_analysis/' | relative_url }}">Survival Analysis（設限資料）</a></h3>
            <p>整理含設限資料的分析流程，從資料處理到模型建構與結果解讀。</p>
            <a class="chip" href="{{ '/projects/survival_analysis/' | relative_url }}">查看專案</a>
          </article>
          <article class="project-mini">
            <h3><a href="{{ '/projects/kepler/' | relative_url }}">Kepler 望遠鏡資料集分析</a></h3>
            <p>針對時間序列資料進行清理、特徵工程與探索性分析，建立可重現流程。</p>
            <a class="chip" href="{{ '/projects/kepler/' | relative_url }}">查看專案</a>
          </article>
          <article class="project-mini">
            <h3><a href="{{ '/projects/' | relative_url }}">更多作品</a></h3>
            <p>完整專案列表包含分析背景、技術方法、實作重點與延伸想法。</p>
            <a class="chip" href="{{ '/projects/' | relative_url }}">前往專案總覽</a>
          </article>
        </div>
      </section>
    </div>

  </div>
</div>
