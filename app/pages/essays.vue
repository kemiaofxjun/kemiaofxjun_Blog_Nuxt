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

  loadScript('/assets/js/essay.js')
    .catch(err => console.error('脚本加载失败:', err))
})

</script>

<template>
  <link rel="stylesheet" href="/assets/css/essay.css">
  <link rel="stylesheet" href="https://static.vercel.sxiaohe.top/fonts/anzhiyu/anzhiyufonts.css">
  <div id="#essay_page">

    <!-- 顶部横幅区域 -->
    <div class="essay_page_banner" style="background-image:url(/assets/img/page_backgroud/moment.webp);">
      <div class="essay_banner_content">
        <h1>
          即刻短文
        </h1>
        <p>
          记录生活点滴，一些想法
        </p>
      </div>
      <div class="essay_banner_extra">
        <div class="essay_friend_stats">
          <div class="essay_update_time">
            Updated at 2025-07-06
          </div>
          <div class="essay_powered_by">
            Powered by AnHeYuEssays
          </div>
        </div>
      </div>
    </div>

    <!-- 说说内容区域 -->
    <div id="bber">
      <section class="timeline page-1">
        <ul id="waterfall" class="list">
          <li 
            v-for="(item, index) in customEssays" 
            :key="index"
            class="bber-item"
          >
            <div class="bber-content">
              <!-- 内容 -->
              <p class="datacont">{{ item.content }}</p>
              
              <!-- 图片展示 -->
              <div v-if="item.image" class="bber-container-img" style="width: auto!important">
                <div v-if="item.image && item.image.length > 0">
                  <a 
                    class="bber-content-img" 
                    :href="item.image" 
                    target="_blank" 
                    data-fancybox="gallery" 
                    data-caption=""
                    style="width: 100%!important"
                  >
                    <img :src="item.image">
                  </a>
                </div>
                
                <!-- 占位格 -->
                <div v-if="!item.image || item.image === ''" class="bber-content-noimg"></div>
                <div class="bber-content-noimg"></div>
                <div class="bber-content-noimg"></div>
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
                  <time class="datatime" :datetime="item.date">{{ item.date }}</time>
                </div>
                
                <!-- 来源信息 -->
                <div class="bber-info-from">
                  <i class="anzhiyufont anzhiyu-icon-fw-fire"></i>
                  <span>莫言小栈</span>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </section>
      
      <!-- 底部提示 -->
      <div id="bber-tips" style="color: var(--anzhiyu-secondtext);">
        只展示最近{{ bannerData.limit }}条短文
      </div>
    </div>
  </div>
</template>

<style>
.essay_page_banner {
    background-position: 50%;
    background-size: cover;
    border-radius: 8px;
    margin: 1rem;
    max-height: 320px;
    min-height: 256px;
    overflow: hidden;
    position: relative
}

.essay_page_banner .essay_banner_content {
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

.essay_page_banner .essay_banner_content h1 {
    font-size: 2rem
}

.essay_page_banner .essay_banner_content p {
    font-size: 1rem;
    opacity: .9
}

.essay_page_banner .essay_banner_extra {
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

.essay_page_banner .banner-btn {
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

.essay_page_banner .banner-btn:hover {
    background: #0003
}

.essay_page_banner .banner-btn .icon {
    font-size: 1.2rem
}

.essay_friend_stats {
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

.essay_friend_stats .essay_update_time {
    opacity: 1
}

.essay_friend_stats .essay_powered_by {
    opacity: .8
}
</style>