<script setup lang="ts">
const appConfig = useAppConfig()
const layoutStore = useLayoutStore()

layoutStore.setAside(['blog-stats', 'connectivity', 'blog-log'])

useSeoMeta({
    title: '说说',
    ogType: 'profile',
    description: `${appConfig.title}的说说页面。`,
})
</script>

<template>
    <div id="tip" style="text-align:center;">
        ipseak加载中
    </div>
    <div id="ispeak">
    </div>
    <link rel="stylesheet" href="https://cdn.staticfile.org/highlight.js/10.6.0/styles/atom-one-dark.min.css"/>
    <link rel="stylesheet" href="https://cdn.myxz.top/npm/ispeak@4.4.0/style.css"/>

    <script src="https://cdn.staticfile.org/highlight.js/10.6.0/highlight.min.js"></script>
    <script src="https://cdn.staticfile.org/marked/2.0.0/marked.min.js"></script>
    <script src="https://cdn.myxz.top/npm/ispeak@4.4.0/ispeak.umd.js"></script>
    <!-- CSS -->
    <link href="https://unpkg.com/artalk@2.3.4/dist/Artalk.css" rel="stylesheet" />
    <!-- JS -->
    <script src="https://unpkg.com/artalk@2.3.4/dist/Artalk.js"></script>
    <script>
        var head = document.getElementsByTagName('head')[0]
        var meta = document.createElement('meta')
        meta.name = 'referrer'
        meta.content = 'no-referrer'
        head.appendChild(meta)
        if (ispeak) {
            ispeak
            .init({
                el: '#ispeak',
                api: 'https://kkapi.myxz.top/',
                author: '61fe93508fd621d39a155725',
                pageSize: 10,
                loading_img: 'https://bu.dusays.com/2021/03/04/d2d5e983e2961.gif',
                comment: function (speak) {
                    // 4.4.0 之后在此回调函数中初始化评论
                    const { _id, title, content } = speak
                    const contentSub = content.substring(0, 30)
                    new Artalk({
                        el: '.ispeak-comment', // 默认情况下 ipseak 生成class为 ispeak-comment 的div
                        pageKey: '/speak/info.html?q=' + _id, // 手动传入当前speak的唯一id
                        pageTitle: title || contentSub, // 手动传入当前speak的标题(由于content可能过长，因此截取前30个字符)
                        server: 'https://api.antmoe.com/artalk/',
                        site: 'speak' // 你的站点名
                    })
                }
            })
            .then(function () {
                console.log('ispeak 加载完成')
                document.getElementById('tip').style.display = 'none'
            })
        } else {
            document.getElementById('tip').innerHTML = 'ipseak依赖加载失败！'
        }
    </script>
</template>