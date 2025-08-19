<template>
  <aside class="h-full w-full relative transition-close">
    <div
      id="zy-music-bar-position"
      class="h-full w-full absolute top-0 left-0"
    ></div>
    <div class="relative z-10 h-full cursor-pointer">
      <ZyTouch
        id="zy-music-drawer"
        class="transition-close"
        :init="touchInit"
        @slidingDown="handleSliding"
        @slideEndDown="handleSlideEnd"
        @slideCancelDown="handleSlideCancel"
        @slidingUp="handleSliding"
        @slideEndUp="handleSlideCancel"
        @slideCancelUp="handleSlideCancel"
      >
        <div class="h-full w-full overflow-hidden">
          <div
            id="zy-music-background"
            class="absolute top-0 left-0 w-full h-full -z-1 bg-background"
          >
            <img
              v-if="!isLoading"
              class="absolute top-0 left-0 h-full w-full object-cover scale-[2] transition-all duration-300"
              :class="{
                'blur-[10vmax]': isOpen,
                'blur-[2rem]': !isOpen,
              }"
              :src="`${cdnUrl}${props.coverSrc}`"
              alt=""
              srcset=""
            />
            <div
              id="zy-music-background-mask"
              class="absolute top-0 right-0 -z-1 w-full h-full bg-[rgba(0,0,0,0.6)] backdrop-saturate-150"
            ></div>
          </div>

          <div
            class="zy-music-mini-bar h-full w-full open:hidden relative z-10"
          >
            <slot name="mini"></slot>
          </div>
          <div
            v-if="!isOpen"
            id="zy-music-mini-bar-click-area"
            class="h-full w-full absolute top-0 left-0 z-10 cursor-pointer transition-all duration-300"
            @click="handleDrawerClick"
          ></div>
          <div
            v-if="isOpen"
            class="zy-music-drawer-inner absolute top-0 left-0 text-text-1 w-screen h-screen flex justify-center z-10 text-white"
          >
            <slot name="panel"></slot>
          </div>
        </div>
      </ZyTouch>
    </div>
  </aside>
</template>
<script setup lang="ts">
  import {
    musicCardTransitionStart,
    musicCardTransitionSliding,
    musicCardTransitionSlideEndDown,
    musicCardTransitionSlideCancelDown,
    initMusicDrawer,
    cleanupAnimations,
    isAnimating,
  } from "./RenderHtmlUtils";

  // 接收来自父组件的封面图片路径
  const props = defineProps({
    coverSrc: {
      type: String,
      default: "",
    },
  });

  const emit = defineEmits(["switchOpen"]);

  const isLoading = ref(true);
  const isOpen = ref(false);
  const config = useRuntimeConfig();
  const cdnUrl = config.public.CDN_URL;
  const touchInit = ref(0);

  // 打开音乐卡片
  const openMusicDrawer = () => {
    // 防止重复触发动画
    if (isAnimating()) {
      return;
    }

    const body = document.documentElement;
    if (body) {
      body.style.overflow = "hidden";
    }
    const el = document.getElementById("zy-music-bar");
    const drawer = document.getElementById("zy-music-drawer");
    isOpen.value = true;
    emit("switchOpen", true);
    musicCardTransitionStart(el, drawer, () => {
      touchInit.value = Date.now();
    });
  };

  /**
   * 处理音乐卡片滑动事件
   *
   * 修复说明：
   * - 移除了 Math.abs() 处理，保留 moveDistanceY 的方向信息
   * - 正值表示向上滑动（恢复全屏），负值表示向下滑动（收缩卡片）
   * - 配合 transition.ts 中的精确滑动控制逻辑
   */
  const handleSliding = (val: any) => {
    if (!isOpen.value) {
      return;
    }

    const el = document.getElementById("zy-music-bar");
    const drawer = document.getElementById("zy-music-drawer");
    const moveDistanceY = val.moveDistanceY;
    // 传递原始的moveDistanceY值，保留方向信息
    // 正值表示向上滑动，负值表示向下滑动
    musicCardTransitionSliding(el, drawer, moveDistanceY);
  };

  const handleSlideEnd = (val: any) => {
    if (!isOpen.value) {
      return;
    }

    const el = document.getElementById("zy-music-bar");
    const drawer = document.getElementById("zy-music-drawer");
    musicCardTransitionSlideEndDown(el, drawer, () => {
      isOpen.value = false;
      emit("switchOpen", false);
      const body = document.documentElement;
      if (body) {
        body.style.overflow = "auto";
      }
      touchInit.value = Date.now();
    });
  };

  const handleSlideCancel = () => {
    if (!isOpen.value) {
      return;
    }

    const el = document.getElementById("zy-music-bar");
    const drawer = document.getElementById("zy-music-drawer");
    musicCardTransitionSlideCancelDown(el, drawer);
    touchInit.value = Date.now();
  };

  const handleDrawerClick = () => {
    if (!isOpen.value) {
      openMusicDrawer();
    }
  };

  onMounted(async () => {
    initMusicDrawer();
    isLoading.value = false;
  });

  // 组件销毁前清理动画
  onBeforeUnmount(() => {
    // 清理所有进行中的动画
    cleanupAnimations();

    // 恢复页面滚动
    const body = document.documentElement;
    if (body) {
      body.style.overflow = "auto";
    }
  });
