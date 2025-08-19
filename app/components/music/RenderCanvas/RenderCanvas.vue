<template>
  <aside
    id="zy-music-render-canvas"
    ref="asideRef"
    class="h-full w-full relative"
    :class="asideClasses"
    :style="asideStyles"
  >
    <div
      class="zy-music-mini-bar h-full w-full relative z-10 cursor-pointer"
      @click="handleCanvasClick"
    >
      <slot name="mini"></slot>
    </div>

    <!-- Canvas容器 - 始终保持fixed定位，通过JavaScript精确控制位置 -->
    <div
      ref="canvasContainerRef"
      class="fixed z-0"
      style="top: 0; left: 0; width: 0; height: 0"
    >
      <canvas
        ref="canvasRef"
        id="music-canvas"
        class="absolute top-0 left-0 cursor-grab"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
      ></canvas>
    </div>

    <!-- 隐藏的HTML内容，用于获取尺寸参考 -->
    <div
      id="mini-bar-reference"
      class="absolute bottom-0 left-0 w-full opacity-0 pointer-events-none"
      style="height: 4rem"
    ></div>

    <div
      v-if="isOpen"
      class="zy-music-drawer-inner fixed top-0 left-0 w-screen h-screen flex justify-center z-[100] text-white pointer-events-none"
    >
      <slot name="panel"></slot>
    </div>
  </aside>
</template>

