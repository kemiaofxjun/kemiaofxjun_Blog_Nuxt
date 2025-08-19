// Canvas音乐播放器动画系统
// 提取所有动画相关的逻辑，保持组件文件简洁

import { nextTick } from "vue";
import type { Ref } from "vue";

// 卡片状态接口
export interface CardState {
  x: number;
  y: number;
  width: number;
  height: number;
  borderRadius: number;
  opacity: number;
  blur: number; // 新增：模糊半径
}

export const blurMap = {
  closed: 50, // 收起状态的模糊值
  opened: 200, // 展开状态的模糊值
};

// 线性插值函数
export const lerp = (start: number, end: number, t: number): number => {
  return start + (end - start) * t;
};

// 三次贝塞尔曲线实现
const cubicBezier = (x1: number, y1: number, x2: number, y2: number) => {
  return (t: number): number => {
    // 简化的三次贝塞尔曲线近似实现
    const cx = 3 * x1;
    const bx = 3 * (x2 - x1) - cx;
    const ax = 1 - cx - bx;
    const cy = 3 * y1;
    const by = 3 * (y2 - y1) - cy;
    const ay = 1 - cy - by;

    const sampleCurveX = (t: number) => ((ax * t + bx) * t + cx) * t;
    const sampleCurveY = (t: number) => ((ay * t + by) * t + cy) * t;

    // 二分法求解 x 对应的 t 值
    let t0 = 0;
    let t1 = 1;
    let t2 = t;

    for (let i = 0; i < 8; i++) {
      const x2_val = sampleCurveX(t2) - t;
      if (Math.abs(x2_val) < 0.000001) break;

      const d2 = (3 * ax * t2 + 2 * bx) * t2 + cx;
      if (Math.abs(d2) < 0.000001) break;

      t2 -= x2_val / d2;
    }

    return sampleCurveY(t2);
  };
};

// 缓动函数
export const easeCollapse = cubicBezier(0.55, 0.055, 0.675, 0.19); // 收缩动画
export const easeExpand = cubicBezier(0.25, 0.46, 0.45, 0.94); // 展开动画
export const easeSmooth = cubicBezier(0.165, 0.84, 0.44, 1); // 平滑过渡
export const easeQuickSnap = cubicBezier(0.25, 0.1, 0.25, 1); // 快速收缩

// 动画回调接口
export interface AnimationCallbacks {
  onTransitionStart?: () => void;
  onTransitionEnd?: () => void;
  onProgressUpdate?: (progress: number) => void;
}

// 动画管理器类
export class AnimationManager {
  private isAnimating = false;
  private currentCardState: Ref<CardState>;
  private isExpanded: Ref<boolean>;
  private asideRef: Ref<HTMLElement | undefined>;
  private dragStartAsideRect: Ref<DOMRect | null>;
  private resizeCanvas: () => void;
  private initMiniBarState: () => void;
  private callbacks: AnimationCallbacks;

  constructor(
    currentCardState: Ref<CardState>,
    isExpanded: Ref<boolean>,
    asideRef: Ref<HTMLElement | undefined>,
    dragStartAsideRect: Ref<DOMRect | null>,
    resizeCanvas: () => void,
    initMiniBarState: () => void,
    callbacks: AnimationCallbacks = {},
  ) {
    this.currentCardState = currentCardState;
    this.isExpanded = isExpanded;
    this.asideRef = asideRef;
    this.dragStartAsideRect = dragStartAsideRect;
    this.resizeCanvas = resizeCanvas;
    this.initMiniBarState = initMiniBarState;
    this.callbacks = callbacks;
  }

  // 检查是否正在动画
  isAnimationRunning(): boolean {
    return this.isAnimating;
  }

