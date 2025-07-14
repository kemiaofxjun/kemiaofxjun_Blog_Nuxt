<script>
export default {
  name: 'ServiceWorkerRegistration',
  mounted() {
    // 确保在客户端环境执行（避免 SSR 场景下访问 navigator）
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // 监听页面完全加载事件
      window.addEventListener('load', () => {
        // 注册 Service Worker
        navigator.serviceWorker.register('/service_worker.js')
          .then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
          })
          .catch(error => {
            console.error('Service Worker registration failed:', error);
          });
      });
    }
  }
};
</script>

<template>
    <NuxtLoadingIndicator />
    <SkipToContent />
    <ZSidebar />
    <div id="content">
        <main id="main-content">
            <NuxtPage />
            <ZFooter />
        </main>
        <ZAside />
    </div>
    <ZPanel />
    <ZPopover />
</template>

<!-- eslint-disable-next-line vue/enforce-style-attribute -->
<style lang="scss">
// Nuxt 根元素 id
#z-root {
    display: flex;
    justify-content: center;
    gap: 1rem;
    min-width: 0;
}

// 合并处理 #z-sidebar, #z-aside
aside {
    flex-shrink: 0;
    position: sticky;
    top: 0;
    width: 280px;
    height: 100vh;
    height: 100dvh;
    scrollbar-width: thin;

    @media (max-width: $breakpoint-widescreen) {
        flex-shrink: 0.2;
    }
}

#content {
    display: flex;
    gap: 1rem;

    // 若设置的是 max-width，则内部 main 宽度为 fit-content，可能无法撑满
    // 此时即使设置 flex-grow，也会影响 #sidebar 无法正确 shrink
    width: $breakpoint-widescreen;
    min-width: 0; // 解决父级 flexbox 设置 justify-content: center 时溢出左侧消失的问题

    // 此处不建议给内容设置 padding
    > main {
        flex-grow: 1; // 使较小宽度的内容占满

        // overflow: hidden; // 会使一部分元素吸顶失效

        // 使内容正确计算宽度而不横向溢出
        // 也可设置 width: 0 或者 contain: inline-size（兼容性不佳）
        min-width: 0;
    }
}
</style>
