<script setup lang="ts">
import { aboutPage } from '~/about'

const layoutStore = useLayoutStore()
layoutStore.setAside(['blog-stats', 'connectivity', 'latest-comments', 'blog-log'])
// 动态加载外部 JS 脚本
  const loadScript = (url: string, callback?: () => void) => {
    return new Promise<void>((resolve, reject) => {
      // 检查是否已加载
      if (document.querySelector(`script[src="${url}"]`)) {
        console.log('JS脚本已加载');
        resolve();
        return;
      }

      // 创建 script 标签
      const script = document.createElement('script');
      script.src = url;
      script.type = 'text/javascript';
      script.async = true; // 异步加载（不阻塞页面渲染）

      // 加载成功回调
      script.onload = () => {
        console.log('脚本加载完成');
        callback?.();
        resolve();
      };

      // 加载失败回调
      script.onerror = (err) => {
        console.error('脚本加载失败', err);
        reject(err);
      };

      // 添加到 DOM（推荐添加到 head 或 body 末尾）
      document.head.appendChild(script);
    });
  };
  // 使用示例：加载百度统计脚本
  loadScript('https://www.myxz.top/assets/js/about.js')
    .then(() => {
      console.log('友链顶部重要JS加载完毕');
    })
    .catch((err) => {
      console.error('友链顶部重要JS加载完毕', err);
    });
</script>

<template>
    <!-- <link href="/assets/css/about.css" rel="stylesheet"></link> -->
    <div id="about-page" v-for="about in aboutPage" :key="about.author" style="margin-top: 1rem;margin-left: 1rem;margin-right: 1rem;">
        <div class="author-main" v-for="author in about.author" :key="author.left">
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
        <div class="author-page-content">
            <div class="author-content">
                <div class="author-content-item myInfoAndSayHello" v-for="info in about.myinfo" :key="info.title1" style="text-align: center; width: 100%">
                    <div class="title1">
                        {{ info.title1 }}
                    </div>
                    <div class="title2">
                        {{ info.title2 }}
                        <span class="inline-word">
                            {{ info.inlineword1 }}
                        </span>
                    </div>
                    <div class="title1">
                        {{ info.title3 }}
                        <span class="inline-word">
                            {{ info.inlineword2 }}
                        </span>
                    </div>
                </div>
            </div>
            <div class="author-content" v-for="info in about.myinfo" :key="info.title1">
                <div class="aboutsiteTips author-content-item" v-for="card in info.card" :key="card.tips">
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
            </div>
            <div class="author-content">
                <skillinfo />
            </div>
            <div class="author-content">
                <div class="author-content-item like-technology" v-for="technology in about.technology" :key="technology.tip" style="width: 50%;">
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
                <div class="author-content-item game" v-for="game in about.game"  style="width: 49%;">
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

/* 关于页面头像 */
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

/* 关于页面标题 */
#about-page .author-title {
    font-size: 2rem;
    font-weight: 700;
    margin: 1rem 0 2rem 0;
    line-height: 1;
}

/* 面板样式 */
.author-page-content {
    display: flex;
    flex-direction: column;
    gap: .5rem;
}

.author-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
    gap: .5rem;
}

.author-content-item {
    width: 49%;
    border-radius: 12px;
    background: var(--heo-card-bg);
    border: var(--style-border-always);
    box-shadow: var(--heo-shadow-border);
    position: relative;
    padding: 1rem 2rem;
    overflow: hidden;
}

@media screen and (min-width: 1300px) {
    .author-content-item {
        animation: slide-in .6s 0s backwards;
    }
}

/* myInfoAndSayHello */
#about-page .myInfoAndSayHello {
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: var(--heo-white);
    background: linear-gradient(120deg, #9a79fa 0, #00d4ff 100%);
    background-size: 200%;
    min-height: 175px;
}

#about-page .myInfoAndSayHello .title1 {
    opacity: .8;
    line-height: 1.3;
}

#about-page .myInfoAndSayHello .title2 {
    font-size: 36px;
    font-weight: 700;
    line-height: 1.1;
    margin: .5rem 0;
}

.inline-word {
    word-break: keep-all;
    white-space: nowrap;
}

#about-page .myInfoAndSayHello .title1 {
    opacity: .8;
    line-height: 1.3;
}

.inline-word {
    word-break: keep-all;
    white-space: nowrap;
}

/* aboutsiteTips */
.author-content-item.aboutsiteTips {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-direction: column;
    flex: 3;
}

.author-content-item .author-content-item-tips {
    opacity: .8;
    font-size: .6rem;
    margin-bottom: .5rem;
}

.aboutsiteTips h2 {
    margin-right: auto;
    font-size: 36px;
    font-family: Helvetica;
    line-height: 1.06;
    letter-spacing: -.02em;
    color: var(--heo-fontcolor);
    margin-top: 0;
}

.aboutsiteTips .mask {
    height: 36px;
    position: relative;
    overflow: hidden;
    margin-top: 4px;
}

.aboutsiteTips .mask span {
    display: block;
    box-sizing: border-box;
    position: absolute;
    top: 36px;
    padding-bottom: var(--offset);
    background-size: 100% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    background-repeat: no-repeat
}

.aboutsiteTips .mask span[data-show] {
    transform: translateY(-100%);
    transition: .5s transform ease-in-out
}

.aboutsiteTips .mask span[data-up] {
    transform: translateY(-200%);
    transition:.5s transform ease-in-out;
}

