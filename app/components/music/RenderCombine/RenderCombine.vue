<template>
  <aside class="h-full w-full relative transition-close">
    <div
      id="zy-music-bar-position"
      class="h-full w-full absolute top-0 left-0"
    ></div>
    <div class="relative z-10 h-full cursor-pointer">
      <ZyTouch
        id="zy-music-drawer"
        :class="drawerClasses"
        :init="touchInit"
        @slidingDown="handleSliding"
        @slideEndDown="handleSlideEnd"
        @slideCancelDown="handleSlideCancel"
        @slidingUp="handleSliding"
        @slideEndUp="handleSlideCancel"
        @slideCancelUp="handleSlideCancel"
      >
        <div class="h-full w-full overflow-hidden bg-level-b1">
          <canvas
            id="zy-music-background-canvas"
            ref="canvasRef"
            class="absolute top-0 left-0 -z-1"
            style="transform-origin: top left"
          ></canvas>

          <div class="zy-music-mini-bar h-full w-full relative z-10">
            <div
              v-if="!isOpen"
              content="展开音乐面板"
              v-tippy="{
                animation: 'scale',
              }"
              id="zy-music-mini-bar-click-area"
              class="h-full w-full absolute top-0 left-0 -z-1 cursor-pointer transition-all duration-300"
              @click="handleDrawerClick"
            ></div>
            <div
              class="zy-music-mini-bar-inner h-full w-full pointer-events-none"
            >
              <slot name="mini"></slot>
            </div>
          </div>

          <div
            v-show="isOpen"
            class="zy-music-drawer-inner absolute top-0 left-0 text-text-1 w-screen h-screen flex justify-center z-10 text-white"
            :class="{
              'is-overshoot': overshootProgress !== 0,
            }"
            :style="{
              '--overshootProgress': overshootProgress,
            }"
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
  } from "./RenderCombineUtils";

  // 引入Canvas相关类型和工具
  interface CardState {
    x: number;
    y: number;
    width: number;
    height: number;
    opacity: number;
    blur: number;
  }

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
  const isTransitioning = ref(false);
  const overshootProgress = ref(0);
  const config = useRuntimeConfig();
  const cdnUrl = config.public.CDN_URL;
  const touchInit = ref(0);

  // 移动端返回按键劫持相关状态
  const isBackButtonHandlerActive = ref(false);
  const backButtonStateKey = "music-drawer-open";

  // PC端Esc键监听状态
  const isEscKeyHandlerActive = ref(false);

  // 计算动态CSS类
  const drawerClasses = computed(() => {
    if (isTransitioning.value) {
      return "drawer-in-transition";
      return "";
    } else if (isOpen.value) {
      return "drawer-open";
    } else {
      return "drawer-close";
    }
  });

  // 添加返回按键劫持
  const addBackButtonHandler = () => {
    if (isBackButtonHandlerActive.value) return;

    // 添加一个新的历史状态
    history.pushState({ [backButtonStateKey]: true }, "", window.location.href);
    isBackButtonHandlerActive.value = true;

    // 监听返回按键事件
    window.addEventListener("popstate", handleBackButton);
  };

  // 移除返回按键劫持
  const removeBackButtonHandler = () => {
    if (!isBackButtonHandlerActive.value) return;

    isBackButtonHandlerActive.value = false;
    window.removeEventListener("popstate", handleBackButton);

    // 如果当前历史状态是我们添加的，则移除它
    if (history.state && history.state[backButtonStateKey]) {
      history.back();
    }
  };

  // 处理返回按键事件
  const handleBackButton = (event: PopStateEvent) => {
    // 检查是否是我们的状态被弹出
    if (isBackButtonHandlerActive.value && isOpen.value) {
      // 阻止默认的返回行为
      event.preventDefault();

      // 触发滑动结束事件（关闭面板）
      handleSlideEnd({});

      // 移除监听器
      removeBackButtonHandler();
    }
  };

  // 添加Esc键监听
  const addEscKeyHandler = () => {
    if (isEscKeyHandlerActive.value) return;

    isEscKeyHandlerActive.value = true;
    document.addEventListener("keydown", handleEscKey);
  };

  // 移除Esc键监听
  const removeEscKeyHandler = () => {
    if (!isEscKeyHandlerActive.value) return;

    isEscKeyHandlerActive.value = false;
    document.removeEventListener("keydown", handleEscKey);
  };

  // 处理Esc键事件
  const handleEscKey = (event: KeyboardEvent) => {
    // 检查是否按下了Esc键且面板处于打开状态
    if (event.key === "Escape" && isEscKeyHandlerActive.value && isOpen.value) {
      // 阻止默认行为
      event.preventDefault();

      // 触发滑动结束事件（关闭面板）
      handleSlideEnd({});
    }
  };

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

    // 添加返回按键劫持
    addBackButtonHandler();

    // 添加Esc键监听
    addEscKeyHandler();

    musicCardTransitionStart(
      el,
      drawer,
      () => {
        touchInit.value = Date.now();
      },
      {
        onTransitionStart: () => {
          isTransitioning.value = true;
        },
        onTransitionEnd: () => {
          isTransitioning.value = false;
        },
      },
    );
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
    musicCardTransitionSliding(el, drawer, moveDistanceY, {
      onTransitionStart: () => {
        isTransitioning.value = true;
      },
      onTransitionOvershoot: (progress: number) => {
        isTransitioning.value = false;
        overshootProgress.value = progress;
      },
    });
  };

  const handleSlideEnd = (val: any) => {
    if (!isOpen.value) {
      return;
    }

    // 移除返回按键劫持
    removeBackButtonHandler();

    // 移除Esc键监听
    removeEscKeyHandler();

    const el = document.getElementById("zy-music-bar");
    const drawer = document.getElementById("zy-music-drawer");
    musicCardTransitionSlideEndDown(
      el,
      drawer,
      () => {
        isOpen.value = false;
        emit("switchOpen", false);
        const body = document.documentElement;
        if (body) {
          body.style.overflow = "auto";
        }
        touchInit.value = Date.now();
      },
      {
        onTransitionEnd: () => {
          isTransitioning.value = false;
        },
      },
    );
  };

  const handleSlideCancel = () => {
    if (!isOpen.value) {
      return;
    }

    if (overshootProgress.value !== 0) {
      overshootProgress.value = 0;
      return;
    }

    const el = document.getElementById("zy-music-bar");
    const drawer = document.getElementById("zy-music-drawer");
    musicCardTransitionSlideCancelDown(el, drawer, {
      onTransitionEnd: () => {
        isTransitioning.value = false;
      },
    });
    touchInit.value = Date.now();
  };

  const handleDrawerClick = () => {
    if (!isOpen.value) {
      openMusicDrawer();
    }
  };

  // Canvas相关refs
  const canvasRef = ref<HTMLCanvasElement>();
  let ctx: CanvasRenderingContext2D | null = null;

  // 初始化Canvas
  const initCanvas = () => {
    const canvas = canvasRef.value;
    if (!canvas) return;

    ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 等待drawer元素准备好
    const checkDrawerReady = () => {
      const drawer = document.getElementById("zy-music-drawer");
      if (drawer) {
        resizeCanvas();
        requestAnimationFrame(renderLoop);
      } else {
        // 如果drawer还没准备好，继续等待
        setTimeout(checkDrawerReady, 10);
      }
    };

    checkDrawerReady();
  };

  // 调整Canvas大小
  const resizeCanvas = () => {
    const canvas = canvasRef.value;
    if (!canvas) return;

    const drawer = document.getElementById("zy-music-drawer");
    if (!drawer) return;

    // 获取drawer的实际大小（跟随HTML动画变化）
    const rect = drawer.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // 设置Canvas的显示大小为drawer的大小
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";

    // 设置Canvas的实际像素大小
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    // 重新获取绘图上下文（Canvas大小改变会重置上下文）
    ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 缩放绘图上下文以匹配设备像素比
    ctx.scale(dpr, dpr);
  };

  // 获取当前卡片状态
  const getCurrentCardState = (): CardState => {
    const drawer = document.getElementById("zy-music-drawer");
    const canvas = canvasRef.value;

    if (!drawer || !canvas) {
      // 默认状态（收起）
      return {
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: 64,
        opacity: 1,
        blur: 60,
      };
    }

    const computedStyle = window.getComputedStyle(drawer);
    const rect = drawer.getBoundingClientRect();

    // 由于Canvas现在的大小跟随drawer，背景图片应该填满整个Canvas
    // 坐标从(0,0)开始，尺寸就是Canvas/drawer的尺寸
    const x = 0;
    const y = 0;
    const width = rect.width;
    const height = rect.height;

    // 计算动态模糊值，基于卡片的大小变化
    const fullScreenArea = window.innerWidth * window.innerHeight;
    const currentArea = width * height;
    const areaRatio = Math.min(currentArea / fullScreenArea, 1);
    const blurValue = 60 + (250 - 60) * areaRatio; // 60-250范围动态调整

    return {
      x,
      y,
      width,
      height,
      opacity: parseFloat(computedStyle.opacity) || 1,
      blur: blurValue,
    };
  };

  // Canvas强制重绘状态（已移除性能优化）

  // 渲染循环
  const renderLoop = () => {
    if (!isRenderLoopRunning || !ctx || !canvasRef.value) return;

    const canvas = canvasRef.value;
    const state = getCurrentCardState();

    // 检查Canvas大小是否需要更新
    const drawer = document.getElementById("zy-music-drawer");
    if (drawer) {
      const rect = drawer.getBoundingClientRect();
      const currentCanvasWidth = parseInt(canvas.style.width) || 0;
      const currentCanvasHeight = parseInt(canvas.style.height) || 0;

      // 如果drawer尺寸发生变化，更新Canvas大小
      if (
        Math.abs(rect.width - currentCanvasWidth) > 1 ||
        Math.abs(rect.height - currentCanvasHeight) > 1
      ) {
        // console.log(`Canvas大小更新: ${currentCanvasWidth}x${currentCanvasHeight} -> ${rect.width}x${rect.height}`);
        resizeCanvas();
        // Canvas大小已更新，下一次绘制会自动处理
      }
    }

    // 每帧都重绘，确保效果优先，避免细微变化导致背景消失
    ctx.clearRect(
      0,
      0,
      canvas.width / (window.devicePixelRatio || 1),
      canvas.height / (window.devicePixelRatio || 1),
    );

    // 绘制背景图片
    drawBackgroundImage(state);

    // 继续下一帧
    if (isRenderLoopRunning) {
      requestAnimationFrame(renderLoop);
    }
  };

  // 停止渲染循环
  let isRenderLoopRunning = true;
  const stopRenderLoop = () => {
    isRenderLoopRunning = false;
  };

  // 背景图片管理
  const backgroundImage = ref<HTMLImageElement | null>(null);
  const isImageLoading = ref(false);
  const currentImageSrc = ref("");

  // 加载背景图片
  const loadBackgroundImage = async (
    src: string,
  ): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();

      // 设置跨域属性（如果需要）
      img.crossOrigin = "anonymous";

      img.onload = () => {
        resolve(img);
      };

      img.onerror = () => {
        reject(new Error(`Failed to load image: ${src}`));
      };

      img.src = src;
    });
  };

  // 更新背景图片
  const updateBackgroundImage = async () => {
    // 如果没有封面图片，使用默认背景
    if (!props.coverSrc) return;

    const newSrc = `${cdnUrl}${props.coverSrc}`;

    // 如果图片源没有变化，不需要重新加载
    if (newSrc === currentImageSrc.value && backgroundImage.value) {
      return;
    }

    isImageLoading.value = true;

    try {
      const img = await loadBackgroundImage(newSrc);
      backgroundImage.value = img;
      currentImageSrc.value = newSrc;
      // 图片已更新，下一帧自动重绘
    } catch (error) {
      console.warn("Failed to load background image, using default:", error);
      // 加载失败时使用默认图片
      try {
        const defaultImg = await loadBackgroundImage(
          "/images/material/music-player/default-cover.jpg",
        );
        backgroundImage.value = defaultImg;
        currentImageSrc.value =
          "/images/material/music-player/default-cover.jpg";
        // 默认图片已更新，下一帧自动重绘
      } catch (defaultError) {
        console.error("Failed to load default image:", defaultError);
        backgroundImage.value = null;
      }
    } finally {
      isImageLoading.value = false;
    }
  };

  // 绘制背景图片
  const drawBackgroundImage = (state: CardState) => {
    if (!ctx || !backgroundImage.value) return;

    ctx.save();

    // 计算背景图片的缩放和位置
    const img = backgroundImage.value;
    const imgAspect = img.width / img.height;
    const cardAspect = state.width / state.height;

    let drawWidth, drawHeight, drawX, drawY;

    // 计算缩放比例（类似CSS的scale(2)效果）
    const scale = 2;

    if (imgAspect > cardAspect) {
      // 图片更宽，以高度为准
      drawHeight = state.height * scale;
      drawWidth = drawHeight * imgAspect;
    } else {
      // 图片更高，以宽度为准
      drawWidth = state.width * scale;
      drawHeight = drawWidth / imgAspect;
    }

    // 居中定位
    drawX = state.x + (state.width - drawWidth) / 2;
    drawY = state.y + (state.height - drawHeight) / 2;

    // 应用动态模糊效果和色彩增强
    const blurAmount = state.blur; // 使用状态中的动态模糊值
    const brightness = 1.1; // 稍微提高亮度
    const saturate = 1.3; // 增加饱和度，让颜色更鲜艳
    ctx.filter = `blur(${blurAmount}px) brightness(${brightness}) saturate(${saturate})`;

    // 绘制背景图片
    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

    // 绘制遮罩层（作为纯背景层，使用更轻的遮罩）
    ctx.filter = "none"; // 重置滤镜
    const maskOpacity = 0.6; // 进一步减少遮罩，让背景图片更突出
    ctx.fillStyle = `rgba(0, 0, 0, ${maskOpacity})`;
    ctx.fillRect(state.x, state.y, state.width, state.height);

    ctx.restore();
  };

  onMounted(async () => {
    initMusicDrawer();

    // 初始化Canvas
    await nextTick();
    initCanvas();

    // 初始化背景图片
    updateBackgroundImage();
    isLoading.value = false;

    // 添加窗口大小变化监听
    window.addEventListener("resize", resizeCanvas);
  });

  // 监听封面图片变化
  watch(
    () => props.coverSrc,
    () => {
      updateBackgroundImage();
    },
    { immediate: true },
  );

  // 组件销毁前清理动画
  onBeforeUnmount(() => {
    // 清理所有进行中的动画
    cleanupAnimations();

    // 停止Canvas渲染循环
    stopRenderLoop();

    // 移除返回按键劫持
    removeBackButtonHandler();

    // 移除Esc键监听
    removeEscKeyHandler();

    // 清理事件监听器
    window.removeEventListener("resize", resizeCanvas);

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
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000px;

    .zy-music-drawer-inner {
      will-change: transform, opacity, filter;
      contain: layout style paint;
      touch-action: manipulation;

      @media screen and (orientation: portrait) {
        transform-origin: bottom center;
      }

      @media screen and (orientation: landscape) {
        transform-origin: bottom left;
      }
    }

    &.drawer-in-transition {
      // 过渡状态：让JavaScript动画完全控制，避免CSS冲突
      .zy-music-mini-bar-inner {
        transition: none !important;
        opacity: 0;
        filter: blur(1rem);
        transform: translateY(-2rem) scale(1.2);
      }
      .zy-music-drawer-inner {
        transition: all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
        opacity: 0;
        transform: scale(0.7);
        filter: blur(1rem);
      }
    }

    &.drawer-open {
      .zy-music-mini-bar-inner {
        opacity: 0;
        filter: blur(1rem);
        transform: translateY(-2rem) scale(1.2);
      }
      .zy-music-drawer-inner {
        transition: all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
        opacity: 1;
        transform: scale(1);
        filter: blur(0);

        &.is-overshoot {
          transition: none;
          transform: translateY(calc(var(--overshootProgress) * 5%))
            scaleY(calc(100% - var(--overshootProgress) * 5%));
        }
      }
    }

    &.drawer-close {
      .zy-music-mini-bar-inner {
        transition: all 400ms ease-out;
        opacity: 1;
        filter: blur(0);
        transform: translateY(0) scale(1);
      }
      .zy-music-drawer-inner {
        opacity: 0;
        transform: scale(0.7);
        filter: blur(1rem);
      }
    }
  }

  // 针对低端设备的优化
  @media (max-width: 600px) {
    #zy-music-drawer {
      // 在移动设备上使用更简单的动画
      .zy-music-drawer-inner {
        transition:
          opacity 400ms ease-out,
          transform 400ms ease-out;
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
</style>
