/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;

// 导入 Workbox 模块
import { clientsClaim } from 'workbox-core';
import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';

// 定义需要缓存的外部资源的域名（或其他模式）
const EXTERNAL_RESOURCES: string[] = [
  'https://sourceimage.s3.bitiful.net',
  'https://gcore.jsdelivr.net'
];

// 自定义缓存名称
const EXTERNAL_CACHE_NAME = 'external-resources-permanent';
const PERMANENT_REQUEST_TRACKER = 'permanent-requests';

// --- Workbox 功能设置 ---

// 1. 跳过等待阶段，立即激活新 Service Worker
self.skipWaiting();
clientsClaim();

// 2. 预缓存和路由设置
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// 3. 处理导航请求（单页应用支持）
try {
  const handler = createHandlerBoundToURL('/');
  const route = new NavigationRoute(handler);
  registerRoute(route);
} catch (error) {
  console.warn('Error while registering cache route', { error });
}

// 4. 激活阶段清理旧缓存（保留永久缓存）
self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(name => name !== EXTERNAL_CACHE_NAME && name !== PERMANENT_REQUEST_TRACKER)
          .map(name => caches.delete(name))
      );
    })
  );
});

// --- 永久缓存请求跟踪器 ---

// /​**​
//  * 标记请求为"永久缓存"状态
//  */
async function markRequestAsPermanent(url: string): Promise<void> {
  const cache = await caches.open(PERMANENT_REQUEST_TRACKER);
  await cache.put(url, new Response('permanent'));
}

// /​**​
//  * 检查请求是否为永久缓存
//  */
async function isPermanentRequest(url: string): Promise<boolean> {
  const cache = await caches.open(PERMANENT_REQUEST_TRACKER);
  const response = await cache.match(url);
  return !!response;
}

// --- 处理外部资源请求 ---

// /​**​
//  * 处理永久缓存请求策略
//  */
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
    `, {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// --- 所有 fetch 事件的主处理程序 ---
self.addEventListener('fetch', (event: FetchEvent) => {
  const url = new URL(event.request.url);
  
  // 检查是否为外部资源请求
  const isExternal = EXTERNAL_RESOURCES.some(domain => 
    url.href.startsWith(domain) || 
    url.hostname.endsWith(`.${domain}`)
  );
  
  // 处理页面导航请求（由 Workbox 处理）
  if (url.origin === self.location.origin && event.request.mode === 'navigate') {
    return;
  }
  
  // 处理外部资源请求 - 使用永久缓存策略
  if (isExternal) {
    event.respondWith(handlePermanentCacheStrategy(event.request, event));
    return;
  }
  
  // 2. 其他静态资源使用Workbox策略
  // 这里可以添加其他资源处理逻辑...
});

// 5. 在Service Worker安装时提供用户提示
self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    (async () => {
      // 提示用户Service Worker已安装
      const clients = await self.clients.matchAll({ type: 'window' });
      if (clients && clients.length) {
        clients.forEach(client => {
          client.postMessage({
            type: 'SW_STATUS',
            message: 'Service Worker installed. External resources will be cached permanently after first request.'
          });
        });
      }
    })()
  );
});

// 6. 提供消息处理机制（前端可通过此触发缓存清理）
self.addEventListener('message', (event: ExtendableMessageEvent) => {
  if (event.data && event.data.type === 'CLEAR_PERMANENT_CACHE') {
    caches.delete(EXTERNAL_CACHE_NAME);
    caches.delete(PERMANENT_REQUEST_TRACKER);
    event.source?.postMessage({ type: 'CACHE_CLEARED' });
  }
});