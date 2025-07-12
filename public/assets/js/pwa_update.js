// plugins/pwa.client.ts
export default defineNuxtPlugin(() => {
  const workbox = window.$workbox
  
  if (!workbox) return
  
  // 监听安装完成事件
  workbox.addEventListener('installed', (event) => {
    if (!event.isUpdate) {
      console.log('Service Worker首次安装成功!')
    }
  })
  
  // 监听更新事件
  workbox.addEventListener('waiting', () => {
    // 显示更新通知
    if (confirm('网站有新版本可用，是否立即更新？')) {
      workbox.addEventListener('controlling', () => {
        window.location.reload()
      })
      
      workbox.messageSkipWaiting()
    }
  })
  
  // 监听控制器变更事件
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('Service Worker控制器已变更，页面将刷新')
    window.location.reload()
  })
})