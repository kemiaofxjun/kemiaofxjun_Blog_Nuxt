<script setup lang="ts">
import essay from '~/essay'
const appConfig = useAppConfig()
const layoutStore = useLayoutStore()
layoutStore.setAside(['blog-stats', 'connectivity', 'blog-log'])

useSeoMeta({
    title: '',
    ogType: 'profile',
    description: `${appConfig.title}的友链页面，收集了添加他为友链的网站和他订阅的网站列表。`,
})
const { data: postLink } = await useAsyncData('/essay', () => queryContent('/essay').findOne())

export default {
  props: {
    site: {
      type: Object,
      required: true
    }
  },
  methods: {
    /​**​
     * 路径格式化方法（需根据项目实际实现）
     * @param {string} path - 原始路径
     * @returns {string} 完整URL
     */
    urlFor(path) {
      // 实际项目中需实现路径解析逻辑
      return path; 
    },
    
    /​**​
     * 日期格式化
     * @param {string} dateStr - ISO日期字符串
     * @returns {string} 格式化日期
     */
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    
    /​**​
     * 检测B站视频
     * @param {string} url - 视频URL
     * @returns {boolean}
     */
    isBilibili(url) {
      return url.includes('player.bilibili.com');
    }
  }
};

</script>
<template>
  <div id="essay_page">
    <template v-for="i in site.data.essay" :key="i">
      <main>
        <!-- 动态添加JS脚本 -->
        <script async src="/assets/js/waterfall.js"></script>
        <script async src="/assets/js/essay.js"></script>
        
        <!-- 瀑布流短文列表 -->
        <div id="bber">
          <section class="timeline page-1">
            <ul id="waterfall" class="list">
              <li 
                v-for="(item, index) in i.essay_list" 
                v-if="index < 30"
                :key="index"
                class="bber-item"
              >
                <div class="bber-content">
                  <p class="datacont">{{ item.content }}</p>
                  
                  <!-- 图片展示 -->
                  <div v-if="item.image" class="bber-container-img">
                    <a
                      v-for="(img, imgIndex) in item.image"
                      :key="imgIndex"
                      :href="urlFor(img)"
                      target="_blank"
                      data-fancybox="gallery"
                      class="bber-content-img"
                    >
                      <img :src="urlFor(img)" />
                    </a>
                    <!-- 占位元素 -->
                    <div class="bber-content-noimg"></div>
                    <div class="bber-content-noimg"></div>
                    <div class="bber-content-noimg"></div>
                  </div>
                  
                  <!-- 视频展示 -->
                  <div v-if="item.video" class="bber-container-img">
                    <template v-for="(video, videoIndex) in item.video">
                      <div 
                        v-if="isBilibili(video)" 
                        :key="videoIndex"
                        :style="{ 
                          position: 'relative', 
                          padding: '30% 45%', 
                          marginTop: '10px', 
                          marginBottom: '10px'
                        }"
                      >
                        <iframe
                          :src="urlFor(video)"
                          :style="{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            left: 0,
                            top: 0,
                            margin: 0,
                            borderRadius: '12px',
                            border: 'var(--style-border)'
                          }"
                          scrolling="no"
                          frameborder="no"
                          allowfullscreen
                        ></iframe>
                      </div>
                      <a
                        v-else
                        :key="videoIndex"
                        :href="urlFor(video)"
                        data-fancybox="gallery"
                        class="bber-content-video"
                      >
                        <video :src="urlFor(video)"></video>
                      </a>
                    </template>
                    <!-- 占位元素 -->
                    <div class="bber-content-noimg"></div>
                    <div class="bber-content-noimg"></div>
                    <div class="bber-content-noimg"></div>
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
                
                <hr />
                
                <div class="bber-bottom">
                  <div class="bber-info">
                    <!-- 时间信息 -->
                    <div class="bber-info-time">
                      <i class="anzhiyufont anzhiyu-icon-clock"></i>
                      <time class="datatime" :datetime="item.date">
                        {{ formatDate(item.date) }}
                      </time>
                    </div>
                    
                    <!-- 链接 -->
                    <a 
                      v-if="item.link"
                      :href="urlFor(item.link)"
                      title="跳转到短文指引的链接"
                      class="bber-content-link"
                      rel="external nofollow"
                    >
                      <i class="anzhiyufont anzhiyu-icon-link"></i>
                      链接
                    </a>
                    
                    <!-- 来源 -->
                    <div v-if="item.from" class="bber-info-from">
                      <i class="anzhiyufont anzhiyu-icon-fw-fire"></i>
                      <span>{{ item.from }}</span>
                    </div>
                    
                    <!-- 地址 -->
                    <div v-if="item.address" class="bber-info-from">
                      <i class="anzhiyufont anzhiyu-icon-location-dot"></i>
                      <span>{{ item.address }}</span>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </section>
        </div>
        
        <!-- 提示信息 -->
        <div id="bber-tips" style="color: var(--anzhiyu-secondtext);">
          - 只展示最近{{ i.limit }}条短文 -
        </div>
      </main>
    </template>
  </div>
