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
  <div id="flink_top">
    <div id="flink-banners">
      <div class="banner-top-box" v-for="(info, infoItem) in bannerInfo" :key="infoItem">
        <div class="flink-banners-title">
          <div class="banners-title-small"> {{ info.title }} </div>
          <div class="banners-title-big"> {{ info.description }} </div>
        </div>
        <div class="banner-button-group">
          <a class="banner-button secondary no-text-decoration" onclick="travelling()">
            <i class="anzhiyufont anzhiyu-icon-paper-plane1" style="margin-right: 8px;"></i>
            <span class="banner-button-text"> {{ info.buttonTextOne }} </span>
          </a>
          <a class="banner-button no-text-decoration" onclick="addFriendLinksInFooter()">
            <i class="anzhiyufont anzhiyu-icon-arrow-circle-right"></i>
            <span class="banner-button-text"> {{ info.buttonTextTwo }} </span>
          </a>
        </div>
      </div>
    </div>
    <div id="skills-tags-group-all">
      <div class="tags-group-wrapper" v-for="groups in friendsInfo" :key="groups.name">
        <div class="tags-group-icon-pair" style="margin-left:1rem" v-for="flink in groups.entries" :key="flink.author" >
          <a class="tags-group-icon no-text-decoration" target="_blank" rel="noopener" :href="flink.link" :title="flink.author" :key="flink.author">
            <img class="no-lightbox" :title="flink.author" :src="flink.avatar" :alt="flink.author">
          </a>
          <a class="tags-group-icon no-text-decoration" target="_blank" rel="noopener" :href="flink.link" :title="flink.author" :key="flink.author">
            <img class="no-lightbox" :title="flink.author" :src="flink.avatar" :alt="flink.author">
          </a>
        </div>
      </div>
    </div>
  </div>
</template>