<script setup lang="ts">
import { about } from '~/about'
</script>

<template>
    <div class="author-main" v-for="(aboutItem, aboutIndex) in about" :key="aboutIndex">
        <div v-for="(author, authorIndex) in aboutItem.author":key="authorIndex">
            <div class="author-tag-left" v-for="left in author.left" :key="left.tag1">
                <span class="author-tag">{{ left.tag1 }}</span>
                <span class="author-tag">{{ left.tag2 }}</span>
                <span class="author-tag">{{ left.tag3 }}</span>
                <span class="author-tag">{{ left.tag4 }}</span>
            </div>
            <div class="author-box" style="z-index:0">
                <span></span>
                <div class="author-img">
                    <img class="no-lightbox" :src="author.logo" style="width: 100%;">
                </div>
            </div>
            <div class="author-tag-right" v-for="right in author.right" :key="right.tag1">
                <span class="author-tag">{{ right.tag1 }}</span>
                <span class="author-tag">{{ right.tag2 }}</span>
                <span class="author-tag">{{ right.tag3 }}</span>
                <span class="author-tag">{{ right.tag4 }}</span>
            </div>
        </div>
    </div>
</template>

<style lang="css" scoped>
/* author */
#about-page .author-info {
    display: flex;
    align-items: center;
    margin: 0 0 16px 0;
}

#about-page .author-tag-left {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

#about-page .author-tag-left .author-tag:first-child, #about-page .author-tag-left .author-tag:last-child {
    margin-right: -16px;
}
#about-page .author-tag-right {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}
#about-page .author-tag:nth-child(1) {
    animation-delay: 0s;
}
#about-page .author-tag:nth-child(2) {
    animation-delay: .6s;
}
#about-page .author-tag:nth-child(3) {
    animation-delay: 1.2s;
}
#about-page .author-tag:nth-child(4) {
    animation-delay: 1.8s;
}
#about-page .author-tag {
    transform: translate(0, -4px);
    padding: 1px 8px;
    background: var(--heo-card-bg);
    border: var(--style-border-always);
    border-radius: 40px;
    margin-top: 6px;
    font-size: 14px;
    font-weight: 700;
    box-shadow: var(--heo-shadow-lightblack);
    animation: 6s ease-in-out 0s infinite normal none running floating;
}
#about-page .author-img {
    margin: 0 30px;
    border-radius: 50%;
    width: 180px;
    height: 180px;
    position: relative;
    background: var(--heo-secondbg);
    user-select: none;
    transition: .3s;
}
#about-page .author-img #lottie_avatar {
    border-radius: 200px;
    overflow: hidden;
    width: 180px;
    height: 180px;
}
</style>