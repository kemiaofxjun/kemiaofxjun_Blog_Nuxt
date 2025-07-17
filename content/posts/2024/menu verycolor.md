---
title: 菜单栏多色动态图标
description: 这篇文章主要简述了在博客菜单栏中进行适配彩色动态图标，并教导如何使用彩色动态图标。
date: 2025-02-05 10:00
updated: 2025-02-07 12:00
image: https://sourceimage.s3.bitiful.net/img/default_cover_9.avif
categories: [hexo]
tags: [hexo, butterfly]
recommend: true
---
# 一.添加iconfont
打开[iconfont](https://www.iconfont.cn/)，进行注册，注册完毕后在搜索栏中进行搜索，搜索到对应图标选择图标，点击右上角进入添加图标到选定的图标库名称。
进入到图标库后可以选择项目设置，设置彩色图标,设置页面如下，我们选择彩色，如果需要自定义图标，可以在这里自定义, **这里不推荐自定义**
![如图所示](https://blog.myxz.top/img/2025/01/iconfont/1.avif)
# 二.添加到菜单

前置教程：[Hexo引入阿里矢量图标库-iconfont inject](https://akilar.top/posts/d2ebecef/)和[基于Butterfly的外挂标签引入-Tag Plugins Plus](https://akilar.top/posts/615e2dec/#%E5%8A%A8%E6%80%81%E6%A0%87%E7%AD%BE-anima)中关于动态标签anima的内容。请确保您已经完成了前置教程，并实现了在文章中使用symbol写法来引入iconfont图标。同时引入了fontawesome_animation的前置依赖。
主要检查您的inject配置项中是否有这两个依赖

```YAML
inject:
  head:
    #动画标签anima的依赖
    - <link rel="stylesheet" href="https://cdn.jsdmirror.com/gh/l-lin/font-awesome-animation/dist/font-awesome-animation.min.css"  media="defer" onload="this.media='all'">
  bottom:
    # 阿里矢量图标,这串是我的图标库，你的链接会有所不同。
    - <script async src="//at.alicdn.com/t/font_2032782_ev6ytrh30f.js"></script>
```

## 1.修改pug文件**
替换**BlogRoot\themes\butterfly\layout\includes\header\menu_item.pug**为以下代码，本方案默认使用观感最佳的悬停父元素触发子元素动画效果，默认动画为faa-tada。**注意：可以把之前的代码注释掉，再在后面加上如下代码，以便于回滚**。我这里放出fomal的4.3.1版本以及我修改的4.5.0版本（当然4.5.1也可以自己进行修改）。

### 4.3.1版本
```pug
if theme.menu
  .menus_items
    each value, label in theme.menu
      if typeof value !== 'object'
        .menus_item
          - const valueArray = value.split('||')
          a.site-page.faa-parent.animated-hover(href=url_for(trim(value.split('||')[0])))
            if valueArray[1]
              i.fa-fw(class=trim(valueArray[1]))
              - var icon_value = trim(value.split('||')[1])
              - var anima_value = value.split('||')[2] ? trim(value.split('||')[2]) : 'faa-tada'
              if icon_value.substring(0,2)=="fa"      
                i.fa-fw(class=icon_value + ' ' + anima_value)
              else if icon_value.substring(0,4)=="icon"          
                svg.icon(aria-hidden="true" class=anima_value)
                  use(xlink:href=`#`+ icon_value)
            span=' '+label
      else
        .menus_item
          - const labelArray = label.split('||')
          - const hideClass = labelArray[3] && trim(labelArray[3]) === 'hide' ? 'hide' : ''
          a.site-page.group.faa-parent.animated-hover(class=`${hideClass}` href='javascript:void(0);')
            if labelArray[1]
              - var icon_label = trim(label.split('||')[1])
              - var anima_label = label.split('||')[2] ? trim(label.split('||')[2]) : 'faa-tada'
              if icon_label.substring(0,2)=="fa"      
                i.fa-fw(class=icon_label + ' ' + anima_label)
              else if icon_label.substring(0,4)=="icon"    
                svg.icon(aria-hidden="true" class=anima_label)
                  use(xlink:href=`#`+ icon_label)
            span=' '+ trim(labelArray[0])
            i.fas.fa-chevron-down
          ul.menus_item_child
            each val,lab in value 
              - const valArray = val.split('||')
              li
                a.site-page.child.faa-parent.animated-hover(href=url_for(trim(val.split('||')[0])))
                  if valArray[1]
                    - var icon_val = trim(val.split('||')[1])
                    - var anima_val = val.split('||')[2] ? trim(val.split('||')[2]) : 'faa-tada'
                    if icon_val.substring(0,2)=="fa"      
                      i.fa-fw(class=icon_val + ' ' + anima_val)
                    else if icon_val.substring(0,4)=="icon"
                      svg.icon(aria-hidden="true" class=anima_val)
                        use(xlink:href=`#`+ icon_val)                    
                  span=' '+ lab
```

### 4.5.0 版本

```pug
if theme.menu
  .menus_items
    each value, label in theme.menu
      if typeof value !== 'object'
        .menus_item
          - const valueArray = value.split('||')
          a.site-page.faa-parent.animated-hover(href=url_for(trim(value.split('||')[0])))
            if valueArray[1]
              - var icon_value = trim(value.split('||')[1])
              - var anima_value = value.split('||')[2] ? trim(value.split('||')[2]) : 'faa-tada'
              if icon_value.substring(0,2)=="fa"
                i.fa-fw(class=icon_value + ' ' + anima_value)
              else if icon_value.substring(0,4)=="icon"
                svg.icon(aria-hidden="true" class=anima_value)
                  use(xlink:href=`#`+ icon_value)
            span=' '+label
      else
        .menus_item
          - const labelArray = label.split('||')
          - const hideClass = labelArray[2] && trim(labelArray[2]) === 'hide' ? 'hide' : ''
          a.site-page.group(class=`${hideClass}` href='javascript:void(0);')
            if labelArray[1]
              - var icon_label = trim(label.split('||')[1])
              - var anima_label = label.split('||')[2] ? trim(label.split('||')[2]) : 'faa-tada'
              if icon_label.substring(0,2)=="fa"
                i.fa-fw(class=icon_label + ' ' + anima_label)
              else if icon_label.substring(0,4)=="icon"
                svg.icon(aria-hidden="true" class=anima_label)
                  use(xlink:href=`#`+ icon_label)
            span=' '+ trim(labelArray[0])
            i.fas.fa-chevron-down
          ul.menus_item_child
            each val,lab in value 
              - const valArray = val.split('||')
              li
                a.site-page.child.faa-parent.animated-hover(href=url_for(trim(val.split('||')[0])))
                  if valArray[1]
                    - var icon_val = trim(val.split('||')[1])
                    - var anima_val = val.split('||')[2] ? trim(val.split('||')[2]) : 'faa-tada'
                    if icon_val.substring(0,2)=="fa"
                      i.fa-fw(class=icon_val + ' ' + anima_val)
                    else if icon_val.substring(0,4)=="icon"
                      svg.icon(aria-hidden="true" class=anima_val)
                        use(xlink:href=`#`+ icon_val)
                  span=' '+ lab
```

## 2.修改配置文件
以下是填写示例，在[BlogRoot]\_config.butterfly.yml中修改。icon-xxx字样的为iconfont的symbol引入方案的id值，可以在你的iconfont图标库内查询，其中hide属性也是可以用的。
```YML
menu:
  首页: / || icon-home || faa-tada
  文章 || icon--article || faa-tada || hide:
    归档: /archives/ || icon-guidang1 || faa-tada
    标签: /tags/ || icon-sekuaibiaoqian || faa-tada
    分类: /categories/ || icon-fenlei || faa-tada
    随便逛逛: javascript:randomPost(); || icon-zuji1 || faa-tada
```
## 3.添加css样式表
```CSS
svg.icon {
  width: 1.28em;
  height: 1.28em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
```