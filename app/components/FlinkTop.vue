<!-- components/FlinkTop.vue -->
<script lang="ts" setup>
import friendsInfo from '~/friends'

const bannerInfo = [
  {
    title: "友情链接",
    description: "与数百名博主无限进步",
    buttonTextOne: "随机访问",
    buttonTextTwo: "申请友链",
  }
]
</script>

<template>
  <link rel="stylesheet" href="/assets/css/flinktop.css">
  <div class="flink_top">
    <div class="flink-banners" v-for="(info, infoItem) in bannerInfo" :key="infoItem">
      <div class="banner-top-box">
        <div class="flink-banners-title">
          <div class="banners-title-small"> {{ info.title }} </div>
          <div class="banners-title-big"> {{ info.description }} </div>
        </div>
        <div class="banner-button-group">
          <a class="banner-button secondary no-text-decoration" onclick="travelling()">
            <i class="anzhiyufont anzhiyu-icon-paper-plane1" style="margin-right: 8px;"></i>
            <span class="banner-button-text"> {{ info.buttonTextOne }} </span>
          </a>
          <a class="banner-button.no-text-decoration" onclick="addFriendLinksInFooter()">
            <i class="anzhiyufont anzhiyu-icon-arrow-circle-right"></i>
            <span class="banner-button-text"> {{ info.buttonTextTwo }} </span>
          </a>
        </div>
      </div>
    </div>
    <div class="skills-tags-group-all">
      <div class="tags-group-wrapper" v-for="(groups, index) in friends" :key="index">
        <div v-for="(flink, entries) in groups.entries" :key="entries">
          <div class="tags-group-icon-pair" style="margin-left:1rem" >
            <a class="tags-group-icon no-text-decoration" target="_blank" rel="noopener" :href="flink.link" :title="flink.author">
              <img class="no-lightbox" :title="flink.author" :src="flink.avatar" :alt="flink.author">
            </a>
            <a class="tags-group-icon no-text-decoration" target="_blank" rel="noopener" :href="flink.link" :title="flink.author">
              <img class="no-lightbox" :title="flink.author" :src="flink.avatar" :alt="flink.author">
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>