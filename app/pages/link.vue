<script setup lang="ts">
import { myFeed } from '~~/blog.config'
import friends from '~/friends'
import subscriptions from '~/subscriptions'

const appConfig = useAppConfig()
const layoutStore = useLayoutStore()
layoutStore.setAside([])

useSeoMeta({
    title: '友链',
    ogType: 'profile',
    description: `${appConfig.title}的友链页面，收集了添加他为友链的网站和他订阅的网站列表。`,
})

const copyFields = {
    博主: myFeed.author,
    标题: myFeed.title,
    介绍: myFeed.desc,
    网址: myFeed.link,
    头像: myFeed.avatar,
}

const { data: postLink } = await useAsyncData('/link', () => queryContent('/link').findOne())
</script>

<template>
    <header class="link-reminder">
        <div class="content">
            <p><Icon name="ph:newspaper-clipping-bold" /> 我会通过订阅源阅读友链文章。</p>
            <p>
                欢迎加入 QQ 群 <Tip copy>
                    {{ appConfig.qqGroup }}
                </Tip> 闲聊或技术交流。
            </p>
            <p>
                我制作了本站的
                <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                <ProseA href="/zhilu.opml">友链源 OPML 聚合</ProseA>，可导入阅读器或
                <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                <ProseA href="https://app.follow.is/share/lists/72840182614552576">订阅 Folo List</ProseA>。
            </p>
        </div>
        <div class="operations">
            <ProseA href="/atom.xml" icon="ph:rss-simple-bold">
                订阅源
            </ProseA>
            <ProseA href="https://app.follow.is/share/feeds/62533754566736896" icon="ph:list-plus-bold">
                在 Folo 上订阅
            </ProseA>
        </div>
    </header>
    <div class="flink-banners">
        <div class="banner-top-box">
            <div class="flink-banners-title">
                <div class="banners-title-small">
                    友情链接
                </div>
                <div class="banners-title-big">
                    与数百名博主无限进步
                </div>
            <div>
            <div class="banner-button-group">
                <a class="banner-button secondary no-text-decoration" onclick="travelling()">
                    <i class="anzhiyufont anzhiyu-icon-paper-plane1" style="margin-right:8px">
                    </i>
                    <span class="banner-button-text">
                        随机访问
                    </span>
                </a>
                <a class="banner-button no-text-decoration" onclick="addFriendLinksInFooter()">
                    <i class="anzhiyufont anzhiyu-icon-arrow-circle-right">
                    </i>
                    <span class="banner-button-text">
                        申请友链
                    </span>
                </a>
            </div>
            <div id="skills-tags-group-all">
                <div class="tags-group-wrapper">
                    <template v-for="(_, y) in 2" :key="y">
                        <template v-for="(i, index) in links" :key="`${y}-${index}`">
                            <template v-for="(pair, pairIndex) in getPairs(i)" :key="pairIndex">
                                <div class="tags-group-icon-pair" style="margin-left: 1rem;">
                                <a 
                                    :href="url_for(pair.even.link)"
                                    :title="pair.even.name"
                                    class="tags-group-icon no-text-decoration"
                                >
                                    <img
                                    :title="pair.even.name"
                                    :src="url_for(getProcessedAvatar(pair.even.avatar, i.hundredSuffix))"
                                    @error="handleImgError"
                                    :alt="pair.even.name"
                                    class="no-lightbox"
                                    />
                                </a>
                                <a 
                                    :href="url_for(pair.odd.link)"
                                    :title="pair.odd.name"
                                    class="tags-group-icon no-text-decoration"
                                >
                                    <img
                                    :title="pair.odd.name"
                                    :src="url_for(getProcessedAvatar(pair.odd.avatar, i.hundredSuffix))"
                                    @error="handleImgError"
                                    :alt="pair.odd.name"
                                    class="no-lightbox"
                                    />
                                </a>
                                </div>
                            </template>
                        </template>
                    </template>
                <div>
            <div>
        </div>
    <div>
    <FeedGroup label="友链" :feeds="friends" />
    <FeedGroup label="订阅" :feeds="subscriptions" />

    <Tab :tabs="['我的博客信息', '申请友链']" center>
        <template #tab1>
            <div class="link-tab">
                <FeedCard v-bind="myFeed" />
                <Copy v-for="(code, prompt) in copyFields" :key="prompt" :prompt :code />
            </div>
        </template>
        <template #tab2>
            <ContentRendererMarkdown
                v-if="postLink"
                :value="postLink"
                class="article"
                tag="article"
            />
            <p v-else class="text-center">
                可于 link.md 配置友链补充说明。
            </p>
        </template>
    </Tab>

    <PostComment key="/link" />
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