<script setup lang="ts">
  import {
    ref,
    onMounted,
    onBeforeUnmount,
    nextTick,
    watch,
    computed,
  } from "vue";
  import { AnimationManager, blurMap } from "./RenderCanvasUtils";
  import type { CardState } from "./RenderCanvasUtils";

  // 接收来自父组件的封面图片路径
  const props = defineProps({
    coverSrc: {
      type: String,
      default: "",
    },
  });

  const emit = defineEmits(["switchOpen"]);

  // Canvas相关refs
  const canvasRef = ref<HTMLCanvasElement>();
  const asideRef = ref<HTMLElement>();
  const canvasContainerRef = ref<HTMLElement>();

  // 动画状态
  const isExpanded = ref(false);
  const isTransitioning = ref(false);
  const animationProgress = ref(0); // 动画进度 0-1

  // 动态类名计算
  const asideClasses = computed(() => {
    const classes = [];

    // 只有在真正的过渡状态（包括实际拖拽）时才添加过渡类
    if (isTransitioning.value || isActuallyDragging.value) {
      classes.push("canvas-in-transition");
    } else if (isExpanded.value) {
      classes.push("canvas-opened");
    } else {
      classes.push("canvas-closed");
    }

    return classes;
  });

  const isOpen = computed(() => {
    return isExpanded.value;
  });

  // 动态样式计算
  const asideStyles = computed(() => {
    return {
      "--progress": animationProgress.value.toString(),
    };
  });

  // 触摸/鼠标交互状态
  const isDragging = ref(false);
  const dragStartY = ref(0);
  const dragCurrentY = ref(0);
  // 拖拽开始时记住aside的位置，避免拖拽过程中位置变化
  const dragStartAsideRect = ref<DOMRect | null>(null);
  // 防误触：是否已经开始实际拖拽（超过阈值）
  const isActuallyDragging = ref(false);

  // 拖拽阈值常量
  const DRAG_THRESHOLD = 10; // 像素

  // Canvas上下文和动画变量
  let ctx: CanvasRenderingContext2D | null = null;
  let animationFrame: number | null = null;
  let devicePixelRatio = 1;
  let asideResizeObserver: ResizeObserver | null = null;
  let resizeDebounceTimer: ReturnType<typeof setTimeout> | null = null;
  let animationManager: AnimationManager | null = null;

  // 背景图片管理
  const backgroundImage = ref<HTMLImageElement | null>(null);
  const isImageLoading = ref(false);
  const currentImageSrc = ref("");

  // 获取CDN配置
  const config = useRuntimeConfig();
  const cdnUrl = config.public.CDN_URL || "";

  // 卡片状态
  const currentCardState = ref<CardState>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    borderRadius: 24,
    opacity: 1,
    blur: blurMap.closed, // 初始状态的模糊值（收起状态）
  });

  // 获取设备像素比率
  const getDevicePixelRatio = () => {
    return window.devicePixelRatio || 1;
  };

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
      } catch (defaultError) {
        console.error("Failed to load default image:", defaultError);
        backgroundImage.value = null;
      }
    } finally {
      isImageLoading.value = false;
    }
  };

  // 初始化Canvas
  const initCanvas = () => {
    const canvas = canvasRef.value;
    if (!canvas) return;

    ctx = canvas.getContext("2d");
    if (!ctx) return;

    devicePixelRatio = getDevicePixelRatio();

    // 设置Canvas尺寸
    resizeCanvas();

    // 初始化卡片状态为底部minibar位置
    initMiniBarState();

    // 开始渲染循环
    startRenderLoop();

    // 初始化动画管理器
    animationManager = new AnimationManager(
      currentCardState,
      isExpanded,
      asideRef,
      dragStartAsideRect,
      resizeCanvas,
      initMiniBarState,
      // 动画状态回调
      {
        onTransitionStart: () => {
          isTransitioning.value = true;
        },
        onTransitionEnd: () => {
          isTransitioning.value = false;
          animationProgress.value = isExpanded.value ? 1 : 0;
        },
        onProgressUpdate: (progress: number) => {
          animationProgress.value = progress;
        },
      },
    );
  };

  // 调整Canvas尺寸和容器位置 - 参考原版HTML的定位策略
  const resizeCanvas = () => {
    const canvas = canvasRef.value;
    const canvasContainer = canvasContainerRef.value;
    const aside = asideRef.value;
    if (!canvas || !ctx || !canvasContainer || !aside) return;

    let canvasWidth, canvasHeight;
    let containerTop, containerLeft;

    if (isExpanded.value) {
      // 展开状态：全屏覆盖
      canvasWidth = window.innerWidth;
      canvasHeight = window.innerHeight;
      containerTop = 0;
      containerLeft = 0;
      // 展开时设置较高z-index（作为背景层）
      canvasContainer.style.zIndex = "100";
    } else {
      // 收起状态：获取aside在视口中的绝对位置
      const asideRect = aside.getBoundingClientRect();
      canvasWidth = asideRect.width;
      canvasHeight = asideRect.height;
      containerTop = asideRect.top;
      containerLeft = asideRect.left;
      // 收起时使用最低z-index（作为背景层）
      canvasContainer.style.zIndex = "0";
    }

    // 像素对齐修复：确保容器位置和尺寸都是整数像素
    const alignedTop = Math.round(containerTop);
    const alignedLeft = Math.round(containerLeft);
    const alignedWidth = Math.round(canvasWidth);
    const alignedHeight = Math.round(canvasHeight);

    // 更新Canvas容器的位置和尺寸（使用像素对齐的坐标）
    canvasContainer.style.top = alignedTop + "px";
    canvasContainer.style.left = alignedLeft + "px";
    canvasContainer.style.width = alignedWidth + "px";
    canvasContainer.style.height = alignedHeight + "px";

    // 设置Canvas的实际尺寸（考虑设备像素比）
    canvas.width = alignedWidth * devicePixelRatio;
    canvas.height = alignedHeight * devicePixelRatio;

    // 设置Canvas的显示尺寸
    canvas.style.width = alignedWidth + "px";
    canvas.style.height = alignedHeight + "px";

    // 缩放上下文以匹配设备像素比
    ctx.scale(devicePixelRatio, devicePixelRatio);
  };

  // 初始化迷你播放条状态
  const initMiniBarState = () => {
    const canvas = canvasRef.value;
    const aside = asideRef.value;
    if (!canvas || !aside) return;

    // 获取aside容器的尺寸
    const asideRect = aside.getBoundingClientRect();

    // 填满整个aside容器，不留间隙
    currentCardState.value = {
      x: 0,
      y: 0,
      width: asideRect.width,
      height: asideRect.height,
      borderRadius: 24,
      opacity: 1,
      blur: blurMap.closed, // 收起状态的模糊值
    };
  };

  // 渲染背景层（专门为HTML内容提供动态背景）
  const renderCard = () => {
    if (!ctx || !canvasRef.value) return;

    const canvas = canvasRef.value;

    // 获取Canvas的当前显示尺寸
    const canvasWidth = parseInt(canvas.style.width) || 0;
    const canvasHeight = parseInt(canvas.style.height) || 0;

    // 清空画布
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    const state = currentCardState.value;

    // 像素对齐修复：确保所有坐标都是整数像素
    const alignedState = {
      x: Math.round(state.x),
      y: Math.round(state.y),
      width: Math.round(state.width),
      height: Math.round(state.height),
      borderRadius: Math.round(state.borderRadius),
      opacity: state.opacity,
      blur: Math.round(state.blur), // 模糊值也需要像素对齐
    };

    // 只绘制背景图片（模糊效果），作为HTML内容的背景层
    drawBackgroundImage(alignedState, canvasWidth, canvasHeight);
  };

  // 绘制圆角矩形
  const drawRoundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
  ) => {
    // 确保圆角半径不超过矩形的一半
    const maxRadius = Math.min(width / 2, height / 2);
    const actualRadius = Math.min(radius, maxRadius);

    ctx.beginPath();

    // 使用更精确的圆角绘制，避免像素泄漏
    if (actualRadius <= 0) {
      // 如果半径为0，绘制普通矩形
      ctx.rect(x, y, width, height);
    } else {
      // 从右上角开始，顺时针绘制
      ctx.moveTo(x + actualRadius, y);

      // 顶边
      ctx.lineTo(x + width - actualRadius, y);
      // 右上角圆弧
      ctx.quadraticCurveTo(x + width, y, x + width, y + actualRadius);

      // 右边
      ctx.lineTo(x + width, y + height - actualRadius);
      // 右下角圆弧
      ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - actualRadius,
        y + height,
      );

      // 底边
      ctx.lineTo(x + actualRadius, y + height);
      // 左下角圆弧
      ctx.quadraticCurveTo(x, y + height, x, y + height - actualRadius);

      // 左边
      ctx.lineTo(x, y + actualRadius);
      // 左上角圆弧
      ctx.quadraticCurveTo(x, y, x + actualRadius, y);
    }

    ctx.closePath();
  };

  // 绘制背景图片
  const drawBackgroundImage = (
    state: CardState,
    canvasWidth: number,
    canvasHeight: number,
  ) => {
    if (!ctx || !backgroundImage.value) return;

    ctx.save();

    // 创建裁剪路径，确保背景只在卡片区域内显示
    drawRoundedRect(
      ctx,
      state.x,
      state.y,
      state.width,
      state.height,
      state.borderRadius,
    );
    ctx.clip();

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

  // 渲染循环（专注于背景层渲染）
  const startRenderLoop = () => {
    const render = () => {
      renderCard(); // 只渲染动态背景
      animationFrame = requestAnimationFrame(render);
    };
    render();
  };

  // 停止渲染循环
  const stopRenderLoop = () => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
  };

  // Canvas点击处理
  const handleCanvasClick = (event: MouseEvent) => {
    if (
      !animationManager ||
      animationManager.isAnimationRunning() ||
      isDragging.value ||
      isActuallyDragging.value
    )
      return;

    if (isExpanded.value) {
      emit("switchOpen", false);
      animationManager.collapseCard();
    } else {
      emit("switchOpen", true);
      animationManager.expandCard();
    }
  };

  // 触摸事件处理
  const handleTouchStart = (event: TouchEvent) => {
    // 确保只处理单指触摸
    if (event.touches.length !== 1) return;

    if (
      !isExpanded.value ||
      !animationManager ||
      animationManager.isAnimationRunning() ||
      !asideRef.value
    )
      return;

    const touch = event.touches[0];
    if (!touch) return;

    // 只有在展开状态且事件可取消时才阻止默认行为
    if (isExpanded.value && event.cancelable) {
      event.preventDefault();
    }

    dragStartY.value = touch.clientY;
    dragCurrentY.value = touch.clientY;
    // 记住拖拽开始时aside的位置
    dragStartAsideRect.value = asideRef.value.getBoundingClientRect();
    isDragging.value = true;
    isActuallyDragging.value = false; // 重置实际拖拽状态

    // 不立即设置过渡状态，等待超过阈值后再设置
  };

  const handleTouchMove = (event: TouchEvent) => {
    // 确保只处理单指触摸
    if (event.touches.length !== 1) return;

    if (!isDragging.value || !isExpanded.value || !animationManager) return;

    const touch = event.touches[0];
    if (!touch) return;

    dragCurrentY.value = touch.clientY;
    const deltaY = dragCurrentY.value - dragStartY.value;

    // 检查是否超过拖拽阈值
    if (!isActuallyDragging.value && Math.abs(deltaY) > DRAG_THRESHOLD) {
      // 首次超过阈值，开始实际拖拽
      isActuallyDragging.value = true;
      isTransitioning.value = true; // 现在才设置过渡状态

      // 只有在开始实际拖拽时才阻止默认行为
      if (event.cancelable) {
        event.preventDefault();
      }
    }

    // 只有在实际拖拽状态下才允许向下拖拽并更新状态
    if (isActuallyDragging.value && deltaY > 0) {
      // 阻止页面滚动
      if (event.cancelable) {
        event.preventDefault();
      }
      animationManager.updateCardStateForDrag(deltaY);
    }
  };

  const handleTouchEnd = (event: TouchEvent) => {
    if (!isDragging.value || !animationManager) return;

    // 只有在实际拖拽时才阻止默认行为
    if (isActuallyDragging.value && event.cancelable) {
      event.preventDefault();
    }

    isDragging.value = false;

    // 如果没有实际开始拖拽（未超过阈值），直接重置状态
    if (!isActuallyDragging.value) {
      isActuallyDragging.value = false;
      dragStartAsideRect.value = null;
      // 不需要过渡状态，因为从未设置过
      return;
    }

    // 实际拖拽结束，但可能还在动画中，不立即重置过渡状态
    const deltaY = dragCurrentY.value - dragStartY.value;
    const collapseThreshold = 100; // 收缩阈值

    if (deltaY > collapseThreshold) {
      // 清理记住的位置并收缩
      dragStartAsideRect.value = null;
      animationManager.collapseCard();
    } else {
      // 回弹到展开状态 - 从当前状态开始
      animationManager.expandFromCurrentState();
    }

    // 重置实际拖拽状态
    isActuallyDragging.value = false;
  };

  // 鼠标事件处理（与触摸事件类似）
  const handleMouseDown = (event: MouseEvent) => {
    if (
      !isExpanded.value ||
      !animationManager ||
      animationManager.isAnimationRunning() ||
      !asideRef.value
    )
      return;

    dragStartY.value = event.clientY;
    dragCurrentY.value = event.clientY;
    // 记住拖拽开始时aside的位置
    dragStartAsideRect.value = asideRef.value.getBoundingClientRect();
    isDragging.value = true;
    isActuallyDragging.value = false; // 重置实际拖拽状态

    // 不立即设置过渡状态，等待超过阈值后再设置
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isDragging.value || !isExpanded.value || !animationManager) return;

    dragCurrentY.value = event.clientY;
    const deltaY = dragCurrentY.value - dragStartY.value;

    // 检查是否超过拖拽阈值
    if (!isActuallyDragging.value && Math.abs(deltaY) > DRAG_THRESHOLD) {
      // 首次超过阈值，开始实际拖拽
      isActuallyDragging.value = true;
      isTransitioning.value = true; // 现在才设置过渡状态
    }

    // 只有在实际拖拽状态下才允许向下拖拽并更新状态
    if (isActuallyDragging.value && deltaY > 0) {
      animationManager.updateCardStateForDrag(deltaY);
    }
  };

  const handleMouseUp = (event: MouseEvent) => {
    if (!isDragging.value || !animationManager) return;

    isDragging.value = false;

    // 如果没有实际开始拖拽（未超过阈值），直接重置状态
    if (!isActuallyDragging.value) {
      isActuallyDragging.value = false;
      dragStartAsideRect.value = null;
      // 不需要过渡状态，因为从未设置过
      return;
    }

    // 实际拖拽结束，但可能还在动画中，不立即重置过渡状态
    const deltaY = dragCurrentY.value - dragStartY.value;
    const collapseThreshold = 100; // 收缩阈值

    if (deltaY > collapseThreshold) {
      // 清理记住的位置并收缩
      dragStartAsideRect.value = null;
      animationManager.collapseCard();
    } else {
      // 回弹到展开状态 - 从当前状态开始
      animationManager.expandFromCurrentState();
    }

    // 重置实际拖拽状态
    isActuallyDragging.value = false;
  };

  // 窗口大小变化处理
  const handleResize = () => {
    setTimeout(() => {
      resizeCanvas();
      if (!isExpanded.value) {
        initMiniBarState();
      }
    }, 450);
  };

  // 处理aside容器尺寸变化
  const handleAsideResize = (entries: ResizeObserverEntry[]) => {
    // 防止在动画或拖拽过程中重新调整
    if (
      !animationManager ||
      animationManager.isAnimationRunning() ||
      isDragging.value ||
      isActuallyDragging.value
    ) {
      return;
    }

    // 只在收起状态时响应aside尺寸变化
    if (!isExpanded.value) {
      // 清除之前的防抖定时器
      if (resizeDebounceTimer) {
        clearTimeout(resizeDebounceTimer);
      }

      // 使用防抖避免频繁调整
      resizeDebounceTimer = setTimeout(() => {
        // 使用nextTick确保DOM更新完成
        nextTick(() => {
          // 重新调整Canvas容器尺寸和位置
          resizeCanvas();
          // 重新计算minibar状态以适应新尺寸
          initMiniBarState();
        });
        resizeDebounceTimer = null;
      }, 100); // 100ms防抖延迟
    }
  };

  // 初始化aside尺寸监听
  const initAsideResizeObserver = () => {
    if (!asideRef.value) return;

    // 创建ResizeObserver监听aside尺寸变化
    asideResizeObserver = new ResizeObserver(handleAsideResize);
    asideResizeObserver.observe(asideRef.value);
  };

  // 清理aside尺寸监听
  const cleanupAsideResizeObserver = () => {
    if (asideResizeObserver) {
      asideResizeObserver.disconnect();
      asideResizeObserver = null;
    }

    // 清理防抖定时器
    if (resizeDebounceTimer) {
      clearTimeout(resizeDebounceTimer);
      resizeDebounceTimer = null;
    }
  };

  // 监听封面变化
  watch(
    () => props.coverSrc,
    () => {
      updateBackgroundImage();
    },
  );

  watch(isOpen, (newVal) => {
    const body = document.documentElement;
    if (body) {
      body.style.overflow = newVal ? "hidden" : "auto";
    }
  });

  // 初始化触摸事件监听器
  const initTouchListeners = () => {
    const canvas = canvasRef.value;
    if (!canvas) return;

    // 使用精确的事件监听器配置
    canvas.addEventListener("touchstart", handleTouchStart, {
      passive: false, // 需要能够preventDefault
      capture: false,
    });

    canvas.addEventListener("touchmove", handleTouchMove, {
      passive: false, // 需要能够preventDefault来阻止滚动
      capture: false,
    });

    canvas.addEventListener("touchend", handleTouchEnd, {
      passive: false, // 可能需要preventDefault
      capture: false,
    });
  };

  // 清理触摸事件监听器
  const cleanupTouchListeners = () => {
    const canvas = canvasRef.value;
    if (!canvas) return;

    canvas.removeEventListener("touchstart", handleTouchStart);
    canvas.removeEventListener("touchmove", handleTouchMove);
    canvas.removeEventListener("touchend", handleTouchEnd);
  };

  // 生命周期钩子
  onMounted(async () => {
    initCanvas();
    window.addEventListener("resize", handleResize);

    // 初始化背景图片
    updateBackgroundImage();

    // 初始化aside尺寸监听
    nextTick(() => {
      initAsideResizeObserver();
      // 初始化触摸事件监听器
      initTouchListeners();
    });
  });

  onBeforeUnmount(() => {
    stopRenderLoop();
    window.removeEventListener("resize", handleResize);

    // 清理aside尺寸监听
    cleanupAsideResizeObserver();

    // 清理触摸事件监听器
    cleanupTouchListeners();
  });
