<script setup lang="ts">
import { aboutPage } from '~/about',

</script>

<template>
    <link href="/assets/css/about.css" rel="stylesheet"></link>
    <div id="about-page" v-for="about in aboutPage" :key="about.author">
        <div class="author-main" v-for="author in about.author" :key="author.left">
            <div class="author-tag-left" v-for="left in author.left" :key="left.tag1">
                <span class="author-tag">{{ left.tag1 }}</span>
                <span class="author-tag">{{ left.tag2 }}</span>
                <span class="author-tag">{{ left.tag3 }}</span>
                <span class="author-tag">{{ left.tag4 }}</span>
            </div>
            <div class="author-box">
                <span></span>
                <div class="author-img">
                    <img class="no-lightbox" :src="author.logo">
                </div>
            </div>
            <div class="author-tag-right" v-for="right in author.right" :key="right.tag1">
                <span class="author-tag">{{ right.tag1 }}</span>
                <span class="author-tag">{{ right.tag2 }}</span>
                <span class="author-tag">{{ right.tag3 }}</span>
                <span class="author-tag">{{ right.tag4 }}</span>
            </div>
        </div>
        <p class="p center logo large">{{ about.large }}</p>
        <div class="author-content" v-for="myinfo in author.myInfo" :key="myinfo.title1">
            <div class="author-content-item myInfoAndSayHello">
                <div class="title1">
                    {{ myinfo.title1 }}
                </div>
                <div class="title2">
                    {{ myinfo.title2 }}
                    <span class="inline-word">
                        {{ myinfo.inlineword1 }}
                    </span>
                </div>
                <div class="title1">
                    {{ myinfo.title3 }}
                    <span class="inline-word">
                        {{ myinfo.inlineword2 }}
                    </span>
                </div>
            </div>
            <div class="aboutsiteTips author-content-item" v-for="card in myinfo.card" :key="card.tips">
                <div class="author-content-item-tips">
                    {{ card.tips }}
                </div>
                <h2>
                    {{ card.conect1 }}
                    <br />
                    {{ card.conect2 }}
                    <span class="inline-word">
                        {{ card.inlineword }}
                    </span>
                    <div class="mask" v-for="mask in card.mask" :key="mask.firstTips">
                        <span class="first-tips">
                            {{ mask.firstTips }}
                        </span>
                        <span>
                            {{ mask.span }}
                        </span>
                        <span data-up="data-up">
                            {{ mask.up }}
                        </span>
                        <span data-show="data-show">
                            {{ mask.show }}
                        </span>
                    </div>
                </h2>
            </div>
        </div>
        <div class="hello-about">
            <div class="cursor" style="translate:none;rotate:none;scale:none;transform:translate(721px,180px)"></div>
            <div class="shapes">
                <div class="shape shape-1" style="translate:none;rotate:none;scale:none;transform:translate(721px,180px)"></div>
                <div class="shape shape-2" style="translate:none;rotate:none;scale:none;transform:translate(721px,180px)"></div>
                <div class="shape shape-3" style="translate:none;rotate:none;scale:none;transform:translate(721px,180px)"></div>
            </div>
            <div class="content">
                <h1>{{ about.hello }}</h1>
            </div>
        </div>
        <div class="author-content">
            <div class="author-content-item maxim" v-for="maxim in about.maxim" :key="maxim.tip">
                <div class="author-content-item-tips">
                    {{ maxim.tip }}
                </div>
                <span class="maxim-title">
                    <span style="opacity:.6;margin-bottom:8px">
                        {{ maxim.title1 }}
                    </span>
                    <span>
                        {{ maxim.title2 }}
                    </span>
                </span>
            </div>
            <div class="author-content-item myphoto">
                <img class="author-content-img no-lightbox" alt="自拍" :src="maxim.image" />
            </div>
        </div>
        <div class="author-content">
            <div class="author-content-item like-technology" v-for="technology in about.technology" :key="technology.tip">
                <div class="card-content">
                    <div class="author-content-item-tips">
                        {{ technology.tip }}
                    </div>
                    <span class="author-content-item-title">
                        {{ technology.title }}
                    </span>
                    <div class="content-bottom">
                        <div class="tips">
                            {{ technology.bottomTip }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="author-content-item game-yuanshen" v-for="game in about.game">
                <div class="card-content">
                    <div class="author-content-item-tips">
                        {{ game.tip }}
                    </div>
                    <span class="author-content-item-title">
                        {{ game.title }}
                    </span>
                    <div class="content-bottom">
                        <!-- <div class="icon-group">
                            <div class="loading-bar" role="presentation" aria-hidden="true">
                                <img class="no-lightbox" :src="game.image" alt="Loading..." longdesc="https://ys.mihoyo.com/main/" />
                            </div>
                        </div> -->
                        <div class="tips game-yuanshen-uid">
                            {{ game.uid }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="css" scoped>
  /* 1.基础架构 */
  #about-page .author-main {
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
    -webkit-box-pack: center;
    -moz-box-pack: center;
    -o-box-pack: center;
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    margin: 0 0 16px 0;
    user-select: none;
  }
  #about-page .author-box {
    position: relative;
    width: 189px;
    height: 189px;
    background: rgba(253, 253, 253, 0.8);
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  #about-page .author-img {
    margin: auto;
    border-radius: 50%;
    overflow: hidden;
    width: 180px;
    height: 180px;
    z-index: 10;
    background: var(--mj-card-bg);
  }
  .author-tag-left {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-right: 30px;
  }
  .author-tag-right {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-left: 30px;
  }
  /* 2.头像美化 */
  #about-page .author-box span {
    position: absolute;
    inset: 5px;
    border-radius: 50%;
    background: rgba(253, 253, 253, 0.8);
    z-index: 1;
  }
  #about-page .author-box::before {
    content: '';
    position: absolute;
    width: 500px;
    height: 500px;
    background-image: conic-gradient(transparent, transparent, transparent, #8758FF);
    animation: animate 4s linear infinite;
    animation-delay: -2s;
  }
  #about-page .author-box::after {
    content: '';
    position: absolute;
    width: 500px;
    height: 500px;
    background-image: conic-gradient(transparent, transparent, transparent, #5CB8E4);
    animation: animate 4s linear infinite;
  }
  /* 3.列表卡片美化 */
  .author-tag {
    transform: translate(0, -4px);
    padding: 1px 8px;
    background: var(--heo-card-bg);
    border: var(--style-border-always);
    border-radius: 40px;
    margin-top: 6px;
    font-size: 14px;
    font-weight: bold;
    box-shadow: var(--heo-shadow-lightblack);
    animation: 6s ease-in-out 0s infinite normal none running floating;
  }
  /* 4.列表卡片美化以及动画 */
  /* 4.1.左序列 */
  .author-tag-left .author-tag:first-child, .author-tag-left .author-tag:last-child {
    margin-right: -16px;
  }
  /* 4.2.右序列 */
  .author-tag-right .author-tag:first-child, .author-tag-right .author-tag:last-child {
    margin-left: -16px;
  }
  .author-tag:nth-child(1) {
    animation-delay: 0s;
  }
  .author-tag:nth-child(2) {
    animation-delay: 0.6s;
  }
  .author-tag:nth-child(3) {
    animation-delay: 1.2s;
  }
  .author-tag:nth-child(4) {
    animation-delay: 1.8s;
  }
  /* 5.动画css */
  @keyframes floating {
    0% {
      transform: translate(0, -4px);
    }
    50% {
      transform: translate(0, 4px);
    }
    100% {
      transform: translate(0, -4px);
    }
  }
  @keyframes animate {
    0% {
      transform: rotate(0)
    }
    100% {
      transform: rotate(360deg)
    }
  }
  /* 6.关于本站文字样式美化 */
  [data-theme=dark] #about-page .author-title {
    text-stroke: 1px #bccbe4;
    -webkit-text-stroke: 1px #bccbe4;
  }
  #about-page .author-title {
    font-size: 2.7rem;
    font-weight: 700;
    margin-top: 1px;
    letter-spacing: 6px;
    -webkit-background-clip: text;
    background-image: linear-gradient(90deg, #2ca2b4, #5598de 24%, #7f87ff 45%, #f65aad 85%, #df80b4);
    background-clip: text;
    display: inline-block;
    color: transparent;
    text-stroke: 2px #3fdaee;
    -webkit-text-stroke: 1px #3fdaee;
  }
</style>