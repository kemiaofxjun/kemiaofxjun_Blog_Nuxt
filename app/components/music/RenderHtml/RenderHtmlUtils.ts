let animationEndPlaying = false;
let currentAnimation: Animation | null = null;
const ANIMATION_DURATION = 400; // 动画时长

// 智能动画系统：
// 1. 根据滑动距离动态调整动画速度
// 2. 消除弹跳效果，确保平滑过渡
// 3. 展开后圆角设为0，完全全屏效果
// 4. 使用高精度的位置计算和样式管理

// 现代化的缓动曲线
const EASING_CURVES = {
  expand: "cubic-bezier(0.25, 0.46, 0.45, 0.94)", // easeOutQuad - 展开动画
  collapse: "cubic-bezier(0.55, 0.055, 0.675, 0.19)", // easeInQuad - 收缩动画
  smooth: "cubic-bezier(0.165, 0.84, 0.44, 1)", // 原有的缓动曲线 - 平滑过渡
  elastic: "cubic-bezier(0.68, -0.55, 0.265, 1.55)", // 弹性效果 - 恢复动画
  quickSnap: "cubic-bezier(0.25, 0.1, 0.25, 1)", // 快速收缩 - 小距离动画
  fastRecover: "cubic-bezier(0.25, 0.46, 0.45, 0.94)", // 快速恢复 - 小距离恢复
};

function setInitStyles(element: HTMLElement) {
  const cssText = `
   position: static !important;
   display: block !important;
   height: 100% !important;
   width: 100% !important;
   cursor: grab !important;
   border-radius: 1.5rem !important;
  `;
  element.style.cssText = cssText;
}

function cancelAllAnimations(element: HTMLElement) {
  const animations = element.getAnimations();
  animations.forEach((animation: Animation) => {
    animation.cancel();
  });
}

function cancelImportantStyles(element: HTMLElement) {
  element.style.removeProperty("top");
  element.style.removeProperty("left");
  element.style.removeProperty("width");
  element.style.removeProperty("height");
  element.style.removeProperty("border-radius");
  element.style.removeProperty("transform");
  element.style.removeProperty("transition");
}

export function musicCardTransitionStart(
  element: any,
  drawer: any,
  callback: () => void,
) {
  // 取消之前的动画
  if (currentAnimation) {
    currentAnimation.cancel();
  }

  // 窗口大小
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  // 获取元素的位置
  const elementRect = element.getBoundingClientRect();

  // 设置初始状态
  drawer.style.position = "fixed";
  drawer.style.display = "block";
  drawer.style.zIndex = "1000";

  // 定义动画关键帧 - 优化展开动画的流畅度
  const keyframes = [
    {
      top: elementRect.top + "px",
      left: elementRect.left + "px",
      width: elementRect.width + "px",
      height: elementRect.height + "px",
      borderRadius: "24px", // 1.5rem ≈ 24px，保持单位一致性
      offset: 0,
    },
    {
      top: elementRect.top * 0.8 + "px",
      left: elementRect.left * 0.8 + "px",
      width: elementRect.width * 1.05 + "px",
      height: elementRect.height * 1.05 + "px",
      borderRadius: "12px", // 0.75rem ≈ 12px
      offset: 0.3,
    },
    {
      top: "0px",
      left: "0px",
      width: windowWidth + "px",
      height: windowHeight + "px",
      borderRadius: "0px", // 展开后完全无圆角
      offset: 1,
    },
  ];

  // 动画选项
  const animationOptions: KeyframeAnimationOptions = {
    duration: ANIMATION_DURATION,
    easing: EASING_CURVES.expand,
    fill: "forwards",
  };

  // 清理强制样式，让动画能够正常接管
  cancelImportantStyles(drawer);

  // 执行动画
  currentAnimation = drawer.animate(keyframes, animationOptions);

  // 同步添加CSS类
  setTimeout(() => {
    element.classList.remove("transition-close");
    drawer.classList.remove("transition-close");
    element.classList.add("transition-open");
    drawer.classList.add("transition-open");
  }, 20);

  // 动画完成回调
  currentAnimation?.addEventListener("finish", () => {
    if (animationEndPlaying) return;

    drawer.style.width = "100%";
    drawer.style.height = "100%";
    drawer.style.top = "0px";
    drawer.style.left = "0px";

    // 展开后设置圆角为0，确保完全全屏效果
    drawer.style.borderRadius = "0";

    callback();
    currentAnimation = null;
  });

  // 错误处理
  currentAnimation?.addEventListener("cancel", () => {
    currentAnimation = null;
  });
}