.link-tab {
    margin: 1rem;
}
</style>
<script>
export default {
  props: {
    site: {
      type: Object,
      required: true
    },
    theme: {
      type: Object,
      required: true
    },
    url_for: {
      type: Function,
      required: true
    }
  },

  computed: {
    links() {
      return this.site.data.link.slice(0, 15);
    }
  },

  methods: {
    getProcessedAvatar(url, suffix = '') {
      const index = url.indexOf('!');
      return (index !== -1 ? url.substring(0, index) : url) + suffix;
    },

    getPairs(item) {
      const pairs = [];
      const linkList = [...item.link_list];
      const evenNum = linkList.filter((_, idx) => idx % 2 === 0);
      const oddNum = linkList.filter((_, idx) => idx % 2 === 1);
      const pairCount = Math.min(evenNum.length, oddNum.length);

      for (let i = 0; i < pairCount; i++) {
        if (i <= 15 && evenNum[i] && oddNum[i]) {
          pairs.push({ even: evenNum[i], odd: oddNum[i] });
        }
      }

      return pairs;
    },

    handleImgError(e) {
      if (e.target.src !== errorImg) {
        e.target.src = this.url_for(this.theme.error_img.flink);
        e.target.onerror = null;
      }
    }
  }
};
</script>
<style>
  /* 友链顶部轮播美化 */
  .banners-title-small {
    font-size: 12px;
    line-height: 1;
    color: var(--anzhiyu-secondtext);
    margin-top: 8px;
    margin-bottom: .5rem;
  }
  .banners-title-big {
    font-size: 36px;
    line-height: 1;
    font-weight: 700;
    margin-bottom: 8px;
  }
  #flink-banners .banner-button-group .banner-button i {
    margin-right: 8px!important;
    font-size: 1rem;
  }
  #flink-banners {
    display: -webkit-box;
    display: -moz-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: box;
    display: flex;
    width: 100%;
    height: 76%;
    background: var(--anzhiyu-card-bg);
    padding: 1.5rem;
    border: var(--style-border);
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    -webkit-box-shadow: var(--anzhiyu-shadow-border);
    box-shadow: var(--anzhiyu-shadow-border);
    -webkit-box-orient: vertical;
    -moz-box-orient: vertical;
    -o-box-orient: vertical;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
    overflow: hidden;
    -webkit-transition: .3s;
    -moz-transition: .3s;
    -o-transition: .3s;
    -ms-transition: .3s;
    transition: .3s;
    will-change: transform;
    -webkit-animation: slide-in .6s .2s backwards;
    -moz-animation: slide-in .6s .2s backwards;
    -o-animation: slide-in .6s .2s backwards;
    -ms-animation: slide-in .6s .2s backwards;
    animation: slide-in .6s .2s backwards;
  }
  #flink-banners .banner-top-box {
      display: -webkit-box;
      display: -moz-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: box;
      display: flex;
      -webkit-box-align: center;
      -moz-box-align: center;
      -o-box-align: center;
      -ms-flex-align: center;
      -webkit-align-items: center;
      align-items: center;
      -webkit-box-pack: justify;
      -moz-box-pack: justify;
      -o-box-pack: justify;
      -ms-flex-pack: justify;
      -webkit-justify-content: space-between;
      justify-content: space-between;
  }
  #flink-banners .banner-button-group {
      position: absolute;
      right: 2rem;
      top: 2.5rem;
      display: -webkit-box;
      display: -moz-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: box;
      display: flex;
  }
  #flink-banners .banner-button-group .banner-button.secondary {
      color: var(--anzhiyu-fontcolor);
  }

  #flink-banners .banner-button-group .banner-button {
      color: var(--anzhiyu-card-bg);
  }
  #article-container a {
      color: var(--anzhiyu-fontcolor);
  }
  .banner-button.secondary {
      background: var(--anzhiyu-secondbg);
      border: var(--style-border-always);
      color: var(--anzhiyu-lighttext);
      margin-right: 1rem;
      -webkit-box-shadow: var(--anzhiyu-shadow-border);
      box-shadow: var(--anzhiyu-shadow-border);
  }
  .banner-button {
      padding: 8px 12px;
      background: var(--anzhiyu-fontcolor);
      border-radius: 12px;
      color: var(--anzhiyu-card-bg);
      display: -webkit-box;
      display: -moz-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: box;
      display: flex;
      -webkit-box-align: center;
      -moz-box-align: center;
      -o-box-align: center;
      -ms-flex-align: center;
      -webkit-align-items: center;
      align-items: center;
      z-index: 1;
      -webkit-transition: .3s;
      -moz-transition: .3s;
      -o-transition: .3s;
      -ms-transition: .3s;
      transition: .3s;
      cursor: pointer;
      -webkit-box-shadow: var(--anzhiyu-shadow-black);
      box-shadow: var(--anzhiyu-shadow-black);
  }
  #flink-banners .banner-button-group .banner-button i {
      margin-right: 8px;
      font-size: 1rem;
  }
  #skills-tags-group-all {
      display: flex;
      transform: rotate(0);
      transition: .3s;
  }
  #flink-banners #skills-tags-group-all .tags-group-wrapper {
      -webkit-animation: rowup 120s linear infinite;
      -moz-animation: rowup 120s linear infinite;
      -o-animation: rowup 120s linear infinite;
      -ms-animation: rowup 120s linear infinite;
      animation: rowup 120s linear infinite;
  }
  #skills-tags-group-all .tags-group-wrapper {
      margin-top: 40px;
      display: flex;
      flex-wrap: nowrap;
      animation: rowup 60s linear infinite;
  }
  #flink-banners #skills-tags-group-all .tags-group-wrapper {
      -webkit-animation: rowup 120s linear infinite;
      -moz-animation: rowup 120s linear infinite;
      -o-animation: rowup 120s linear infinite;
      -ms-animation: rowup 120s linear infinite;
      animation: rowup 120s linear infinite;
  }
  #skills-tags-group-all .tags-group-wrapper {
      margin-top: 40px;
      display: flex;
      flex-wrap: nowrap;
      animation: rowup 60s linear infinite;
  }
  #flink-banners #skills-tags-group-all .tags-group-icon {
      border-radius: 50%;
  }
  #skills-tags-group-all .tags-group-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 66px;
      font-weight: 700;
      box-shadow: var(--anzhiyu-shadow-blackdeep);
      width: 120px;
      height: 120px;
      border-radius: 30px;
  }
  #flink-banners #skills-tags-group-all .tags-group-icon img {
      min-width: 100%;
      min-height: 100%;
      border-radius: 50%;
      object-fit: cover;
  }

  [data-theme=dark] #skills-tags-group-all .tags-group-icon img {
      filter: none;
  }
  #skills-tags-group-all .tags-group-icon img {
      width: 60px;
      margin: 0 auto !important;
  }
  #article-container img {
      display: block;
      margin: 0 auto 20px;
      max-width: 100%;
      -webkit-transition: .3s;
      -moz-transition: .3s;
      -o-transition: .3s;
      -ms-transition: .3s;
      transition: .3s;
      border-radius: 8px;
  }
  #flink-banners #skills-tags-group-all .img-alt {
      display: none;
  }
  .img-alt {
      font-size: 12px;
      margin: 0;
      margin-top: 8px;
      color: var(--anzhiyu-secondtext);
  }
  .is-center {
      text-align: center;
  }
  #flink-banners #skills-tags-group-all .tags-group-icon {
      border-radius: 50%;
  }
  #skills-tags-group-all .tags-group-icon-pair .tags-group-icon:nth-child(even) {
      margin-top: 1rem;
      transform: translate(-60px);
  }
  #skills-tags-group-all .tags-group-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 66px;
      font-weight: 700;
      box-shadow: var(--anzhiyu-shadow-blackdeep);
      width: 120px;
      height: 120px;
      border-radius: 30px;
  }
  /* 动画效果 */
  @keyframes rowup {
    0% {
        transform: translateX(0)
    }

    100% {
        transform: translateX(-50%)
    }
  }
</style>