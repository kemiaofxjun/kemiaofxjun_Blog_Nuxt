<script lang="ts" setup>
import { equipment } from "~/equipment"
</script>

<template>
    <div id="icat-equipment">
        <div v-for="i in equipment" :key="i.class_name">
            <h2 :id="i.class_name">
                {{ i.class_name }}
            </h2>
            <div class="equipment-desc">
                {{ i.class_desc }}
            </div>
            <div class="equipment" v-for="item in i.equipmentList" :key="item.name">
                <div class="icat-equipment-box">
                    <img :src="item.image">
                    <div class="icat-equipment-content">
                        <div class="icat-equipment-name">
                            {{ item.name }}
                        </div>
                        <div class="icat-equipment-custom">
                            {{ item.custom }}
                        </div>
                        <div class="icat-equipment-opinion">
                            {{ item.opinion }}
                        </div>
                        <div class="icat-equipment-box-more">
                            <a :herf="item.details_flink" title="跳转到{{ item.name }}的产品详情">
                                {{ i.infoname }}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
:root {
    --icat-white: #fff;
    --icat-white-op: rgba(255, 255, 255, 0.2);
    --icat-black: #000;
    --icat-black-op: rgba(0, 0, 0, 0.2);
    --icat-none: #00000000;
    --icat-gray: #999999;
    --icat-gray-op: #9999992b;
    --icat-vip: #e5a80d;
    --icat-main: var(--icat-theme);
    --icat-main-op: var(--icat-theme-op);
    --icat-main-op-deep: var(--icat-theme-op-deep);
    --icat-main-op-light: var(--icat-theme-op-light);
    --icat-main-none: var(--icat-theme-none);
    --icat-shadow-theme: 0 8px 12px -3px var(--icat-theme-op);
    --icat-shadow-blackdeep: 0 2px 16px -3px rgba(0, 0, 0, .15);
    --icat-shadow-main: 0 8px 12px -3px var(--icat-main-op);
    --icat-shadow-blue: 0 8px 12px -3px rgba(40, 109, 234, .20);
    --icat-shadow-white: 0 8px 12px -3px rgba(255, 255, 255, .20);
    --icat-shadow-black: 0 0 12px 4px rgba(0, 0, 0, .05);
    --icat-shadow-yellow: 0px 38px 77px -26px rgba(255, 201, 62, .12);
    --icat-shadow-red: 0 8px 12px -3px #ee7d7936;
    --icat-shadow-green: 0 8px 12px -3px #87ee7936;
    --icat-logo-color: linear-gradient(215deg, #4584ff 0%, #cf0db9 100%);
    --icat-snackbar-time: 5s;
    --icat-post-bg: var(--icat-blue);
    --style-border-hover-always: 1px solid var(--icat-blue)
}

.light,:root {
    --icat-theme: #425AEF;
    --icat-theme-op: #4259ef23;
    --icat-theme-op-deep: #4259efdd;
    --icat-theme-op-light: #4259ef0d;
    --icat-theme-none: #4259ef01;
    --icat-blue: #425AEF;
    --icat-blue-op: #425AEF4D;
    --icat-red: #f04a63;
    --icat-pink: #FF7C7C;
    --icat-green: #57bd6a;
    --icat-yellow: #c28b00;
    --icat-yellow-op: #d99c001a;
    --icat-orange: #e38100;
    --icat-shadow-orange: 0 8px 12px -3px rgba(227, 129, 0, .2);
    --icat-purple: #7a60d2;
    --icat-fontcolor: #363636;
    --icat-background: #f7f9fe;
    --icat-reverse: #000;
    --icat-maskbg: rgba(255, 255, 255, 0.6);
    --icat-maskbgdeep: rgba(255, 255, 255, 0.85);
    --icat-hovertext: var(--icat-main);
    --icat-ahoverbg: #F7F7FA;
    --icat-lighttext: var(--icat-main);
    --icat-secondtext: rgba(60, 60, 67, 0.8);
    --icat-scrollbar: rgba(60, 60, 67, 0.4);
    --icat-card-btn-bg: #edf0f7;
    --icat-post-blockquote-bg: #fafcff;
    --icat-post-tabs-bg: #f2f5f8;
    --icat-secondbg: #f7f7f9;
    --icat-shadow-nav: 0 5px 12px -5px rgba(102, 68, 68, 0.05);
    --icat-card-bg: #fff;
    --icat-card-bg-op: var(--icat-black-op);
    --icat-card-bg-none: rgba(255, 255, 255, 0);
    --icat-shadow-lightblack: 0 5px 12px -5px rgba(102, 68, 68, 0.00);
    --icat-shadow-light2black: 0 5px 12px -5px rgba(102, 68, 68, 0.00);
    --icat-card-border: #e3e8f7;
    --icat-shadow-border: 0 8px 16px -4px #2c2d300c;
    --icat-tabs-background: #49B1F5;
    --style-border: 1px solid var(--icat-card-border);
    --style-border-hover: 1px solid var(--icat-main);
    --style-border-dashed: 1px dashed var(--icat-theme-op);
    --style-border-forever: 2px solid var(--icat-main)
}

.dark {
    --icat-theme: #f2b94b;
    --icat-theme-op: #f2b94b23;
    --icat-theme-op-deep: #f2b94bdd;
    --icat-theme-none: #f2b94b00;
    --icat-blue: #0084FF;
    --icat-blue-op: #0084FF4D;
    --icat-red: #FF3842;
    --icat-pink: #d44040;
    --icat-green: #3e9f50;
    --icat-purple: #7a60d2;
    --icat-yellow: #ffc93e;
    --icat-yellow-op: #ffc93e30;
    --icat-orange: #ff953e;
    --icat-shadow-orange: 0 8px 12px -3px rgba(255, 149, 62, .2);
    --icat-fontcolor: #F7F7FA;
    --icat-background: #18171d;
    --icat-reverse: #fff;
    --icat-maskbg: rgba(0, 0, 0, 0.6);
    --icat-maskbgdeep: rgba(0, 0, 0, 0.85);
    --icat-hovertext: #0A84FF;
    --icat-ahoverbg: #fff;
    --icat-lighttext: var(--icat-theme);
    --icat-secondtext: #a1a2b8;
    --icat-scrollbar: rgba(200, 200, 223, 0.4);
    --icat-card-btn-bg: #30343f;
    --icat-post-blockquote-bg: #000;
    --icat-post-tabs-bg: #121212;
    --icat-secondbg: #21232a;
    --icat-shadow-nav: 0 5px 20px 0px rgba(28, 28, 28, 0.4);
    --icat-card-bg: #1b1c20;
    --icat-card-bg-op: var(--icat-white-op);
    --icat-card-bg-none: #1d1b2600;
    --icat-shadow-lightblack: 0 5px 12px -5px rgba(102, 68, 68, 0.0);
    --icat-shadow-light2black: 0 5px 12px -5px rgba(102, 68, 68, 0.0);
    --icat-card-border: #3d3d3f;
    --icat-shadow-border: 0 8px 16px -4px #00000050;
    --icat-tabs-background: #81d8cf;
    --style-border: 1px solid var(--icat-card-border);
    --style-border-hover: 1px solid var(--icat-theme);
    --style-border-dashed: 1px dashed var(--icat-theme-op);
    --style-border-forever: 2px solid var(--icat-lighttext)
}

/* 装备页面美化（icat） */
/* 由苏晓河进行编写以及调整 */
/* 时间：2025年2月5日 */

#icat-equipment > h2 {
    margin: 20px 7px 0;
  }
  #icat-equipment .equipment-desc {
    margin: 0 7px;
    color: var(--icat-secondtext);
  }
  #icat-equipment {
    padding-bottom: 12px;
  }
  #icat-equipment .equipment {
    display: flex;
    flex-wrap: wrap;
    padding: 10px 0 0;
    gap: 16px;
  }
  /* 初始化 */
  
  #icat-equipment .equipment > .icat-equipment-box {
    border: 1px solid var(--icat-secondbg);
    background: var(--icat-card-bg);
    width: calc(100% / 4 - 12px);
    border-radius: 12px;
    overflow: hidden;
  }
  #icat-equipment .equipment .icat-equipment-box img {
    min-width: 100%;
    max-width: 100%;
    height: 200px;
    object-fit: cover;
    animation:fadeIn 1s;
    cursor:pointer;
    transition:all .4s ease-in-out;
  }
  #icat-equipment .equipment .icat-equipment-box img:hover {
      transform:scale(1.03);
  }
  #icat-equipment .equipment .icat-equipment-box .icat-equipment-content {
    padding: 16px;
  }
  #icat-equipment .equipment .icat-equipment-box .icat-equipment-content .icat-equipment-name {
    color: var(--icat-fontcolor);
    font-size: 18px;
    font-weight: bold;
    line-height: 1;
    margin-bottom: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  #icat-equipment .equipment .icat-equipment-box .icat-equipment-content .icat-equipment-custom {
    font-size: 12px;
    color: var(--icat-secondtext);
    line-height: 1;
    margin-bottom: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  #icat-equipment .equipment .icat-equipment-box .icat-equipment-content .icat-equipment-opinion {
    line-height: 20px;
    color: var(--icat-secondtext);
    height: 60px;
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    margin-bottom: 16px;
  }
  #icat-equipment .equipment .icat-equipment-box .icat-equipment-content .icat-equipment-box-more {
    display: flex;
    justify-content: space-between;
  }
  
  #icat-equipment .equipment .icat-equipment-box .icat-equipment-content .icat-equipment-box-more a {
    font-size: 12px;
    background: var(--icat-gray-op);
    color: var(--icat-fontcolor);
    padding: 4px 12px;
    border-radius: 6px;
    letter-spacing: 1px;
  }
  #icat-equipment .equipment .icat-equipment-box .icat-equipment-content .icat-equipment-box-more a:hover {
    color: var(--icat-white);
    background: var(--icat-blue);
    box-shadow: 0 8px 16px -4px var(--icat-black-op);
  }
  /* 好物页基础样式 */
  
  @media screen and (max-width: 900px) {
    #icat-equipment .equipment {
      gap: 10px;
    }
    #icat-equipment .equipment > .icat-equipment-box {
      width: calc(100% / 3 - 7px);
    }
  }
  @media screen and (max-width: 768px) {
    #icat-equipment .equipment {
      gap: 8px;
    }
    #icat-equipment .equipment > .icat-equipment-box {
      width: 100%;
    }
    #icat-equipment .equipment .icat-equipment-box img {
      height: 220px;
    }
  }
  /* 响应式 */
  
  /* 我的好物样式 */
</style>