/**
 * 音乐卡片滑动过渡控制函数
 *
 * 改进说明：
 * 1. 修复了上滑超过起始点后继续向下过度的问题
 * 2. 移除了 Math.abs() 的使用，保留滑动方向信息
 * 3. 添加了基于当前状态的精确进度计算
 * 4. 实现了"橡皮筋"过冲效果，提升交互体验
 *
 * @param element 目标音乐播放条元素
 * @param drawer 音乐抽屉元素
 * @param moveDistanceY 滑动距离 (正值=向上滑动, 负值=向下滑动)
 */
export function musicCardTransitionSliding(
  element: any,
  drawer: any,
  moveDistanceY: number,
) {
  // 取消当前动画以实现跟手效果
  if (currentAnimation) {
    currentAnimation.cancel();
    currentAnimation = null;
  }

  // 彻底清理所有动画相关的样式，防止动画样式覆盖手动设置的样式
  const animations = drawer.getAnimations();
  animations.forEach((animation: Animation) => {
    animation.cancel();
  });

  // 强制清理动画状态
  drawer.style.animation = "none";
  drawer.style.animationName = "none";

  // 窗口大小
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  // 获取目标元素（迷你播放条）的位置
  const elementRect = element.getBoundingClientRect();

  // 定义滑动阈值 - 滑动超过屏幕高度的 1/3 就开始明显变化
  const slideThreshold = windowHeight * 0.3;

  // 滑动进度计算：
  // moveDistanceY > 0: 向上滑动，应该恢复到全屏状态（progress 应该减小）
  // moveDistanceY < 0: 向下滑动，应该收缩到小卡片（progress 应该增大）
  let progress: number;

  if (moveDistanceY <= 0) {
    // 向下滑动或没有滑动，计算正常的收缩进度
    const distance = Math.abs(moveDistanceY);
    const rawProgress = Math.min(Math.max(distance / slideThreshold, 0), 1);
    progress = Math.pow(rawProgress, 0.7); // 使用幂函数让初期变化更明显
  } else {
    // 向上滑动，应该从当前状态逐渐恢复到全屏状态
    // 获取当前元素的实际位置和尺寸
    const computedStyle = window.getComputedStyle(drawer);
    const currentTop = parseFloat(computedStyle.top) || 0;
    const currentLeft = parseFloat(computedStyle.left) || 0;
    const currentWidth = parseFloat(computedStyle.width) || windowWidth;
    const currentHeight = parseFloat(computedStyle.height) || windowHeight;

    // 计算当前状态相对于全屏状态的收缩进度 (0=全屏, 1=完全收缩)
    // 添加边界检查，防止除零错误
    const topProgress =
      elementRect.top > 0 ? Math.max(0, currentTop / elementRect.top) : 0;
    const leftProgress =
      elementRect.left > 0 ? Math.max(0, currentLeft / elementRect.left) : 0;
    const widthDiff = windowWidth - elementRect.width;
    const heightDiff = windowHeight - elementRect.height;
    const widthProgress =
      widthDiff > 0 ? Math.max(0, (windowWidth - currentWidth) / widthDiff) : 0;
    const heightProgress =
      heightDiff > 0
        ? Math.max(0, (windowHeight - currentHeight) / heightDiff)
        : 0;

    // 取最大值作为当前进度，使用最显著的变化维度
    const currentProgress = Math.max(
      0,
      Math.min(1, Math.max(topProgress, heightProgress)),
    );

    // 根据上滑距离减少进度，实现恢复效果
    const upwardReduction = (moveDistanceY / slideThreshold) * 1.5; // 上滑恢复的敏感度
    let newProgress = currentProgress - upwardReduction;

    // 当上滑超过初始位置时，添加阻尼效果，防止过度拉伸
    if (newProgress < 0) {
      // 使用阻尼函数，让超出范围的部分产生"橡皮筋"效果
      const overshoot = Math.abs(newProgress);
      const dampedOvershoot = overshoot * 0.3; // 阻尼系数，减少过冲距离
      newProgress = -dampedOvershoot;
    }

    progress = newProgress;
  }

  // 全屏状态的初始值
  const fullScreenState = {
    top: 0,
    left: 0,
    width: windowWidth,
    height: windowHeight,
    borderRadius: 0,
  };

  // 小卡片状态的目标值
  const miniCardState = {
    top: elementRect.top,
    left: elementRect.left,
    width: elementRect.width,
    height: elementRect.height,
    borderRadius: 1.5,
  };

  // 约束 progress 的范围，允许负值用于过冲效果，但限制过冲范围
  progress = Math.max(-0.2, Math.min(1, progress)); // 允许20%的负向过冲

  // 线性插值计算当前状态，支持负值进度的过冲效果
  const currentTop =
    fullScreenState.top + (miniCardState.top - fullScreenState.top) * progress;
  const currentLeft =
    fullScreenState.left +
    (miniCardState.left - fullScreenState.left) * progress;
  const currentWidth =
    fullScreenState.width +
    (miniCardState.width - fullScreenState.width) * progress;
  const currentHeight =
    fullScreenState.height +
    (miniCardState.height - fullScreenState.height) * progress;

  // 边框圆角的处理：当progress为负值时，保持0（全屏状态的圆角）
  const currentBorderRadius = Math.max(
    0,
    fullScreenState.borderRadius +
      (miniCardState.borderRadius - fullScreenState.borderRadius) * progress,
  );

  // 防止浮点数精度问题，对极小值进行修正
  const fixedTop =
    Math.abs(currentTop) < 0.01 ? 0 : Math.round(currentTop * 100) / 100;
  const fixedLeft =
    Math.abs(currentLeft) < 0.01 ? 0 : Math.round(currentLeft * 100) / 100;
  const fixedWidth = Math.round(currentWidth * 100) / 100;
  const fixedHeight = Math.round(currentHeight * 100) / 100;
  const fixedBorderRadius = Math.round(currentBorderRadius * 100) / 100;

  // 使用 setProperty 方法强制应用样式，绕过动画样式的优先级
  drawer.style.setProperty("transition", "none", "important");
  drawer.style.setProperty("top", fixedTop + "px", "important");
  drawer.style.setProperty("left", fixedLeft + "px", "important");
  drawer.style.setProperty("width", fixedWidth + "px", "important");
  drawer.style.setProperty("height", fixedHeight + "px", "important");
  drawer.style.setProperty(
    "border-radius",
    fixedBorderRadius + "rem",
    "important",
  );

  // 清理可能的 transform 样式
  drawer.style.setProperty("transform", "none", "important");

  // 处理过冲效果的边界约束
  if (fixedTop < 0) {
    // 负值表示向上过冲，保持在合理范围内
    const clampedTop = Math.max(fixedTop, -windowHeight * 0.05); // 最多向上过冲5%屏幕高度
    drawer.style.setProperty("top", clampedTop + "px", "important");
  }
  if (fixedLeft < 0) {
    const clampedLeft = Math.max(fixedLeft, -windowWidth * 0.05);
    drawer.style.setProperty("left", clampedLeft + "px", "important");
  }
  if (fixedWidth > windowWidth) {
    // 宽度过冲，最多超出10%
    const clampedWidth = Math.min(fixedWidth, windowWidth * 1.1);
    drawer.style.setProperty("width", clampedWidth + "px", "important");
  }
  if (fixedHeight > windowHeight) {
    // 高度过冲，最多超出10%
    const clampedHeight = Math.min(fixedHeight, windowHeight * 1.1);
    drawer.style.setProperty("height", clampedHeight + "px", "important");
  }
}