  // 展开卡片动画
  expandCard(): void {
    if (this.isAnimating || !this.asideRef.value) return;

    this.isAnimating = true;
    this.callbacks.onTransitionStart?.();

    // 关键修复：在状态切换前完成所有计算
    const asideRect = this.asideRef.value.getBoundingClientRect();
    const startState = { ...this.currentCardState.value };
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // 预先计算转换后的起点坐标
    const adjustedStartState: CardState = {
      x: asideRect.left,
      y: asideRect.top,
      width: startState.width,
      height: startState.height,
      borderRadius: startState.borderRadius,
      opacity: startState.opacity,
      blur: blurMap.closed, // 收起状态的模糊值
    };

    const endState: CardState = {
      x: 0,
      y: 0,
      width: windowWidth,
      height: windowHeight,
      borderRadius: 0,
      opacity: 1,
      blur: blurMap.opened, // 展开状态的模糊值
    };

    // 先设置正确的起始状态，避免闪动
    this.currentCardState.value = adjustedStartState;

    // 然后切换为展开状态并调整Canvas
    this.isExpanded.value = true;

    // 立即调整Canvas容器到全屏
    nextTick(() => {
      this.resizeCanvas();

      // 开始动画
      const duration = 400; // 400ms
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // 使用原版HTML的展开缓动曲线
        const easeProgress = easeExpand(progress);

        // 回调进度更新
        this.callbacks.onProgressUpdate?.(progress);

        // 插值计算当前状态
        this.currentCardState.value = {
          x: lerp(adjustedStartState.x, endState.x, easeProgress),
          y: lerp(adjustedStartState.y, endState.y, easeProgress),
          width: lerp(adjustedStartState.width, endState.width, easeProgress),
          height: lerp(
            adjustedStartState.height,
            endState.height,
            easeProgress,
          ),
          borderRadius: lerp(
            adjustedStartState.borderRadius,
            endState.borderRadius,
            easeProgress,
          ),
          opacity: lerp(
            adjustedStartState.opacity,
            endState.opacity,
            easeProgress,
          ),
          blur: lerp(adjustedStartState.blur, endState.blur, easeProgress),
        };

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          this.isAnimating = false;
          this.callbacks.onTransitionEnd?.();
        }
      };

      requestAnimationFrame(animate);
    });
  }

  // 从当前状态展开到全屏 - 用于拖拽回弹
  expandFromCurrentState(): void {
    if (this.isAnimating) return;

    this.isAnimating = true;
    this.callbacks.onTransitionStart?.();

    // 当前状态就是起点，不需要坐标转换
    const startState = { ...this.currentCardState.value };

    // 目标状态：全屏
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const endState: CardState = {
      x: 0,
      y: 0,
      width: windowWidth,
      height: windowHeight,
      borderRadius: 0,
      opacity: 1,
      blur: blurMap.opened, // 展开状态的模糊值
    };

    // 计算距离，用于调整动画时长
    const topDistance = Math.abs(startState.y - endState.y);
    const leftDistance = Math.abs(startState.x - endState.x);
    const widthDistance = Math.abs(startState.width - endState.width);
    const heightDistance = Math.abs(startState.height - endState.height);

    const normalizedDistances = [
      topDistance / windowHeight,
      leftDistance / windowWidth,
      widthDistance / windowWidth,
      heightDistance / windowHeight,
    ];

    const totalDistance = Math.max(...normalizedDistances);

    // 回弹动画通常比较快
    const baseDuration = 300; // 基础时长300ms
    const minDuration = baseDuration * 0.4; // 最快120ms
    const maxDuration = baseDuration; // 最慢300ms
    const adjustedDuration =
      minDuration + (maxDuration - minDuration) * totalDistance;

    // 选择合适的缓动曲线 - 回弹使用弹性效果
    let selectedEasing;
    if (totalDistance > 0.3) {
      selectedEasing = easeExpand; // 距离远用展开曲线
    } else {
      selectedEasing = easeSmooth; // 距离近用平滑曲线
    }

    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / adjustedDuration, 1);

      const easeProgress = selectedEasing(progress);

      // 回调进度更新
      this.callbacks.onProgressUpdate?.(progress);

      this.currentCardState.value = {
        x: lerp(startState.x, endState.x, easeProgress),
        y: lerp(startState.y, endState.y, easeProgress),
        width: lerp(startState.width, endState.width, easeProgress),
        height: lerp(startState.height, endState.height, easeProgress),
        borderRadius: lerp(
          startState.borderRadius,
          endState.borderRadius,
          easeProgress,
        ),
        opacity: lerp(startState.opacity, endState.opacity, easeProgress),
        blur: lerp(startState.blur, endState.blur, easeProgress),
      };

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.isAnimating = false;
        // 回弹完成后清理记住的位置
        this.dragStartAsideRect.value = null;
        this.callbacks.onTransitionEnd?.();
      }
    };

    requestAnimationFrame(animate);
  }

  // 收缩卡片动画
  collapseCard(): void {
    if (this.isAnimating || !this.asideRef.value) return;

    this.isAnimating = true;
    this.callbacks.onTransitionStart?.();

    const startState = { ...this.currentCardState.value };

    // 获取目标aside的位置，这是收缩动画的终点参考
    const asideRect = this.asideRef.value.getBoundingClientRect();

    // 使用窗口的真实尺寸
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // 计算收缩目标状态（在全屏坐标系中）
    const endState: CardState = {
      x: asideRect.left,
      y: asideRect.top,
      width: asideRect.width,
      height: asideRect.height,
      borderRadius: 24,
      opacity: 1,
      blur: blurMap.closed, // 收起状态的模糊值
    };

    // 计算当前状态与目标状态的距离，用于调整动画速度
    const topDistance = Math.abs(startState.y - endState.y);
    const leftDistance = Math.abs(startState.x - endState.x);
    const widthDistance = Math.abs(startState.width - endState.width);
    const heightDistance = Math.abs(startState.height - endState.height);

    // 标准化距离计算
    const normalizedDistances = [
      topDistance / windowHeight,
      leftDistance / windowWidth,
      widthDistance / windowWidth,
      heightDistance / windowHeight,
    ];

    // 取最大的标准化距离作为总距离
    const totalDistance = Math.max(...normalizedDistances);

    // 根据距离调整动画时长：距离越近，动画越快（参考原版逻辑）
    const baseDuration = 400; // 基础动画时长
    const minDuration = baseDuration * 0.3; // 最快120ms
    const maxDuration = baseDuration; // 最慢400ms
    const adjustedDuration =
      minDuration + (maxDuration - minDuration) * totalDistance;

    // 根据距离选择合适的缓动曲线（参考原版逻辑）
    let selectedEasing;
    if (totalDistance > 0.6) {
      // 距离远：使用更强的缓动
      selectedEasing = easeCollapse;
    } else if (totalDistance > 0.3) {
      // 距离中等：使用平滑缓动
      selectedEasing = easeSmooth;
    } else {
      // 距离近：使用快速收缩
      selectedEasing = easeQuickSnap;
    }

    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / adjustedDuration, 1);

      // 使用选择的缓动函数
      const easeProgress = selectedEasing(progress);

      // 回调进度更新（收缩时进度是反向的）
      this.callbacks.onProgressUpdate?.(1 - progress);

      this.currentCardState.value = {
        x: lerp(startState.x, endState.x, easeProgress),
        y: lerp(startState.y, endState.y, easeProgress),
        width: lerp(startState.width, endState.width, easeProgress),
        height: lerp(startState.height, endState.height, easeProgress),
        borderRadius: lerp(
          startState.borderRadius,
          endState.borderRadius,
          easeProgress,
        ),
        opacity: lerp(startState.opacity, endState.opacity, easeProgress),
        blur: lerp(startState.blur, endState.blur, easeProgress),
      };

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.isAnimating = false;

        // 动画结束后，切换回aside模式并调整Canvas尺寸和状态
        this.isExpanded.value = false;

        // 添加一个极小的延迟，让最后一帧完全渲染后再切换状态
        setTimeout(() => {
          nextTick(() => {
            this.resizeCanvas();
            // 重新初始化minibar状态，现在基于aside坐标系
            this.initMiniBarState();
            this.callbacks.onTransitionEnd?.();
          });
        }, 16); // 一帧的时间（约16ms）
      }
    };

    requestAnimationFrame(animate);
  }

  // 根据拖拽距离更新卡片状态
  updateCardStateForDrag(deltaY: number): void {
    if (!this.dragStartAsideRect.value) return;

    // 使用窗口的真实尺寸（展开状态下的拖拽）
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // 计算拖拽进度 (0-1)
    const maxDrag = windowHeight * 0.5; // 最大拖拽距离为屏幕高度的50%
    const progress = Math.min(deltaY / maxDrag, 1);

    // 从全屏状态插值到迷你状态
    const fullScreenState: CardState = {
      x: 0,
      y: 0,
      width: windowWidth,
      height: windowHeight,
      borderRadius: 0,
      opacity: 1,
      blur: blurMap.opened, // 展开状态的模糊值
    };

    // 使用拖拽开始时记住的aside位置
    const asideRect = this.dragStartAsideRect.value;

    // 拖拽目标应该是aside在全屏坐标系中的位置
    const miniState: CardState = {
      x: asideRect.left, // aside在视口中的left位置
      y: asideRect.top, // aside在视口中的top位置
      width: asideRect.width,
      height: asideRect.height,
      borderRadius: 24,
      opacity: 1,
      blur: blurMap.closed, // 收起状态的模糊值
    };

    // 应用缓动函数让拖拽感觉更自然（使用平滑过渡曲线）
    const easeProgress = easeSmooth(progress);

    // 回调进度更新（拖拽时的进度）
    this.callbacks.onProgressUpdate?.(1 - progress);

    this.currentCardState.value = {
      x: lerp(fullScreenState.x, miniState.x, easeProgress),
      y: lerp(fullScreenState.y, miniState.y, easeProgress),
      width: lerp(fullScreenState.width, miniState.width, easeProgress),
      height: lerp(fullScreenState.height, miniState.height, easeProgress),
      borderRadius: lerp(
        fullScreenState.borderRadius,
        miniState.borderRadius,
        easeProgress,
      ),
      opacity: lerp(fullScreenState.opacity, miniState.opacity, easeProgress),
      blur: lerp(fullScreenState.blur, miniState.blur, easeProgress),
    };
  }
}
