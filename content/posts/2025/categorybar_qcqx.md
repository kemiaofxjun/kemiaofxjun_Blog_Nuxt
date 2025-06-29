---
title: 首页分类条美化
description: 从零开始魔改butterfly
date: 2025-03-05 8:00
updated: 2025-03-06 18:00
image: https://sourceimage.s3.bitiful.net/img/default_cover_19.avif
category: [hexo]
tags: [hexo, butterfly]
---
# 前言
教程基于清羽飞扬的教程和轻笑的样式进行魔改，感兴趣的可以去看。

# 教程开始
1. 在[BlogRoot]\themes\butterfly\layout\includes中新建categoryBar.pug
``` PUG
.home-catalog-bar#catalog-bar
  i.fa-fw.fas.fa-shapes
  #catalog-list(class=is_home() ? 'home' : '')
    .category-bar-item.catalog-shouye-item(class=is_home() ? 'select' : '', id="home-catalog-item")
      a(href=url_for('/'))= __('博客')
    each item in site.categories.find({ parent: { $exists: false } }).data
      .category-bar-item(class=select ? (select === item.name ? 'select' : '') : '', id=item.name)
        a(href=url_for(item.path))= item.name
  a.category-bar-more(href=url_for('/categories/'))= __('更多分类')
```
2. 然后将其添加到不同的位置，比如我这里实现了添加到分类页面等位置，配合上pjax可以做到无刷更新，效果很好，打开分类文件地址：[BlogRoot]\themes\butterfly\layout\category.pug和主页文件地址：[BlogRoot]\themes\butterfly\layout\index.pug，添加其中两行代码，去掉加号即为正常缩进。这个和原教程基本一样
{% tabs 分栏 %}

<!-- tab 分类文件 -->

{% note warning flat %}
注意：修改后需要将配置文件中，分类页面的主题改成index，否则不会显示。
{% endnote %}

``` PUG
extends includes/layout.pug

block content
  if theme.category_ui == 'index'
    include ./includes/mixins/post-ui.pug
    #recent-posts.recent-posts.category_ui
+      #category-bar.category-bar
+        include includes/categoryBar.pug
      +postUI
      include includes/pagination.pug
  else
    include ./includes/mixins/article-sort.pug
    #category
      <div id="categories-chart" data-parent="true" style="height: 300px; padding: 10px;"></div>
      .article-sort-title= _p('page.category') + ' - ' + page.category
      +articleSort(page.posts)
      include includes/pagination.pug
```
<!-- endtab -->

<!-- tab 主页文件 -->
``` PUG
extends includes/layout.pug

block content
  include ./includes/mixins/post-ui.pug
  #recent-posts.recent-posts
+    #category-bar.category-bar
+      include includes/categoryBar.pug
    +postUI
    include includes/pagination.pug
```
<!-- endtab -->
{% endtabs %}
3. 在[BlogRoot]\source\css\custom.css自定义样式的文件中引入如下代码（这是我的，你可以自行微调）：
```CSS
/* 首页分类条 */
.layout #recent-posts .home-catalog-bar {
    background: var(--mj-card-bg);
    border: var(--mj-style-border);
    margin-top: 12px;
    border-radius: 11px !important;
    transition: .3s;
    font-size: 15px;
    padding: 5px .8rem;
    animation: slide-in .5s .2s backwards;
    will-change: transform;
    -webkit-animation: slide-in .5s .2s backwards;
}

#catalog-bar {
    padding: .4rem .8rem;
    border-radius: .5rem;
    display: flex;
    border: 1px solid rgba(150, 150, 150, .2);
    justify-content: space-between;
}

#catalog-bar i {
    line-height: inherit;
}

#catalog-list {
    margin: 0 .5rem;
    display: flex;
}

.layout #recent-posts #catalog-bar #home-catalog-item {
    border-radius: .5rem;
}

.layout #recent-posts #catalog-bar .catalog-shouye-item {
    margin-right: 10px;
}

.layout #recent-posts #catalog-bar #home-catalog-item a {
    background: #00c4b6f1;
    color: #fff !important;
    margin: 0 .2em;
    padding: .2em .4em .3em;
    font-weight: 700;
    border-radius: .5rem;
    color: var(--font-color);
    -webkit-transition: all .15s ease-in-out;
    -moz-transition: all .15s ease-in-out;
    -o-transition: all .15s ease-in-out;
    -ms-transition: all .15s ease-in-out;
    transition: all .15s ease-in-out;
}

.catalog-list-item a {
    margin: 0 .2em;
    padding: .2em .4em .3em;
    font-weight: 700;
    border-radius: .5rem;
    color: var(--font-color);
    -webkit-transition: all .15s ease-in-out;
    -moz-transition: all .15s ease-in-out;
    -o-transition: all .15s ease-in-out;
    -ms-transition: all .15s ease-in-out;
    transition: all .15s ease-in-out;
}

.catalog-list-item a {
    margin: 0 .2em;
    padding: .2em .4em .3em;
    font-weight: 700;
    border-radius: .5rem;
    color: var(--font-color);
    -webkit-transition: all .15s ease-in-out;
    -moz-transition: all .15s ease-in-out;
    -o-transition: all .15s ease-in-out;
    -ms-transition: all .15s ease-in-out;
    transition: all .15s ease-in-out;
}
```