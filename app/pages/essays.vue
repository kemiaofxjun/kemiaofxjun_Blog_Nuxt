<script setup lang="ts">
import { Essays } from '~~/blog.config'
import essayData from '~/essayData'
const itemData = ref(essayData);

const appConfig = useAppConfig()
const layoutStore = useLayoutStore()

layoutStore.setAside(['blog-stats', 'contentivity', 'blog-log'])

useSeoMeta({
    title: '说说',
    ogType: 'profile',
    description: `${appConfig.title}的说说页面。`,
})

const essays_Data = {
    博主: Essays.author,
}

const { data: postLink } = await useAsyncData('/essays', () => queryContent('/essays').findOne())
</script>

<template>
    <header class="link-reminder">
        <div class="content">
            <p><Icon name="ph:newspaper-clipping-bold" />我会通过快捷方式进行写作</p>
            <p>
                我制作了本站的
                <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                <ProseA>Ispeak快捷发表</ProseA>，可通过快捷列表来进行使用
            </p>
        </div>
        <div class="operations">
            <ProseA href="https://kkadmin.myxz.top" icon="ph:rss-simple-bold">
                Ispeak后台管理
            </ProseA>
            <ProseA href="https://ispeak_biubiu.myxz.top" icon="ph:list-plus-bold">
                Ispeak网页版发表
            </ProseA>
        </div>
    </header>

    <div class="essay_content">
        <section class="essay_content_message">
            <ul class="essay_content_list">
                <li class="essay_content_item" v-for="(item, index) in itemData.essay_list" :key="item.essay_list" v-if="index < 30">
                    <div class="essay_items_content">
                        <p class = "essay_datacont">
                            {{ item.content }}
                            <div v-if="item.image" class="essay_container_img">
                                <div v-for="(iten, indey) in item.image" :key="iten.id || indey">
                                    <a class="bber-content-img" :href="item.image[indey]" target="_blank" data-fancybox="gallery" data-caption="">
                                        <img :src="item.image[indey]"></img>
                                    </a>
                                </div>
                                <div class="bber_content_noimg"></div>
                                <div class="bber_content_noimg"></div>
                                <div class="bber_content_noimg"></div>
                            </div>
                        </p>
                    </div>
                </li>
            </ul>
        </section>
    </div>
</template>

<style lang="scss" scoped>
.link-reminder {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.8rem 2rem;
    margin: 1rem;
    padding: 0.8rem 1rem;
    border-radius: 1rem;
    background: var(--c-primary-soft);

    .content {
        flex-basis: 20em;
        flex-grow: 3;

        p + p {
            margin-top: 0.2em;
        }
    }

    .operations {
        display: flex;
        flex-basis: 10em;
        flex-grow: 1;
        justify-content: end;
        gap: 0.2em 1rem;
        flex-wrap: wrap;
    }
}
</style>

<style>
body[data-type="essay"] #page {
  border: 0;
  box-shadow: none !important;
  padding: 0 !important;
  background: transparent !important;
}
body[data-type="essay"] #page .page-title {
  display: none;
}
body[data-type="essay"] #web_bg {
  background: var(--anzhiyu-background);
}
#bber .bber-container-img {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  flex-wrap: wrap;
  margin-bottom: 0.3rem;
}
#bber .bber-container-img .bber-content-noimg {
  width: calc(100% / 4 - 5px);
}

#bber .bber-content-img img {
  object-fit: cover;
  max-height: 100%;
}

#bber .bber-content-img,
#bber .bber-content-video {
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  position: relative;
  width: calc(100% / 4 - 5px);
  margin-bottom: 10px;
}

#bber .bber-content-video video {
  border-radius: 8px;
  object-fit: cover;
  max-height: 100%;
}
#bber .bber-content-video::after {
  content: "视频";
  display: inline-block;
  padding: 1px 6px;
  background: var(--anzhiyu-black-op);
  border-radius: 8px;
  margin-left: 4px;
  font-size: 12px;
  font-weight: 700;
  color: var(--anzhiyu-white);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: blur(20px);
  transform: translateZ(0);
  position: absolute;
  left: 0;
  top: 4px;
  z-index: 2;
}

#bber .bber-content .datacont {
  order: 0;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--anzhiyu-fontcolor);
  width: 100%;
  line-height: 1.38;
  border-radius: 12px;
  margin-bottom: 0.5rem;
  display: flex;
  flex-direction: column;
  text-align: justify;
}
#bber p {
  margin: 0px;
}
#bber div.bber-content {
  display: flex;
  flex-flow: wrap;
  border-radius: 12px;
  width: 100%;
  height: 100%;
}
#bber .timeline ul li.bber-item {
  position: relative;
  width: 32%;
  border: var(--style-border-always);
  border-radius: 12px;
  padding: 1rem 1rem 0.5rem;
  transition: all 0.3s ease 0s;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  align-items: flex-start;
  background: var(--anzhiyu-card-bg);
  box-shadow: var(--anzhiyu-shadow-border);
  margin-right: 2%;
}
#bber .timeline #waterfall.show {
  opacity: 1;
}
#bber .timeline #waterfall {
  opacity: 0;
  transition: all 0.3s ease 0s;
}
#bber ul.list {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
}
#bber {
  margin-top: 1rem;
  width: 100%;
}
#bber > section > ul > li.bber-item {
  margin-bottom: 1rem;
}

