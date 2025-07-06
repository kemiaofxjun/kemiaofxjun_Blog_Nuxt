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
    <div class="essays_page_banner" style="background-image:url(/assets/img/page_backgroud/moment.webp);">
        <div class="essays_banner_content">
            <h1>
                朋友圈
            </h1>
            <p>
                发现更多有趣的博主
            </p>
        </div>
        <div class="essays_banner_extra">
            <div class="essays_friend_stats">
                <div class="essays_update_time">
                    Updated at 2025-07-06
                </div>
                <div class="essays_powered_by">
                    Powered by FriendCircleLite
                </div>
            </div>
        </div>
    </div>
    <div class="ispeak_content">
        <div id="tip" style="text-align:center;">
            ipseak加载中
        </div>
        <div id="ispeak">
        </div>
        <link 
            rel="stylesheet" 
            href="https://cdn.staticfile.org/highlight.js/10.6.0/styles/atom-one-dark.min.css"
        />
        <link
            rel="stylesheet"
            href="https://jsd.myxz.top/npm/ispeak@4.4.0/style.css"
        />
        <script src="https://cdn.staticfile.org/highlight.js/10.6.0/highlight.min.js"></script>
        <script src="https://cdn.staticfile.org/marked/2.0.0/marked.min.js"></script>
        <script src="https://jsd.myxz.top/npm/ispeak@4.4.0/ispeak.umd.js"></script>
    </div>
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
        loading_img: 'https://bu.dusays.com/2021/03/04/d2d5e983e2961.gif'
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

<style>
.essays_page_banner {
    background-position: 50%;
    background-size: cover;
    border-radius: 8px;
    margin: 1rem;
    max-height: 320px;
    min-height: 256px;
    overflow: hidden;
    position: relative
}

.essays_page_banner .essays_banner_content {
    color: #eee;
    display: flex;
    flex-direction: column;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    justify-content: space-between;
    padding: 1rem;
    position: absolute;
    text-shadow: 0 4px 5px rgba(0,0,0,.5)
}

.essays_page_banner .essays_banner_content h1 {
    font-size: 2rem
}

.essays_page_banner .essays_banner_content p {
    font-size: 1rem;
    opacity: .9
}

.essays_page_banner .essays_banner_extra {
    align-items: flex-end;
    display: flex;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    justify-content: flex-end;
    margin: 1rem;
    position: absolute
}

.essays_page_banner .banner-btn {
    align-items: center;
    -webkit-backdrop-filter: blur(5px);
    backdrop-filter: blur(5px);
    background: #ffffff1a;
    border-radius: 20px;
    color: #eee;
    display: flex;
    font-size: .9rem;
    gap: .1rem;
    opacity: .8;
    padding: .5rem .8rem;
    transition: all .3s
}

.essays_page_banner .banner-btn:hover {
    background: #0003
}

.essays_page_banner .banner-btn .icon {
    font-size: 1.2rem
}

.essays_friend_stats {
    align-items: flex-end;
    color: #eee;
    display: flex;
    flex-direction: column;
    font-family: var(--font-monospace);
    font-size: .7rem;
    gap: .1rem;
    opacity: .7;
    text-shadow: 0 4px 5px rgba(0,0,0,.5)
}

.essays_friend_stats .essays_update_time {
    opacity: 1
}

.essays_friend_stats .essays_powered_by {
    opacity: .8
}
</style>