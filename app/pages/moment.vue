<script setup lang="ts">
const appConfig = useAppConfig()
const layoutStore = useLayoutStore()

layoutStore.setAside(['blog-stats', 'connectivity', 'blog-log'])

useSeoMeta({
    title: '友链朋友圈',
    ogType: 'profile',
    description: `${appConfig.title}的友链朋友圈页面。`,
})
</script>

<template>
    <div class="moment_page_banner" style="background-image:url(/assets/img/page_backgroud/moment.webp);">
        <div class="moment_banner_content">
            <h1>
                朋友圈
            </h1>
            <p>
                发现更多有趣的博主
            </p>
        </div>
        <div class="moment_banner_extra">
            <div class="moment_friend_stats">
                <div class="moment_update_time">
                    Updated at 2025-07-06
                </div>
                <div class="powered_by">
                    Powered by FriendCircleLite
                </div>
            </div>
        </div>
    </div>
    <div class="moment_page_fcircle">
        <script>
            if (typeof UserConfig === 'undefined') {
                var UserConfig = {
                    // 填写你的fc Lite地址
                    private_api_url: 'https://moments.myxz.top/',
                    // 点击加载更多时，一次最多加载几篇文章，默认20
                    page_turning_number: 20,
                    // 头像加载失败时，默认头像地址
                    error_img: 'https://i.p-i.vip/30/20240815-66bced9226a36.webp',
                }
            }
        </script>
        <script src="https://fastly.jsdelivr.net/gh/willow-god/Friend-Circle-Lite/main/fclite.min.js"></script>
        <link rel="stylesheet" href="https://fastly.jsdelivr.net/gh/willow-god/Friend-Circle-Lite/main/fclite.min.css">
    </div>
</template>

<style>
.moment_page_banner {
    background-position: 50%;
    background-size: cover;
    border-radius: 8px;
    margin: 1rem;
    max-height: 320px;
    min-height: 256px;
    overflow: hidden;
    position: relative
}

.moment_page_banner .moment_banner_content {
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

.moment_page_banner .moment_banner_content h1 {
    font-size: 2rem
}

.moment_page_banner .moment_banner_content p {
    font-size: 1rem;
    opacity: .9
}

.moment_page_banner .moment_banner_extra {
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

.moment_page_banner .banner-btn {
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

.moment_page_banner .banner-btn:hover {
    background: #0003
}

.moment_page_banner .banner-btn .icon {
    font-size: 1.2rem
}
</style>