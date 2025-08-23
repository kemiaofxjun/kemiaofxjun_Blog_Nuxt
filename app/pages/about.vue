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
    <link href="/assets/css/about.css" rel="stylesheet"></link>
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
                <div class="author-content-item myInfoAndSayHello" v-for="info in about.myinfo" :key="info.title1" style="text-align: center;">
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