</script>

<style lang="scss">
  #zy-music-render-canvas {
    canvas {
      touch-action: pan-y; /* 允许垂直滚动，但可以被JavaScript覆盖 */
      user-select: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
    }

    .zy-music-drawer-inner {
      will-change: transform, opacity, filter;
      contain: layout style paint;
      touch-action: manipulation;
      transform: translateZ(0);
      backface-visibility: hidden;
      perspective: 1000px;

      opacity: 0;
      transform-origin: bottom center;
      // @media screen and (orientation: landscape) {
      //   transform-origin: bottom left;
      // }
      // @media screen and (orientation: portrait) {
      //   transform-origin: bottom center;
      // }
    }

    &.canvas-in-transition {
      .zy-music-mini-bar {
        opacity: 0;
      }
      .zy-music-drawer-inner {
        opacity: 0;
        transform: translateY(2rem) scale(0.9);
        filter: blur(1rem);
      }
    }
    &.canvas-opened {
      .zy-music-mini-bar {
        opacity: 0;
      }
      .zy-music-drawer-inner {
        transition: all 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
        opacity: 1;
        transform: translateY(0) scale(1);
        filter: blur(0);
      }
    }
    &.canvas-closed {
      .zy-music-mini-bar {
        transition:
          opacity 200ms ease-in-out,
          transform 400ms !important;
        opacity: 1;
      }
      .zy-music-drawer-inner {
        opacity: 0;
        transform: translateY(2rem) scale(0.9);
        filter: blur(1rem);
      }
    }

    &.canvas-opened,
    &.canvas-in-transition {
      .zy-music-mini-bar,
      canvas {
        transform: translateY(0) !important;
      }
    }
  }
</style>
