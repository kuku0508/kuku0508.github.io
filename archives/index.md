---
layout: single
title: "時間軸"
permalink: /archives/
classes: wide portal-archive
---

<div class="portal-shell">
  <section class="portal-card">
    <h1 class="portal-card__title">文章時間軸</h1>
    {% if site.posts and site.posts.size > 0 %}
      {% assign posts_by_year = site.posts | group_by_exp: "post", "post.date | date: '%Y'" %}
      {% for year in posts_by_year %}
      <section class="taxonomy-block">
        <h2>{{ year.name }}</h2>
        <ul class="taxonomy-posts">
          {% for post in year.items %}
          <li>
            <span class="post-item__meta">{{ post.date | date: "%m-%d" }}</span>
            <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
          </li>
          {% endfor %}
        </ul>
      </section>
      {% endfor %}
    {% else %}
      <p>目前沒有可顯示的文章。</p>
    {% endif %}
  </section>
</div>