export function musicCardTransitionSlideEndDown(
  element: any,
  drawer: any,
  callback: () => void,
) {
  animationEndPlaying = true;

  // 取消之前的动画
  if (currentAnimation) {
    currentAnimation.cancel();
  }

  // 获取目标位置（迷你播放条）
  const elementRect = element.getBoundingClientRect();

  // 获取当前实际位置（从计算样式中获取，而不是getBoundingClientRect）
  const computedStyle = window.getComputedStyle(drawer);
  const currentTop = parseFloat(computedStyle.top) || 0;
  const currentLeft = parseFloat(computedStyle.left) || 0;
  const currentWidth = parseFloat(computedStyle.width) || window.innerWidth;
  const currentHeight = parseFloat(computedStyle.height) || window.innerHeight;

  // borderRadius 保持像素值，与其他属性保持一致
  const currentBorderRadiusPx = parseFloat(computedStyle.borderRadius) || 0;

  // 计算当前状态与目标状态的距离，用于调整动画速度
  const targetTop = elementRect.top;
  const targetLeft = elementRect.left;
  const targetWidth = elementRect.width;
  const targetHeight = elementRect.height;

  // 计算距离比例 (0-1)，0表示已经很接近目标，1表示距离很远
  const topDistance = Math.abs(currentTop - targetTop);
  const leftDistance = Math.abs(currentLeft - targetLeft);
  const widthDistance = Math.abs(currentWidth - targetWidth);
  const heightDistance = Math.abs(currentHeight - targetHeight);

  // 标准化距离计算
  const maxTopDistance = window.innerHeight;
  const maxLeftDistance = window.innerWidth;
  const maxWidthDistance = window.innerWidth;
  const maxHeightDistance = window.innerHeight;

  const normalizedDistances = [
    topDistance / maxTopDistance,
    leftDistance / maxLeftDistance,
    widthDistance / maxWidthDistance,
    heightDistance / maxHeightDistance,
  ];

  // 取最大的标准化距离作为总距离
  const totalDistance = Math.max(...normalizedDistances);

  // 根据距离调整动画时长：距离越近，动画越快
  const minDuration = ANIMATION_DURATION * 0.3; // 最快300ms内完成
  const maxDuration = ANIMATION_DURATION; // 最慢400ms
  const adjustedDuration =
    minDuration + (maxDuration - minDuration) * totalDistance;

  // 智能生成关键帧：去除可能导致弹跳的中间状态
  const keyframes = [];

  // 起始状态
  keyframes.push({
    top: currentTop + "px",
    left: currentLeft + "px",
    width: currentWidth + "px",
    height: currentHeight + "px",
    borderRadius: currentBorderRadiusPx + "px",
    transform: "scale(1)",
    opacity: "1",
    offset: 0,
  });

  // 只有当距离足够大时才添加中间状态，避免小距离时的弹跳
  if (totalDistance > 0.3) {
    // 中间状态：平滑过渡，不超越目标
    const midTop = currentTop + (targetTop - currentTop) * 0.7;
    const midLeft = currentLeft + (targetLeft - currentLeft) * 0.7;
    const midWidth = currentWidth + (targetWidth - currentWidth) * 0.7;
    const midHeight = currentHeight + (targetHeight - currentHeight) * 0.7;

    keyframes.push({
      top: midTop + "px",
      left: midLeft + "px",
      width: midWidth + "px",
      height: midHeight + "px",
      borderRadius: "20px",
      transform: "scale(1)",
      opacity: "1",
      offset: 0.7,
    });
  }

  // 最终状态
  keyframes.push({
    top: targetTop + "px",
    left: targetLeft + "px",
    width: targetWidth + "px",
    height: targetHeight + "px",
    borderRadius: "24px", // 1.5rem ≈ 24px
    transform: "scale(1)",
    opacity: "1",
    offset: 1,
  });

  // 根据距离选择合适的缓动曲线
  let selectedEasing;
  if (totalDistance > 0.6) {
    // 距离远：使用更强的缓动
    selectedEasing = EASING_CURVES.collapse;
  } else if (totalDistance > 0.3) {
    // 距离中等：使用平滑缓动
    selectedEasing = EASING_CURVES.smooth;
  } else {
    // 距离近：使用快速收缩
    selectedEasing = EASING_CURVES.quickSnap;
  }

  // 动画选项
  const animationOptions: KeyframeAnimationOptions = {
    duration: adjustedDuration,
    easing: selectedEasing,
    fill: "forwards",
  };

  // 清理强制样式，让动画能够正常接管
  cancelImportantStyles(drawer);

  // 执行收缩动画
  currentAnimation = drawer.animate(keyframes, animationOptions);

  // 同步更新CSS类
  drawer.classList.remove("transition-open");
  drawer.classList.add("transition-close");

  // 动画完成回调
  currentAnimation?.addEventListener("finish", () => {
    element.style.opacity = "1";

    // 重置为初始样式
    setInitStyles(drawer);

    // 清理所有动画
    cancelAllAnimations(drawer);

    animationEndPlaying = false;
    currentAnimation = null;
    callback();
  });

  // 错误处理
  currentAnimation?.addEventListener("cancel", () => {
    animationEndPlaying = false;
    currentAnimation = null;
  });
}

