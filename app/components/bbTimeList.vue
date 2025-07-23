<template>
  <div id="bbTimeList" class="bbTimeList container">
    <svg 
      class="icon bber-logo iconfont icon-chrome" 
      @click="goToEssayPage"
      title="即刻短文"
      aria-hidden="true"
    >
      <use :xlink:href="'#icon-chrome'" />
    </svg>

    <div 
      id="bbtalk" 
      class="swiper-container swiper-no-swiping essay_bar_swiper_container"
      tabindex="-1"
    >
      <div 
        id="bber-talk" 
        class="swiper-wrapper" 
        @click="goToEssayPage"
      >
        <div 
          v-for="(item, index) in filteredEssays" 
          :key="index"
          class="li-style swiper-slide"
        >
          {{ item.content }}{{ hasMedia(item) ? ' [媒体]' : '' }}
        </div>
      </div>
    </div>

    <i 
      class="bber-gotobb fas fa-arrow-circle-right" 
      @click="goToEssayPage" 
      title="查看全文"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { EssayItem, BannerConfig, Constants } from '~/essayd';

export default defineComponent({
  props: {
    essays: {
      type: Array as PropType<EssayItem[]>,
      required: true,
      default: () => []
    },
    bannerData: {
      type: Object as PropType<BannerConfig>,
      default: () => ({})
    },
    constants: {
      type: Object as PropType<Constants>,
      default: () => ({})
    }
  },
  computed: {
    filteredEssays() {
      const { limit = 10 } = this.bannerData;
      return this.essays.slice(0, limit);
    }
  },
  methods: {
    hasMedia(item: EssayItem): boolean {
      return !!item.image || !!(item.video && item.video.length > 0);
    },
    goToEssayPage() {
      const path = this.constants?.buttonLink || '/essay/';
      this.$router.push(path);
    }
  }
});
</script>

<style scoped>
/* 即刻短文首页美化（安知鱼） */
/* 由苏晓河进行编写以及调整 */
/* 时间：2025年2月5日 */

.essay-mini {
    width: 1300px;
    margin: auto;
    border: 2px solid rgba(0, 255, 255, .6);
    background: rgba(255, 255, 255, .67)
}
@media screen and (max-width: 768px) {
    .essay-mini {
        width: auto;
        margin: 0;
        margin-bottom: 10px;
        padding-left: 15px;
        padding-right: 15px;
    }
}
@media screen and (max-width: 900px) {
    .essay-mini {
        width: auto;
        margin: 0;
        margin-bottom: 10px;
        padding-left: 15px;
        padding-right: 15px;
    }
}
@media screen and (max-width: 1200px) {
    .essay-mini {
        width: auto;
        margin: 0;
        margin-bottom: 10px;
        padding-left: 15px;
        padding-right: 15px;
    }
}

#bbTimeList {
    background: var(--anzhiyu-white);
    color: var(--anzhiyu-fontcolor);
    padding: 0.5rem 1rem;
    border-radius: 10px;
    box-shadow: var(--anzhiyu-shadow-lightblack);
    display: flex;
    transition: all 0.3s ease 0s;
    margin: 1rem auto 0;
    border: var(--style-border);
    align-items: center;
    height: 50px;
    width: 100%;
    margin-top: 0;
  }
  [data-theme="dark"] #bbTimeList {
    background: #000 !important;
  }
  #bbtalk {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  #bber-talk {
    width: 100%;
    height: 25px;
    line-height: 25px;
    display: flex;
    flex-direction: column;
  }
  .bber-logo {
    font-size: 1.5rem;
    line-height: 22px;
    margin-right: 1rem;
    transition: all 0.3s ease 0s;
    cursor: pointer;
  }
  
  .bber-gotobb {
    line-height: 25px;
    margin-left: 1rem;
    transition: all 0.3s ease 0s;
    cursor: pointer;
  }
  
  #bber-talk .li-style {
    width: 100%;
    max-width: 100%;
    height: 25px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: 0.3s;
    font-weight: 700;
    margin: auto;
    cursor: pointer;
    white-space: nowrap;
  }
  
  #bbTimeList:hover {
    border: var(--style-border-hover);
    box-shadow: var(--anzhiyu-shadow-main);
  }
  
  /* 文章页H1-H6图标样式效果 */
  .bbTimeList .bber-logo {
    -webkit-animation: rotate 1.6s linear infinite;
    animation: rotate 1.6s linear infinite;
  }
  @-webkit-keyframes rotate {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    to {
      -webkit-transform: rotate(-1turn);
      transform: rotate(-1turn);
    }
  }
  @keyframes rotate {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    to {
      -webkit-transform: rotate(-1turn);
      transform: rotate(-1turn);
    }
  }
</style>