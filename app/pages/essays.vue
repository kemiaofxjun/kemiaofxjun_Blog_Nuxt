<script setup lang="ts">
const appConfig = useAppConfig()
const layoutStore = useLayoutStore()

layoutStore.setAside(['blog-stats', 'connectivity', 'blog-log'])

useSeoMeta({
    title: '说说',
    ogType: 'profile',
    description: `${appConfig.title}的说说页面。`,
})

const { data: postLink } = await useAsyncData('/essays', () => queryContent('/essays').findOne())
</script>

<template>
    <div class="essays_page_banner" style="background-image:url(/assets/img/page_backgroud/moment.webp);">
        <div class="essays_banner_content">
            <h1>
                说说
            </h1>
            <p>
                记录生活，瞬间发布。
            </p>
        </div>
        <div class="essays_banner_extra">
            <div class="essays_friend_stats">
                <div class="essays_update_time">
                    Updated at 2025-07-06
                </div>
                <div class="essays_powered_by">
                    Powered by Ispeak
                </div>
            </div>
        </div>
    </div>
    <div class="essay_connect">
        <script src="/assets/js/essay.js"></script>
        <div id="bibi">
        <div class="bb-info"></div><div id="bb-main"></div>
        </div>
    </div>
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

<style>
/* 哔哔页面 */
#bibi button {
  color: #fff;
  border: 0;
  margin: 20px auto;
  border-radius: 0.3125rem;
  display: block;
  padding: 0 1rem;
  height: 40px;
  font-weight: 500;
  text-align: center;
  transition: all 0.5s ease-out;
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 1000% 1000%;
  animation: Gradient 60s linear infinite;
  outline: 0;
}

#bibi .bb-info {
  font-weight: 700;
  font-size: 22px;
}

#bibi .bb-card {
  padding: 15px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #a5a5a5ee;
  margin-top: 20px;
  transition: all 0.25s;
  user-select: none;
  margin: 10px;
}

@media screen and (max-width: 800px) {
  #bibi .bb-card {
  width: 100%;
  }
}

#bibi .bb-card:hover {
  box-shadow: 0 5px 10px 8px #07111b29;
  transform: translateY(-3px);
}

#bibi .card-header {
  display: flex;
  align-items: center;
}

#bibi .card-header .avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 10px;
  border-radius: 20px;
  overflow: hidden;
}

#bibi .card-header svg {
  height: 20px;
  width: 20px;
  margin-left: 5px;
}

#bibi .card-header .card-time {
  font-size: 12px;
  text-shadow: #d9d9d9 0 0 1px, #fffffb 0 0 1px, #fffffb 0 0 2px;
  margin-left: 10px;
}

#bibi .card-content {
  padding: 10px 0;
  white-space: pre-wrap;
}

#bibi .card-footer {
  display: flex;
  padding-bottom: 10px;
}

#bibi .card-footer .card-label {
  border-radius: 5px;
  padding: 0 5px;
  font-weight: 550;
  border-radius: 5px;
  box-shadow: inset 0 -1px 0 rgb(27 31 35 / 12%);
  font-size: 14px;
  user-select: none;
  margin-right: 10px;
}

div#bb_loading img{
  border-radius: 15px;
}
</style>