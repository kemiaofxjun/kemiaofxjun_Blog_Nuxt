/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;

// 导入 Workbox 模块
import { clientsClaim } from 'workbox-core';
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

// 定义需要缓存的外部资源的域名（或其他模式）
const EXTERNAL_RESOURCES: string[] = [
  'https://sourceimage.s3.bitiful.net',
  'https://gcore.jsdelivr.net'
];

// 自定义缓存名称
const EXTERNAL_CACHE_NAME = 'external-resources-permanent';
const PERMANENT_REQUEST_TRACKER = 'permanent-requests';
const OFFLINE_PAGE = '/offline.html';

// --- Workbox 功能设置 ---

// 1. 预缓存重要资源 - 确保根路径 '/' 被缓存
precacheAndRoute([
  // 显式添加根路径到预缓存
  { url: '/', revision: 'v1' },
  { url: '/index.html', revision: 'v1' },
  // 添加离线页面
  { url: OFFLINE_PAGE, revision: 'v1' },
  // 自动包含 self.__WB_MANIFEST
  ...self.__WB_MANIFEST
]);

// 2. 清理旧缓存
cleanupOutdatedCaches();

// 3. 跳过等待阶段，立即激活新 Service Worker
self.skipWaiting();
clientsClaim();

// --- 永久缓存请求跟踪器 ---

// 标记请求为"永久缓存"状态
async function markRequestAsPermanent(url: string): Promise<void> {
  const cache = await caches.open(PERMANENT_REQUEST_TRACKER);
  await cache.put(url, new Response('permanent'));
}

// 检查请求是否为永久缓存
async function isPermanentRequest(url: string): Promise<boolean> {
  const cache = await caches.open(PERMANENT_REQUEST_TRACKER);
  const response = await cache.match(url);
  return !!response;
}

// --- 处理外部资源请求 ---

// 处理永久缓存请求策略
async function handlePermanentCacheStrategy(request: Request, event: ExtendableEvent): Promise<Response> {
  const url = request.url;
  const cache = await caches.open(EXTERNAL_CACHE_NAME);
  
  // 如果已经标记为永久请求，直接返回缓存
  if (await isPermanentRequest(url)) {
    const cachedResponse = await cache.match(request);
    return cachedResponse || new Response('Resource not found', { status: 404 });
  }
  
  try {
    // 配置跨域请求选项
    const fetchOptions: RequestInit = {
      method: request.method,
      headers: request.headers,
      mode: 'cors',
      credentials: 'omit',
      cache: 'no-cache'
    };
    
    // 发起网络请求
    const fetchResponse = await fetch(request, fetchOptions);
    
    // 只缓存成功的响应
    if (fetchResponse.ok) {
      // 克隆响应以便缓存和使用
      const responseToCache = fetchResponse.clone();
      
      // 标记该请求为永久缓存
      event.waitUntil(markRequestAsPermanent(url));
      
      // 异步缓存响应（不阻塞返回）
      event.waitUntil(cache.put(request, responseToCache));
      
      return fetchResponse;
    }
    
    // 对于不成功的响应，尝试使用可能的旧缓存（如果有）
    const staleResponse = await cache.match(request);
    if (staleResponse) {
      // 标记使用旧的缓存资源
      event.waitUntil(markRequestAsPermanent(url));
      return staleResponse;
    }
    
    throw new Error('Fetch failed and no stale cache available');
    
  } catch (error) {
    console.error('Fetch failed for external resource:', url, error);
    
    // 最终的备选方案 - 提供友好的错误消息
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Service Unavailable</title>
          <style>
            body { 
              font-family: system-ui, sans-serif; 
              padding: 2rem; 
              text-align: center;
              background: #f8f9fa;
            }
            .error-container {
              max-width: 600px;
              margin: 5rem auto;
              padding: 2rem;
              background: white;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            h1 { color: #dc3545; }
            p { line-height: 1.6; }
          </style>
        </head>
        <body>
          <div class="error-container">
            <h1>Service Unavailable</h1>
            <p>The resource you requested is not available offline and cannot be reached at this time.</p>
            <p>Please check your internet connection and try again later.</p>
          </div>
        </body>
      </html>
    `, {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// --- 自定义导航处理 ---
async function handleNavigationRequest(url: URL, event: FetchEvent): Promise<Response> {
  // 尝试从缓存中获取页面
  try {
    const cachedPage = await caches.match(url.pathname);
    if (cachedPage) {
      return cachedPage;
    }
    
    // 对于根路径 '/' 的特别处理
    if (url.pathname === '/') {
      const rootPage = await caches.match('/index.html');
      if (rootPage) {
        return rootPage;
      }
    }
  } catch (error) {
    console.warn('Navigation cache match failed:', error);
  }
  
  try {
    // 尝试从网络获取
    return await fetch(event.request);
  } catch (error) {
    // 如果网络也失败，返回离线页面
    return caches.match(OFFLINE_PAGE) || new Response('Offline', {
      status: 200,
      statusText: 'Offline',
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// --- 所有 fetch 事件的主处理程序 ---
self.addEventListener('fetch', (event: FetchEvent) => {
  const url = new URL(event.request.url);
  
  // 1. 处理导航请求
  if (event.request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(url, event));
    return;
  }
  
  // 2. 处理外部资源请求
  const isExternal = EXTERNAL_RESOURCES.some(domain => 
    url.href.startsWith(domain) || 
    url.hostname.endsWith(`.${domain}`)
  );
  
  if (isExternal) {
    event.respondWith(handlePermanentCacheStrategy(event.request, event));
    return;
  }
  
  // 3. 其他静态资源使用 StaleWhileRevalidate 策略
  if (['script', 'style', 'image', 'font'].includes(event.request.destination)) {
    event.respondWith(
      new StaleWhileRevalidate({
        cacheName: 'static-assets'
      }).handle({ event })
    );
    return;
  }
  
  // 4. 其他请求默认行为
});

// --- 激活阶段清理旧缓存 ---
self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(name => !name.startsWith('workbox-precache') &&
                         name !== EXTERNAL_CACHE_NAME && 
                         name !== PERMANENT_REQUEST_TRACKER)
          .map(name => caches.delete(name))
      );
    })
  );
});

// --- Service Worker 安装处理 ---
self.addEventListener('install', (event: ExtendableEvent) => {
  // 预先缓存离线页面
  event.waitUntil(
    caches.open('core-cache').then(cache => {
      return cache.addAll([OFFLINE_PAGE, '/', '/index.html']);
    })
  );
  
  // 提示用户 Service Worker 已安装
  event.waitUntil(
    (async () => {
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach(client => {
        client.postMessage({
          type: 'SW_STATUS',
          message: 'Service Worker installed. External resources will be cached permanently after first request.'
        });
      });
    })()
  );
});

// --- 消息处理机制 ---
self.addEventListener('message', (event: ExtendableMessageEvent) => {
  if (event.data && event.data.type === 'CLEAR_PERMANENT_CACHE') {
    event.waitUntil(
      (async () => {
        await caches.delete(EXTERNAL_CACHE_NAME);
        await caches.delete(PERMANENT_REQUEST_TRACKER);
        if (event.source) {
          event.source.postMessage({ type: 'CACHE_CLEARED' });
        }
      })()
    );
  }
  
  // 处理更新跳过等待
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// --- 周期性缓存更新 ---
self.addEventListener('periodicsync', (event: Event) => {
  if (event.tag === 'update-external-cache') {
    console.log('Updating external caches');
    // 这里可以添加缓存更新逻辑
  }
});