.aboutsiteTips .mask span:nth-child(1) {
    background-image: linear-gradient(45deg,#0ecffe 50%,#07a6f1)
}

.aboutsiteTips .mask span:nth-child(2) {
    background-image: linear-gradient(45deg,#18e198 50%,#0ec15d)
}

.aboutsiteTips .mask span:nth-child(3) {
    background-image: linear-gradient(45deg,#8a7cfb 50%,#633e9c)
}

.aboutsiteTips .mask span:nth-child(4) {
    background-image: linear-gradient(45deg,#fa7671 50%,#f45f7f)
}

/* 轮播skill */
.author-content-item.skills {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-direction: column;
    width: 100%;
}

.author-content-item.skills .skills-style-group {
    position: relative;
}

.author-content-item.skills .tags-group-all {
    display: flex;
    transform: rotate(0);
    transition: .3s;
}

.author-content-item.skills .tags-group-wrapper {
    margin-top: 40px;
    display: flex;
    flex-wrap: nowrap;
    animation: rowleft 60s linear infinite;
}

.tags-group-icon-pair {
    margin-left: 1rem;
    user-select: none;
}

.tags-group-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 66px;
    font-weight: 700;
    box-shadow: var(--heo-shadow-blackdeep);
}

.tags-group-icon {
    width: 100px;
    height: 100px;
    border-radius: 20px;
    position: relative;
}

.tags-group-icon img {
    width: 60%;
}

.author-content-item.skills .skills-list {
    display: flex;
    opacity: 0;
    transition: .3s;
    position: absolute;
    width: 50%;
    top: 0;
    left: 0;
    flex-wrap: wrap;
    flex-direction: row;
    margin-top: 10px;
    max-height: 310px;
    overflow: hidden;
}

.author-content-item.skills .skill-info {
    display: flex;
    align-items: center;
    margin-right: 10px;
    margin-top: 10px;
    background: var(--heo-background);
    border-radius: 40px;
    padding: 8px 12px 8px 8px;
    border: var(--style-border);
    box-shadow: var(--heo-shadow-border);
}

.author-content-item.skills .skill-icon {
    width: 32px;
    height: 32px;
    border-radius: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 8px;
    user-select: none;
}

.author-content-item.skills .skill-icon img {
    width: 18px;
    height: 18px;
}

.author-content-item.skills .skill-name {
    font-weight: 700;
    line-height: 1;
}

.tags-group-icon-pair .tags-group-icon:nth-child(even) {
    margin-top: 1rem;
    transform: translate(-60px);
}

.author-content-item.skills .etc {
    margin-right: 10px;
    margin-top: 14px;
}

/* careers */
.author-content-item.careers {
    min-height: 400px;
}

.author-content-item.careers img {
    position: absolute;
    left: 0;
    bottom: 20px;
    width: 100%;
    transition: .6s;
    user-select: none
}

.author-content-item.careers .careers-group {
    margin-top: 12px
}

.author-content-item.careers .careers-item {
    display: flex;
    align-items: center
}

.author-content-item.careers .careers-item .circle {
    width: 16px;
    height: 16px;
    margin-right: 8px;
    border-radius: 16px
}

.author-content-item.careers .careers-item .name {
    color: var(--heo-secondtext)
}

/* maxim */
.author-content-item.maxim {
    font-size: 36px;
    font-weight: 700;
    line-height: 1.1;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    justify-content: center;
}

.author-content-item .author-content-item-tips {
    opacity: .8;
    font-size: .6rem;
    margin-bottom: .5rem;
}

.author-content-item.maxim .maxim-title {
    display: flex;
    flex-direction: column;
}

/* technology */
.author-content-item.like-technology {
    /* background: url(https://p.zhheo.com/1Z29e0210….png!cover) no-repeat; */
    background-size: cover;
    min-height: 230px;
    /* color: var(--heo-white); */
}

.author-content-item .author-content-item-tips {
    opacity: .8;
    font-size: .6rem;
    margin-bottom: .5rem;
}

.author-content-item .card-content .author-content-item-title {
    margin-bottom: .5rem;
}
.author-content-item .author-content-item-title {
    font-size: 36px;
    font-weight: 700;
    line-height: 1;
}

.author-content-item .content-bottom {
    margin-top: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    min-height: 40px;
}

.author-content-item .content-bottom .tips {
    max-width: calc(100% - 6rem);
    line-height: 1.2;
}

/* game */
.author-content-item.game {
    background: url(https://bcjyn0fc8o7wifyp.public.blob.vercel-storage.com/img/1567427018126688.jpg) no-repeat top;
    background-size: cover;
    min-height: 300px;
    overflow: hidden;
    color: var(--heo-white);
    width: 59%;
}

/* 动画组件 */
@keyframes rowleft {
    from {
        transform: translateX(0)
    }

    to {
        transform: translateX(-50%)
    }
}

@keyframes rowup {
    from {
        transform: translateY(0)
    }

    to {
        transform: translateY(-50%)
    }
}

@keyframes  floating {
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
/* 移动端页面 */
@media screen and (max-width: 768px) {
    .author-content {
        margin-top: 0;
        flex-direction: column;
    }
    .author-content-item {
        width: 100% !important;
        padding: 1rem;
    }
    #about-page .author-tag-left, #about-page .author-tag-right {
        display: none;
    }
}

/* hover
@media (hover: hover) {
    .author-content-item.skills:hover .skills-style-group .skills-list {
        opacity: 1;
    }
} */
</style>