#bber-tips {
  font-size: 14px;
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

#bber .timeline ul li.bber-item hr {
  display: flex;
  position: relative;
  margin: 8px 0px;
  border: 1px dashed var(--anzhiyu-theme-op);
  width: 100%;
}

#bber .bber-info {
  display: flex;
  align-items: center;
}

#bber > section > ul > li > div .bber-info-time,
#bber > section > ul > li > div .bber-info-from {
  color: var(--anzhiyu-fontcolor);
  font-size: 0.7rem;
  background-color: var(--anzhiyu-gray-op);
  padding: 0px 8px;
  border-radius: 20px;
  cursor: default;
  display: flex;
  align-items: center;
}

#bber .bber-info .anzhiyufont.anzhiyu-icon-clock {
  margin-right: 4px;
  font-size: 0.7rem;
}
#bber > section > ul > li > div .bber-info-from span,
#bber > section > ul > li > div .bber-info-from {
  margin-left: 4px;
}
#bber > section > ul > li > div .bber-info-from i {
  font-size: 0.7rem;
}
#bber .bber-item hr::before {
  display: none;
}

#bber .bber-bottom {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 10px;
}

.bber-reply {
  cursor: pointer !important;
}

.bber-reply:hover {
  color: var(--anzhiyu-main);
  max-height: 35px;
}

#bber .timeline ul li.bber-item:hover {
  border: var(--style-border-hover);
}

#bber .bber-content-link {
  display: flex;
  margin-left: 0.5rem;
  font-size: 0.7rem;
  align-items: center;
  background-color: rgba(245, 108, 108, 0.13);
  color: rgb(245, 108, 108);
  padding: 0px 8px;
  border-radius: 20px;
}
#bber .bber-content-link i {
  margin-right: 3px;
  font-size: 0.7rem;
}
#bber .bber-content-link:hover {
  background-color: var(--anzhiyu-main);
  color: var(--anzhiyu-white);
}
#bber .bber-music {
  width: 100%;
  height: 90px;
  margin: 0.5rem 0;
  border-radius: 8px;
  overflow: hidden;
  border: var(--style-border-always);
  background: var(--anzhiyu-secondbg);
}
#bber .aplayer {
  margin: 0;
}

#bber .aplayer.aplayer-withlrc .aplayer-pic {
  height: 82px;
  width: 82px;
  margin: 4px;
  border-radius: 4px;
}
.bber-music .aplayer.aplayer-withlrc .aplayer-info {
  padding: 5px 7px 0;
}
#bber .aplayer .aplayer-info .aplayer-music {
  height: 23px;
}
#bber .aplayer .aplayer-info .aplayer-music .aplayer-title {
  font-size: 0.8rem;
  font-weight: 700;
  margin: 0;
  color: var(--anzhiyu-fontcolor);
}

#bber .aplayer .aplayer-info .aplayer-controller {
  align-items: center;
}
#bber .aplayer .aplayer-info .aplayer-controller .aplayer-bar-wrap {
  padding: 0;
}
#bber .aplayer .aplayer-info .aplayer-controller .aplayer-time {
  position: initial;
}
#bber .aplayer .aplayer-info .aplayer-controller .aplayer-bar-wrap .aplayer-bar {
  background: var(--anzhiyu-gray);
  height: 8px;
  border-radius: 12px;
  transition: 0.3s;
  overflow: hidden;
}
#bber .aplayer .aplayer-info .aplayer-controller .aplayer-bar-wrap .aplayer-bar .aplayer-loaded {
  height: 100%;
  border-radius: 12px;
}
#bber .aplayer .aplayer-info .aplayer-controller .aplayer-bar-wrap .aplayer-bar .aplayer-played {
  height: 100%;
  border-radius: 12px;
}
#bber .aplayer .aplayer-info .aplayer-controller .aplayer-bar-wrap .aplayer-bar .aplayer-played .aplayer-thumb {
  display: none;
}
#bber .aplayer .aplayer-info .aplayer-controller .aplayer-time {
  position: initial;
}

/* 顶部样式 */
.author-content.author-content-item.essayPage {
  height: 19rem;
  color: var(--anzhiyu-white);
  overflow: hidden;
  margin-top: 0px;
}
body[data-type="essay"] #page .author-content-item .card-content .banner-button-group .banner-button:hover {
  color: var(--anzhiyu-white);
  border-radius: 20px !important;
}

/* 响应式 */
@media screen and (max-width: 1200px) {
  #bber .timeline ul li.bber-item {
    width: 49%;
    margin-right: 1%;
  }
}
@media screen and (max-width: 768px) {
  #bber .timeline ul li.bber-item {
    width: 100%;
    margin-right: 0px;
  }
}
[data-theme="dark"] #bber .bber-music .aplayer,
[data-theme="dark"] #bber .aplayer .aplayer-lrc:before,
[data-theme="dark"] #bber .aplayer .aplayer-lrc:after {
  background: var(--anzhiyu-card-bg);
  color: var(--anzhiyu-fontcolor);
}
#bber .aplayer .aplayer-lrc p {
  color: var(--anzhiyu-fontcolor);
  min-height: 40px;
  line-height: 30px !important;
  height: 40px !important;
  margin: 0 !important;
}
</style>