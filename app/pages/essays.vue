<script setup lang="ts">
import { ref, onMounted } from 'vue'

const appConfig = useAppConfig()
const layoutStore = useLayoutStore()

layoutStore.setAside(['blog-stats', 'contentivity', 'blog-log'])

useSeoMeta({
    title: '说说',
    ogType: 'profile',
    description: `${appConfig.title}的说说页面。`,
})

const { data: postLink } = await useAsyncData('/essays', () => queryContent('/essays').findOne())

// 定义数据结构
interface EssayItem {
  content: string
  date: string
  image?: string
  video?: string[]
  link?: string
  from?: string
  address?: string
}

// 提供的数据
const customEssays = ref<EssayItem[]>([
  {
    content: '买到 myxz.top 域名，而且还是个白金域名，太棒了。',
    date: '2025/3/20',
    image: 'https://bcjyn0fc8o7wifyp.public.blob.vercel-storage.com/img/b486dd9b02c8081a42f7161aa135da0-lUIahC6nFeKNkSKlHnHa38kuYGMlnU.png',
  },
  {
    content: '最近长牙包了，没办法完善一些东西',
    date: '2025/03/03',
    image: '',
  },
  {
    content: '目前基本上已经完成了仿照轻笑的博客样式',
    date: '2025/02/07',
    image: 'https://blog.myxz.top/img/screen.avif',
  },
  {
    content: '有新电脑，基本上已经不太想用动态博客，所以最近准备从动态博客迁移到静态博客',
    date: '2025/02/03',
    image: '',
  },
])

// 顶部横幅数据
const bannerData = ref({
  title: "我的说说",
  subTitle: "分享生活中的点滴",
  tips: "发布于2023年至今",
  top_background: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  buttonText: "查看更多",
  buttonLink: "/essays",
  limit: 30
})

// 加载外部脚本
onMounted(() => {
  const loadScript = (src: string) => {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve(null)
      
      const script = document.createElement('script')
      script.src = src
      script.async = true
      script.onload = resolve
      script.onerror = reject
      document.head.appendChild(script)
    })
  }

  loadScript('/assets/js/waterfall.js')
    .then(() => loadScript('/assets/js/essay.js'))
    .catch(err => console.error('脚本加载失败:', err))
})

</script>

<template>
  <div id="essay_page">
    <!-- 全局样式 -->
    <style>
      #web_bg~.page:has(#essay_page) {
        background: none!important;
      }
    </style>

    <template v-for="essay in essayData.essay" :key="essay.title">
      <!-- 顶部横幅区域 -->
      <div 
        class="author-content author-content-item essayPage single"
        :style="essay.top_background ? `background: url(${essay.top_background}) left 28% / cover no-repeat;` : ''"
      >
        <div class="card-content">
          <div class="author-content-item-tips">{{ essay.title }}</div>
          <span class="author-content-item-title">{{ essay.subTitle }}</span>
          
          <div class="content-bottom">
            <div class="tips">{{ essay.tips }}</div>
          </div>
          
          <div class="banner-button-group">
            <a :href="essay.buttonLink" class="banner-button">
              <i class="anzhiyufont anzhiyu-icon-arrow-circle-right"></i>
              <span class="banner-button-text">{{ essay.buttonText }}</span>
            </a>
          </div>
        </div>
      </div>

      <!-- 说说内容区域 -->
      <div id="bber">
        <section class="timeline page-1">
          <ul id="waterfall" class="list">
            <li 
              v-for="(item, index) in essay.essay_list" 
              :key="item.date || index"
              class="bber-item"
              v-if="index < essay.limit"
            >
              <div class="bber-content">
                <!-- 内容 -->
                <p class="datacont">{{ item.content }}</p>
                
                <!-- 图片展示 -->
                <div v-if="item.image && item.image.length" class="bber-container-img">
                  <template v-for="(imgUrl, imgIndex) in item.image" :key="imgIndex">
                    <a 
                      class="bber-content-img" 
                      :href="imgUrl" 
                      target="_blank" 
                      data-fancybox="gallery" 
                      data-caption=""
                    >
                      <img :src="imgUrl">
                    </a>
                  </template>
                  
                  <!-- 占位格 -->
                  <div v-for="i in 3 - Math.min(item.image.length, 3)" :key="`empty-${i}`" class="bber-content-noimg"></div>
                </div>
                
                <!-- 视频展示 -->
                <div v-if="item.video && item.video.length" class="bber-container-img">
                  <template v-for="(videoUrl, videoIndex) in item.video" :key="videoIndex">
                    <div 
                      v-if="videoUrl.includes('player.bilibili.com')"
                      style="position: relative; padding: 30% 45%;margin-top: 10px;margin-bottom: 10px;"
                    >
                      <iframe 
                        style="position: absolute; width: 100%; height: 100%; left: 0; top: 0;margin: 0;border-radius: 12px;border: var(--style-border);" 
                        :src="videoUrl" 
                        scrolling="no" 
                        border="0" 
                        frameborder="no" 
                        framespacing="0" 
                        allowfullscreen="true"
                      ></iframe>
                    </div>
                    <a 
                      v-else 
                      class="bber-content-video"
                      :href="videoUrl"
                      data-fancybox="gallery"
                      data-caption=""
                    >
                      <video :src="videoUrl"></video>
                    </a>
                  </template>
                  
                  <!-- 占位格 -->
                  <div v-for="i in 3 - Math.min(item.video.length, 3)" :key="`empty-video-${i}`" class="bber-content-noimg"></div>
                </div>
                
                <!-- 音乐播放器 -->
                <div v-if="item.aplayer" class="bber-music">
                  <meting-js 
                    :id="item.aplayer.id" 
                    :server="item.aplayer.server" 
                    type="song" 
                    mutex="true"
                    preload="none" 
                    theme="var(--anzhiyu-main)" 
                    data-lrctype="0" 
                    order="list"
                  ></meting-js>
                </div>
              </div>
              
              <!-- 分隔线 -->
              <hr>
              
              <!-- 底部信息 -->
              <div class="bber-bottom">
                <div class="bber-info">
                  <!-- 发布时间 -->
                  <div class="bber-info-time">
                    <i class="anzhiyufont anzhiyu-icon-clock"></i>
                    <time class="datatime" :datetime="item.date">{{ new Date(item.date).toISOString() }}</time>
                  </div>
                  
                  <!-- 相关链接 -->
                  <a 
                    v-if="item.link" 
                    class="bber-content-link" 
                    :href="item.link" 
                    title="跳转到短文指引的链接" 
                    rel="external nofollow"
                  >
                    <i class="anzhiyufont anzhiyu-icon-link"></i>
                    <span>链接</span>
                  </a>
                  
                  <!-- 来源信息 -->
                  <div v-if="item.from" class="bber-info-from">
                    <i class="anzhiyufont anzhiyu-icon-fw-fire"></i>
                    <span>{{ item.from }}</span>
                  </div>
                  
                  <!-- 地理位置 -->
                  <div v-if="item.address" class="bber-info-from">
                    <i class="anzhiyufont anzhiyu-icon-location-dot"></i>
                    <span>{{ item.address }}</span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </section>
        
        <!-- 底部提示 -->
        <div id="bber-tips" style="color: var(--anzhiyu-secondtext);">
          只展示最近{{ currentEssay.limit }}条短文
        </div>
      </div>
    </template>
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