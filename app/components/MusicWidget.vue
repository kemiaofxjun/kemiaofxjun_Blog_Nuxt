<script lang="ts" setup>
import { ref, onMounted } from 'vue'
const appConfig = useAppConfig()
// 加载外部脚本
onMounted(() => {
  const loadScript = (src: string) => {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve(null)
      
      const script = document.createElement('script')
      script.src = src
      script.async = true
      script.onload = resolve
      script.onerror = reject
      document.head.appendChild(script)
    })
  }

  loadScript('https://blog.zhheo.com/plugin/aplayer/APlayer.min.js')
    .catch(err => console.error('脚本加载失败:', err))
})
</script>

<template>
  <div class="needEndHide" id="nav-music">
    <!-- 音乐控制提示区域 -->
    <div id="nav-music-hoverTips">
      <!-- 上一首按钮 -->
      <i 
        id="music-prev" 
        class="music-control-btn fas fa-backward-step"
        onclick="sco.musicSkipBack()"
      ></i>
      
      <!-- 暂停按钮 -->
      <i 
        id="music-pause" 
        class="music-control-btn fas fa-pause" 
        onclick="sco.musicToggle()"
      ></i>
      
      <!-- 播放按钮 -->
      <i 
        id="music-play" 
        class="music-control-btn fas fa-play" 
        onclick="sco.musicToggle()"
      ></i>
      
      <!-- 下一首按钮 -->
      <i 
        id="music-next" 
        class="music-control-btn fas fa-forward-step" 
        onclick="sco.musicSkipForward()"
      ></i>
    </div>

    <!-- 音乐播放器组件 -->
    <meting-js 
      :id="appConfig.capsule.id"
      :server="appConfig.capsule.server"
      :type="appConfig.capsule.type"
      mutex="true"
      preload="none"
      :theme="'var(--efu-main)'"
      data-lrctype="0"
      order="random"
      :volume="appConfig.capsule.volume"
    />
  </div>