</template>
<style>
#bber .bber-container-img {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    flex-wrap: wrap;
    margin-bottom: .3rem
}

#bber .bber-container-img .bber-content-noimg {
    width: calc(100% / 4 - 5px)
}

#bber .bber-content-img img {
    object-fit: cover;
    max-height: 100%
}

#bber .bber-content-img,#bber .bber-content-video {
    height: 100px;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    position: relative;
    width: calc(100% / 4 - 5px);
    margin-bottom: 10px
}

#bber .bber-content-video video {
    border-radius: 8px;
    object-fit: cover;
    max-height: 100%
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
    z-index: 2
}

#bber .bber-content .datacont {
    order: 0;
    font-size: .8rem;
    font-weight: 700;
    color: var(--anzhiyu-fontcolor);
    width: 100%;
    line-height: 1.38;
    border-radius: 12px;
    margin-bottom: .5rem;
    display: flex;
    flex-direction: column;
    text-align: justify
}

#bber p {
    margin: 0
}

#bber div.bber-content {
    display: flex;
    flex-flow: wrap;
    border-radius: 12px;
    width: 100%;
    height: 100%
}

#bber .timeline ul li.bber-item {
    position: relative;
    width: 32%;
    border: var(--style-border-always);
    border-radius: 12px;
    padding: 1rem 1rem .5rem;
    transition: .3s;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    align-items: flex-start;
    background: var(--anzhiyu-card-bg);
    box-shadow: var(--anzhiyu-shadow-border);
    margin-right: 2%
}

#bber .timeline #waterfall.show {
    opacity: 1
}

#bber .timeline #waterfall {
    opacity: 0;
    transition: .3s
}

#bber ul.list {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between
}

#bber {
    margin-top: 1rem;
    width: 100%
}

#bber>section>ul>li.bber-item {
    margin-bottom: 1rem
}

#bber-tips {
    font-size: 14px;
    display: flex;
    justify-content: center;
    margin-top: 1rem
}

#bber .timeline ul li.bber-item hr {
    display: flex;
    position: relative;
    margin: 8px 0;
    border: 1px dashed var(--anzhiyu-theme-op);
    width: 100%
}

#bber .bber-info {
    display: flex;
    align-items: center
}

#bber>section>ul>li>div .bber-info-from,#bber>section>ul>li>div .bber-info-time {
    color: var(--anzhiyu-fontcolor);
    font-size: .7rem;
    background-color: var(--anzhiyu-gray-op);
    padding: 0 8px;
    border-radius: 20px;
    cursor: default;
    display: flex;
    align-items: center
}

#bber .bber-info .anzhiyufont.anzhiyu-icon-clock {
    margin-right: 4px;
    font-size: .7rem
}

#bber>section>ul>li>div .bber-info-from,#bber>section>ul>li>div .bber-info-from span {
    margin-left: 4px
}

#bber>section>ul>li>div .bber-info-from i {
    font-size: .7rem
}

#bber .bber-item hr::before {
    display: none
}

#bber .bber-bottom {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 10px
}

.bber-reply {
    cursor: pointer!important
}

.bber-reply:hover {
    color: var(--anzhiyu-main);
    max-height: 35px
}

#bber .timeline ul li.bber-item:hover {
    border: var(--style-border-hover)
}

#bber .bber-content-link {
    display: flex;
    margin-left: .5rem;
    font-size: .7rem;
    align-items: center;
    background-color: rgba(245,108,108,.13);
    color: #f56c6c;
    padding: 0 8px;
    border-radius: 20px
}

#bber .bber-content-link i {
    margin-right: 3px;
    font-size: .7rem
}

#bber .bber-content-link:hover {
    background-color: var(--anzhiyu-main);
    color: var(--anzhiyu-white)
}

#bber .bber-music {
    width: 100%;
    height: 90px;
    margin: .5rem 0;
    border-radius: 8px;
    overflow: hidden;
    border: var(--style-border-always);
    background: var(--anzhiyu-secondbg)
}

#bber .aplayer {
    margin: 0
}

#bber .aplayer.aplayer-withlrc .aplayer-pic {
    height: 82px;
    width: 82px;
    margin: 4px;
    border-radius: 4px
}

