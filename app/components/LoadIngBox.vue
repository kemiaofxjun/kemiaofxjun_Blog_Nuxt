<template>
  <div 
    id="loading-box" 
    :class="{ loaded: !isLoading }"
    @click="handleClick"
  >
    <div class="loading-bg">
      <div class="loading-img"></div>
      <div class="loading-image-dot"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingBox',
  props: {
    // 保留theme prop（根据实际项目结构调整）
    theme: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      isLoading: true // 控制加载状态的响应式变量
    }
  },
  methods: {
    // 结束加载
    endLoading() {
      document.body.style.overflow = 'auto';
      this.isLoading = false;
    },
    // 初始化加载
    initLoading() {
      document.body.style.overflow = '';
      this.isLoading = true;
    },
    // 点击加载框手动结束加载
    handleClick() {
      this.endLoading();
    }
  },
  mounted() {
    // 仅保留页面完全加载事件监听
    window.addEventListener('load', this.endLoading);
  },
  beforeDestroy() {
    // 仅移除页面加载事件的监听
    window.removeEventListener('load', this.endLoading);
  }
}
</script>

<style scoped>
.loading-img {
  background: url(https://npm.elemecdn.com/anzhiyu-blog@2.1.1/img/avatar.webp) no-repeat center center;
  background-size: cover;
}

.loading-bg {
    display: -webkit-box;
    display: -moz-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: box;
    display: flex;
    width: 100%;
    height: 100%;
    position: fixed;
    background: var(--anzhiyu-card-bg);
    z-index: 1001;
    opacity: 1;
    -ms-filter: none;
    filter: none;
    overflow: hidden;
    -webkit-transition: .2s;
    -moz-transition: .2s;
    -o-transition: .2s;
    -ms-transition: .2s;
    transition: .2s;
    -webkit-animation: showLoading .3s 0s backwards;
    -moz-animation: showLoading .3s 0s backwards;
    -o-animation: showLoading .3s 0s backwards;
    -ms-animation: showLoading .3s 0s backwards;
    animation: showLoading .3s 0s backwards
}

.loading-bg::-webkit-scrollbar {
    display: none
}

#loading-box {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none
}

#loading-box .loading-img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin: auto;
    border: 4px solid #f0f0f2;
    -webkit-animation-duration: .2s;
    -moz-animation-duration: .2s;
    -o-animation-duration: .2s;
    -ms-animation-duration: .2s;
    animation-duration: .2s;
    -webkit-animation-name: loadingAction;
    -moz-animation-name: loadingAction;
    -o-animation-name: loadingAction;
    -ms-animation-name: loadingAction;
    animation-name: loadingAction;
    -webkit-animation-iteration-count: infinite;
    -moz-animation-iteration-count: infinite;
    -o-animation-iteration-count: infinite;
    -ms-animation-iteration-count: infinite;
    animation-iteration-count: infinite;
    -webkit-animation-direction: alternate;
    -moz-animation-direction: alternate;
    -o-animation-direction: alternate;
    -ms-animation-direction: alternate;
    animation-direction: alternate
}

#loading-box .loading-image-dot {
    width: 30px;
    height: 30px;
    background: #6bdf8f;
    position: absolute;
    border-radius: 50%;
    border: 6px solid #fff;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(18px,24px);
    -moz-transform: translate(18px,24px);
    -o-transform: translate(18px,24px);
    -ms-transform: translate(18px,24px);
    transform: translate(18px,24px)
}

#loading-box.loaded .loading-bg {
    opacity: 0;
    -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
    filter: alpha(opacity=0);
    z-index: -1000
}

@-moz-keyframes loadingAction {
    0% {
        opacity: 1;
        -ms-filter: none;
        filter: none
    }

    100% {
        opacity: .4;
        -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=40)";
        filter: alpha(opacity=40)
    }
}

@-webkit-keyframes loadingAction {
    0% {
        opacity: 1;
        -ms-filter: none;
        filter: none
    }

    100% {
        opacity: .4;
        -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=40)";
        filter: alpha(opacity=40)
    }
}

@-o-keyframes loadingAction {
    0% {
        opacity: 1;
        -ms-filter: none;
        filter: none
    }

    100% {
        opacity: .4;
        -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=40)";
        filter: alpha(opacity=40)
    }
}

@keyframes loadingAction {
    0% {
        opacity: 1;
        -ms-filter: none;
        filter: none
    }

    100% {
        opacity: .4;
        -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=40)";
        filter: alpha(opacity=40)
    }
}
</style>