</template>
<style lang="css" scoped>
.aplayer.aplayer-narrow .aplayer-body, .aplayer.aplayer-narrow .aplayer-pic {
     height: 66px;
     width: 66px;
}
 #nav-music {
     display: flex;
     align-items: center;
     z-index: 12;
     position: fixed;
     bottom: 20px;
     left: 20px;
     cursor: pointer;
     transition: all 0.5s, left 0s;
     transform-origin: left bottom;
     border-radius: 40px;
     overflow: hidden;
}
 #nav-music .aplayer-button {
     display: none;
}
 #nav-music.playing {
     box-shadow: 0 0px 12px -3px var(--efu-none);
     animation: playingShadow 5s linear infinite;
}
 #nav-music.playing .aplayer.aplayer-withlrc .aplayer-pic {
     box-shadow: 0 0 14px rgba(255,255,255,0.651);
     transform: rotate(0deg) scale(1.1);
     border-color: var(--efu-white);
     animation-play-state: running;
}
 #nav-music.playing .aplayer.aplayer-withlrc .aplayer-info {
     color: var(--efu-white);
}
 #nav-music.playing .aplayer {
     background: var(--efu-music);
     backdrop-filter: saturate(180%) blur(20px);
     transform: translateZ(0);
}
 #nav-music.playing .aplayer .aplayer-info .aplayer-controller .aplayer-bar-wrap .aplayer-bar .aplayer-played {
     animation-play-state: running;
}
 #nav-music:hover #nav-music-hoverTips {
     opacity: 1;
}
 #nav-music:hover:not(.playing) #nav-music-hoverTips {
     justify-content: center;
     padding-right: 0;
}
 #nav-music:hover:not(.playing) #music-play {
     display: flex;
     padding: 5px 10px;
     width: 100%;
     height: 100%;
     justify-content: center;
     align-items: center;
}
 #nav-music.playing #nav-music-hoverTips {
     width: 180px;
     right: 0;
     left: auto;
     background: linear-gradient(to left, var(--efu-music) 60%, transparent);
}
 #nav-music.playing:hover #nav-music-hoverTips > i:not(#music-play) {
     display: block;
}
 #nav-music .aplayer.aplayer-withlrc .aplayer-pic {
     height: 25px;
     width: 25px;
     border-radius: 40px;
     z-index: 1;
     transition: 0.3s;
     transform: rotate(0deg) scale(1);
     border: var(--style-border-always);
     animation: changeright 24s linear infinite;
     animation-play-state: paused;
}
 #nav-music .aplayer.aplayer-withlrc .aplayer-info {
     height: 100%;
     color: var(--efu-fontcolor);
     margin: 0;
     margin-right: 8px;
     padding: 0;
     display: flex;
     align-items: center;
}
 #nav-music #nav-music-hoverTips {
     color: var(--efu-white);
     background: var(--efu-music);
     width: 100%;
     height: 100%;
     position: absolute;
     top: 0;
     left: 0;
     align-items: center;
     justify-content: center;
     display: flex;
     border-radius: 40px;
     opacity: 0;
     font-size: 12px;
     z-index: 2;
     transition: 0.3s;
     justify-content: flex-end;
     gap: 1rem;
     padding-right: 1rem;
}
 #nav-music #nav-music-hoverTips i {
     font-size: 16px;
     display: none;
     cursor: pointer;
}
 #nav-music .aplayer {
     background: var(--efu-music);
     border-radius: 60px;
     height: 41px;
     display: flex;
     margin: 0;
     transition: 0.3s;
     box-shadow: none;
}
 #nav-music .aplayer .aplayer-notice, #nav-music .aplayer .aplayer-miniswitcher, #nav-music .aplayer .aplayer-list {
     display: none;
}
 #nav-music .aplayer .aplayer-body {
     position: relative;
     display: flex;
     align-items: center;
}
 #nav-music .aplayer .aplayer-info .aplayer-music {
     margin: 0;
     display: flex;
     align-items: center;
     padding-bottom: 0;
     padding-left: 8px;
     cursor: pointer;
     z-index: 1;
     height: 100%;
}
 #nav-music .aplayer .aplayer-info .aplayer-music .aplayer-title {
     cursor: pointer;
     line-height: 1;
     display: inline-block;
     white-space: nowrap;
     max-width: 120px;
     overflow: hidden;
     text-overflow: ellipsis;
     transition: 0.3s;
     user-select: none;
     color: var(--efu-white);
}
 #nav-music .aplayer .aplayer-info .aplayer-controller .aplayer-bar-wrap {
     margin: 0;
     padding: 0;
}
 #nav-music .aplayer .aplayer-info .aplayer-controller .aplayer-bar-wrap .aplayer-bar {
     height: 100%;
     background: 0 0;
}
 #nav-music .aplayer .aplayer-info .aplayer-controller .aplayer-bar-wrap .aplayer-bar .aplayer-loaded {
     display: none;
}
 #nav-music .aplayer .aplayer-info .aplayer-controller .aplayer-bar-wrap .aplayer-bar .aplayer-played {
     height: 100%;
     opacity: 0.1;
     background-color: var(--efu-white) !important;
     animation: lightBar 5s ease infinite;
     animation-play-state: paused;
}
 #nav-music .aplayer .aplayer-pic {
     pointer-events: none;
     margin-left: 8px;
}
 #nav-music .aplayer .aplayer-pic .aplayer-button {
     bottom: 50%;
     right: 50%;
     transform: translate(50%, 50%);
     margin: 0;
     transition: 0.3s;
     pointer-events: all;
}
 #nav-music .aplayer .aplayer-pic:has(.aplayer-button.aplayer-play) {
     animation-play-state: paused;
     transform: rotate(0deg) scale(1) !important;
}
 #nav-music .aplayer .aplayer-info .aplayer-controller .aplayer-time, #nav-music .aplayer .aplayer-info .aplayer-music .aplayer-author {
     display: none;
}
 #nav-music .aplayer.aplayer-withlist .aplayer-info {
     border: none;
}
 #nav-music .aplayer .aplayer-lrc {
     width: 0;
     opacity: 0;
     transition: 0.3s;
     margin-bottom: -15px;
}
 #nav-music .aplayer .aplayer-lrc p.aplayer-lrc-current {
     color: var(--efu-white);
     border: none;
     min-height: 20px;
     filter: none;
}
 #nav-music .aplayer .aplayer-lrc:after, #nav-music .aplayer .aplayer-lrc:before {
     display: none;
}
 #nav-music .aplayer .aplayer-lrc p {
     color: rgba(255,255,255,0.702);
     filter: blur(0.8px);
}
 #nav-music.stretch .aplayer.aplayer-withlrc .aplayer-lrc {
     width: 200px;
     opacity: 1;
}
 .aplayer-thumb {
     width: 0 !important;
     height: 0 !important;
}
 @-moz-keyframes changeright {
     0%, 50%, 100% {
         transform: rotate(0deg) scale(1.1);
         box-shadow: 0 0 2px rgba(255,255,255,0);
    }
     25%, 75% {
         transform: rotate(90deg) scale(1.1);
         box-shadow: 0 0 14px #fff;
    }
}
 @-webkit-keyframes changeright {
     0%, 50%, 100% {
         transform: rotate(0deg) scale(1.1);
         box-shadow: 0 0 2px rgba(255,255,255,0);
    }
     25%, 75% {
         transform: rotate(90deg) scale(1.1);
         box-shadow: 0 0 14px #fff;
    }
}
 @-o-keyframes changeright {
     0%, 50%, 100% {
         transform: rotate(0deg) scale(1.1);
         box-shadow: 0 0 2px rgba(255,255,255,0);
    }
     25%, 75% {
         transform: rotate(90deg) scale(1.1);
         box-shadow: 0 0 14px #fff;
    }
}
 @keyframes changeright {
     0%, 50%, 100% {
         transform: rotate(0deg) scale(1.1);
         box-shadow: 0 0 2px rgba(255,255,255,0);
    }
     25%, 75% {
         transform: rotate(90deg) scale(1.1);
         box-shadow: 0 0 14px #fff;
    }
}
 @-moz-keyframes playingShadow {
     0%, 100% {
         box-shadow: 0 0px 12px -3px var(--efu-none);
    }
     50% {
         box-shadow: 0 0px 12px 0px var(--efu-music);
    }
}
 @-webkit-keyframes playingShadow {
     0%, 100% {
         box-shadow: 0 0px 12px -3px var(--efu-none);
    }
     50% {
         box-shadow: 0 0px 12px 0px var(--efu-music);
    }
}
 @-o-keyframes playingShadow {
     0%, 100% {
         box-shadow: 0 0px 12px -3px var(--efu-none);
    }
     50% {
         box-shadow: 0 0px 12px 0px var(--efu-music);
    }
}
 @keyframes playingShadow {
     0%, 100% {
         box-shadow: 0 0px 12px -3px var(--efu-none);
    }
     50% {
         box-shadow: 0 0px 12px 0px var(--efu-music);
    }
}
 @-moz-keyframes lightBar {
     0%, 100% {
         opacity: 0.1;
    }
     60% {
         opacity: 0.3;
    }
}
 @-webkit-keyframes lightBar {
     0%, 100% {
         opacity: 0.1;
    }
     60% {
         opacity: 0.3;
    }
}
 @-o-keyframes lightBar {
     0%, 100% {
         opacity: 0.1;
    }
     60% {
         opacity: 0.3;
    }
}
 @keyframes lightBar {
     0%, 100% {
         opacity: 0.1;
    }
     60% {
         opacity: 0.3;
    }
}

</style>