.bber-music .aplayer.aplayer-withlrc .aplayer-info {
    padding: 5px 7px 0
}

#bber .aplayer .aplayer-info .aplayer-music {
    height: 23px
}

#bber .aplayer .aplayer-info .aplayer-music .aplayer-title {
    font-size: .8rem;
    font-weight: 700;
    margin: 0;
    color: var(--anzhiyu-fontcolor)
}

#bber .aplayer .aplayer-info .aplayer-controller {
    align-items: center
}

#bber .aplayer .aplayer-info .aplayer-controller .aplayer-bar-wrap {
    padding: 0
}

#bber .aplayer .aplayer-info .aplayer-controller .aplayer-bar-wrap .aplayer-bar {
    background: var(--anzhiyu-gray);
    height: 8px;
    border-radius: 12px;
    transition: .3s;
    overflow: hidden
}

#bber .aplayer .aplayer-info .aplayer-controller .aplayer-bar-wrap .aplayer-bar .aplayer-loaded,#bber .aplayer .aplayer-info .aplayer-controller .aplayer-bar-wrap .aplayer-bar .aplayer-played {
    height: 100%;
    border-radius: 12px
}

#bber .aplayer .aplayer-info .aplayer-controller .aplayer-bar-wrap .aplayer-bar .aplayer-played .aplayer-thumb {
    display: none
}

#bber .aplayer .aplayer-info .aplayer-controller .aplayer-time {
    position: initial
}

.author-content.author-content-item.essayPage {
    height: 19rem;
    color: var(--anzhiyu-white);
    overflow: hidden;
    margin-top: 0
}

body[data-type=essay] #page .author-content-item .card-content .banner-button-group .banner-button:hover {
    color: var(--anzhiyu-white);
    border-radius: 20px!important
}

@media screen and (max-width: 1200px) {
    #bber .timeline ul li.bber-item {
        width:49%;
        margin-right: 1%
    }
}

[data-theme=dark] #bber .aplayer .aplayer-lrc:after,[data-theme=dark] #bber .aplayer .aplayer-lrc:before,[data-theme=dark] #bber .bber-music .aplayer {
    background: var(--anzhiyu-card-bg);
    color: var(--anzhiyu-fontcolor)
}

#bber .aplayer .aplayer-lrc p {
    color: var(--anzhiyu-fontcolor);
    min-height: 40px;
    line-height: 30px!important;
    height: 40px!important;
    margin: 0!important
}

.essay-mini {
    background: var(--card-bg);
    color: var(--font-color);
    padding: .5rem 1rem;
    border-radius: 8px;
    -webkit-box-shadow: var(--icat-shadow-border);
    box-shadow: var(--icat-shadow-border);
    display: -webkit-box;
    display: -moz-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: box;
    display: flex;
    border: var(--style-border);
    -webkit-box-align: center;
    -moz-box-align: center;
    -o-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
    height: 50px;
    -webkit-animation: .6s .4s backwards slide-in;
    -moz-animation: .6s .4s backwards slide-in;
    -o-animation: .6s .4s backwards slide-in;
    -ms-animation: slide-in .6s .4s backwards;
    animation: .6s .4s backwards slide-in;
    will-change: transform;
    -webkit-transition: .6s;
    -moz-transition: .6s;
    -o-transition: .6s;
    -ms-transition: .6s;
    transition: .6s
}

.essay-mini:hover {
    border: var(--style-border-hover-always)
}

.essay-mini #Essay {
    width: 100%;
    overflow: hidden;
    -o-text-overflow: ellipsis;
    text-overflow: ellipsis;
    white-space: nowrap
}

.essay-mini #Essay #essay-mini {
    width: 100%;
    height: 25px;
    line-height: 25px;
    display: -webkit-box;
    display: -moz-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: box;
    display: flex;
    -webkit-box-orient: vertical;
    -moz-box-orient: vertical;
    -o-box-orient: vertical;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column
}

.essay-mini #Essay .li-style {
    width: auto;
    max-width: 100%;
    height: 25px;
    text-align: center;
    overflow: hidden;
    -o-text-overflow: ellipsis;
    text-overflow: ellipsis;
    font-weight: 700;
    margin: auto;
    cursor: pointer;
    white-space: nowrap;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none
}

.essay-mini .li-style,.essay-mini i {
    -webkit-transition: .6s;
    -moz-transition: .6s;
    -o-transition: .6s;
    -ms-transition: .6s;
    transition: .6s;
    cursor: pointer
}

.essay-mini .li-style:hover,.essay-mini i:hover {
    color: var(--icat-blue)
}
</style>