</script>
<style scoped lang="scss">
  #zy-music-drawer {
    // 性能优化属性
    will-change: transform, opacity, width, height, left, top;
    contain: layout style paint;
    touch-action: manipulation;

    .zy-music-drawer-inner {
      will-change: transform, opacity, filter;
      contain: layout style paint;
      touch-action: manipulation;
    }
  }

  #zy-music-drawer.transition-open {
    // 性能优化：使用 GPU 加速
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000px;

    .open\:hidden {
      opacity: 0;
    }
  }

  #zy-music-drawer.transition-close {
    // 性能优化：使用 GPU 加速
    transform: translateZ(0);
    backface-visibility: hidden;

    .open\:hidden {
      transition: opacity 400ms 200ms;
      opacity: 1;
    }
  }

  #zy-music-drawer.transition-open {
    border-radius: 0rem;
    .zy-music-drawer-inner {
      transition: all 300ms 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
      opacity: 1;
      transform: translateY(0) scale(1);
      filter: blur(0);
    }
  }

  #zy-music-drawer.transition-close {
    .zy-music-drawer-inner {
      transition: all 200ms cubic-bezier(0.55, 0.055, 0.675, 0.19);
      opacity: 0;
      transform: translateY(2rem) scale(0.9);
      filter: blur(1rem);
    }
  }

  // 针对低端设备的优化
  @media (max-width: 600px) {
    #zy-music-drawer {
      // 在移动设备上使用更简单的动画
      .zy-music-drawer-inner {
        transition:
          opacity 300ms ease-out,
          transform 300ms ease-out;
      }
    }
  }

  // 针对高刷新率设备的优化
  @media (min-resolution: 120dpi) {
    #zy-music-drawer {
      // 在高 DPI 设备上使用更平滑的动画
      .zy-music-drawer-inner {
        transition: all 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }
    }
  }
  #zy-music-background {
    will-change: transform;
    contain: layout style paint;
    touch-action: manipulation;
  }
  // 移动端动效减弱
  .mobile {
    #zy-music-background {
      img {
        height: 100vh;
        width: 100vw;
        filter: blur(10vmax);
      }
      #zy-music-background-mask {
        backdrop-filter: none;
      }
    }
  }
  .pc {
    #zy-music-mini-bar-control {
      button {
        &:hover {
          background-color: rgba(127, 143, 166, 0.2);
        }
      }
    }
    #zy-music-mini-bar-click-area {
      &:hover {
        background-color: rgba(127, 143, 166, 0.2);
        // backdrop-filter: saturate(200%);
      }
    }
  }
</style>