export function musicCardTransitionSlideCancelDown(element: any, drawer: any) {
  // 取消当前动画
  if (currentAnimation) {
    currentAnimation.cancel();
  }

  // 窗口大小
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  // 获取当前实际位置（从计算样式中获取）
  const computedStyle = window.getComputedStyle(drawer);
  const currentTop = parseFloat(computedStyle.top) || 0;
  const currentLeft = parseFloat(computedStyle.left) || 0;
  const currentWidth = parseFloat(computedStyle.width) || window.innerWidth;
  const currentHeight = parseFloat(computedStyle.height) || window.innerHeight;
  const currentBorderRadiusPx = parseFloat(computedStyle.borderRadius) || 0;

  // 计算当前状态与全屏状态的距离，用于调整恢复动画
  const targetTop = 0;
  const targetLeft = 0;
  const targetWidth = windowWidth;
  const targetHeight = windowHeight;

  // 计算距离比例
  const topDistance = Math.abs(currentTop - targetTop);
  const leftDistance = Math.abs(currentLeft - targetLeft);
  const widthDistance = Math.abs(currentWidth - targetWidth);
  const heightDistance = Math.abs(currentHeight - targetHeight);

  const normalizedDistances = [
    topDistance / windowHeight,
    leftDistance / windowWidth,
    widthDistance / windowWidth,
    heightDistance / windowHeight,
  ];

  const totalDistance = Math.max(...normalizedDistances);

  // 根据距离调整动画时长：距离越近，恢复越快
  const minDuration = ANIMATION_DURATION * 0.4; // 最快160ms
  const maxDuration = ANIMATION_DURATION * 0.8; // 最慢320ms
  const adjustedDuration =
    minDuration + (maxDuration - minDuration) * totalDistance;

  // 智能生成恢复关键帧
  const keyframes = [];

  // 起始状态
  keyframes.push({
    top: currentTop + "px",
    left: currentLeft + "px",
    width: currentWidth + "px",
    height: currentHeight + "px",
    borderRadius: currentBorderRadiusPx + "px",
    transform: "scale(1)",
    offset: 0,
  });

  // 只有当距离足够大时才添加弹性中间状态
  if (totalDistance > 0.4) {
    keyframes.push({
      top: windowHeight * 0.02 + "px",
      left: windowWidth * 0.02 + "px",
      width: windowWidth * 0.96 + "px",
      height: windowHeight * 0.96 + "px",
      borderRadius: "4px",
      transform: "scale(1.01)",
      offset: 0.6,
    });
  }

  // 最终全屏状态
  keyframes.push({
    top: "0px",
    left: "0px",
    width: windowWidth + "px",
    height: windowHeight + "px",
    borderRadius: "0px",
    transform: "scale(1)",
    offset: 1,
  });

  // 根据距离选择合适的缓动曲线
  let selectedEasing;
  if (totalDistance > 0.6) {
    // 距离远：使用弹性效果
    selectedEasing = EASING_CURVES.elastic;
  } else if (totalDistance > 0.3) {
    // 距离中等：使用平滑缓动
    selectedEasing = EASING_CURVES.expand;
  } else {
    // 距离近：使用快速恢复
    selectedEasing = EASING_CURVES.fastRecover;
  }

  // 动画选项
  const animationOptions: KeyframeAnimationOptions = {
    duration: adjustedDuration,
    easing: selectedEasing,
    fill: "forwards",
  };

  // 清理强制样式，让动画能够正常接管
  cancelImportantStyles(drawer);

  // 执行恢复动画
  currentAnimation = drawer.animate(keyframes, animationOptions);

  // 动画完成回调
  currentAnimation?.addEventListener("finish", () => {
    // 清理所有动画
    cancelAllAnimations(drawer);

    // 设置最终状态
    drawer.style.width = "100%";
    drawer.style.height = "100%";
    drawer.style.top = "0px";
    drawer.style.left = "0px";
    drawer.style.transform = "";
    currentAnimation = null;
  });

  // 错误处理
  currentAnimation?.addEventListener("cancel", () => {
    currentAnimation = null;
  });
}

// 工具函数：初始化音乐抽屉样式
export function initMusicDrawer() {
  const drawer = document.getElementById("zy-music-drawer");
  if (drawer) {
    setInitStyles(drawer);
  }
}

// 工具函数：清理所有动画
export function cleanupAnimations() {
  if (currentAnimation) {
    currentAnimation.cancel();
    currentAnimation = null;
  }
  animationEndPlaying = false;
  const drawer = document.getElementById("zy-music-drawer");
  if (drawer) {
    cancelAllAnimations(drawer);
  }
}

// 工具函数：检查动画是否正在进行
export function isAnimating(): boolean {
  return currentAnimation !== null || animationEndPlaying;
}
