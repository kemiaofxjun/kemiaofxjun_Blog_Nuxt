<!-- components/FlinkTop.vue -->
<script>
export default {
  name: 'FlinkTop',
  props: {
    friends: {
      type: Array,
      required: true
    }
  },
  computed: {
    titleText() {
      return this.theme?.linkPageTop?.title || "与数百名博主无限进步"
    },
    paginatedLinks() {
      if (!this.friends || this.friends.length === 0) return [];
      
      // 转换为与原始Pug结构兼容的数据格式
      return [{
        link_list: this.friends,
        hundredSuffix: this.theme?.imageSuffix || ""
      }]
    }
  },
  methods: {
    urlFor(path) {
      // 在实际应用中，这里可能有更复杂的路径处理逻辑
      return path;
    },
    getAvatarWithoutExclamationMark(url) {
      if (!url) return '';
      const index = url.indexOf('!');
      return index !== -1 ? url.substring(0, index) : url;
    },
    avatarUrl(avatar, suffix) {
      if (!avatar) return '';
      let cleanedAvatar = this.getAvatarWithoutExclamationMark(avatar);
      
      // 处理不同格式的头像URL
      if (cleanedAvatar.startsWith('http')) {
        return cleanedAvatar + suffix;
      }
      
      return this.urlFor(cleanedAvatar + suffix);
    },
    handleImgError(e, fallbackImg) {
      if (fallbackImg) {
        e.target.src = this.urlFor(fallbackImg);
      } else {
        // 默认备用图片
        e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23eeeeee"/><text x="50" y="50" text-anchor="middle" fill="%23999999" font-family="sans-serif" font-size="14">Avatar</text></svg>';
      }
    }
  }
}
</script>

<template>
  <div id="flink_top">
    <div id="flink-banners">
      <div class="banner-top-box">
        <div class="flink-banners-title">
          <div class="banners-title-small">友情链接</div>
          <div class="banners-title-big">{{ titleText }}</div>
        </div>
        <div class="banner-button-group">
          <a 
            class="banner-button secondary no-text-decoration" 
            @click.prevent="$emit('random-visit')"
          >
            <i class="anzhiyufont anzhiyu-icon-paper-plane1" style="margin-right: 8px;"></i>
            <span class="banner-button-text">随机访问</span>
          </a>
          <a 
            class="banner-button no-text-decoration" 
            @click.prevent="$emit('apply-friendlink')"
          >
            <i class="anzhiyufont anzhiyu-icon-arrow-circle-right"></i>
            <span class="banner-button-text">申请友链</span>
          </a>
        </div>
      </div>
      
      <div id="skills-tags-group-all">
        <div class="tags-group-wrapper">
          <template v-for="(group, groupIndex) in paginatedLinks" :key="`group_${groupIndex}`">
            <template v-if="group.link_list && group.link_list.length > 0">
              <!-- 创建奇偶项配对 -->
              <div 
                v-for="index in Math.ceil(group.link_list.length / 2)" 
                :key="`pair_${groupIndex}_${index}`"
                class="tags-group-icon-pair" 
                style="margin-left: 1rem;"
              >
                <!-- 偶数索引项 -->
                <template v-if="group.link_list[(index - 1) * 2]">
                  <a 
                    class="tags-group-icon no-text-decoration" 
                    :href="urlFor(group.link_list[(index - 1) * 2].link)" 
                    :title="group.link_list[(index - 1) * 2].name"
                    target="_blank"
                  >
                    <img 
                      class="no-lightbox"
                      :title="group.link_list[(index - 1) * 2].name"
                      :src="avatarUrl(group.link_list[(index - 1) * 2].avatar, group.hundredSuffix)"
                      :alt="group.link_list[(index - 1) * 2].name"
                      @error="(e) => handleImgError(e, theme?.error_img?.flink)"
                    />
                  </a>
                </template>
                
                <!-- 奇数索引项 -->
                <template v-if="group.link_list[(index - 1) * 2 + 1]">
                  <a 
                    class="tags-group-icon no-text-decoration" 
                    :href="urlFor(group.link_list[(index - 1) * 2 + 1].link)" 
                    :title="group.link_list[(index - 1) * 2 + 1].name"
                    target="_blank"
                  >
                    <img 
                      class="no-lightbox"
                      :title="group.link_list[(index - 1) * 2 + 1].name"
                      :src="avatarUrl(group.link_list[(index - 1) * 2 + 1].avatar, group.hundredSuffix)"
                      :alt="group.link_list[(index - 1) * 2 + 1].name"
                      @error="(e) => handleImgError(e, theme?.error_img?.flink)"
                    />
                  </a>
                </template>
              </div>
            </template>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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