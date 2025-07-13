/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;

import { clientsClaim } from 'workbox-core';
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

// 1. 定义外部资源域名 - 替换为实际域名
const EXTERNAL_RESOURCES: string[] = [
  'https://sourceimage.s3.bitiful.net',
  'https://gcore.jsdelivr.net'
];

// 2. 定义缓存名称
const EXTERNAL_CACHE_NAME = 'external-resources-permanent';
const PERMANENT_REQUEST_TRACKER = 'permanent-requests';
const OFFLINE_PAGE = '/offline.html'; // 确保此文件存在于 public 目录

// 3. 显式定义要预缓存的核心资源
const PRECACHE_RESOURCES = [
  // 使用绝对URL确保路径正确
  { url: '/', revision: 'v1' },
  { url: OFFLINE_PAGE, revision: 'v1' },
  { url: '/manifest.json', revision: 'v1' },
  { url: '/favicon.ico', revision: 'v1' },
  
  // 添加其他关键静态资源
  ...(self.__WB_MANIFEST || [])
];

// 4. 自定义缓存方法代替 cache.addAll
async function safePrecache() {
  const cache = await caches.open('core-cache');
  const results = [];
  
  for (const resource of PRECACHE_RESOURCES) {
    try {
      // 确保URL格式正确
      const url = new URL(resource.url, self.location.origin).href;
      
      // 使用fetch + cache.put代替addAll
      const response = await fetch(url, {
        method: 'GET',
        cache: 'no-store',
        credentials: 'same-origin'
      });
      
      if (response.ok) {
        await cache.put(url, response.clone());
        results.push({ url, status: 'success' });
      } else {
        console.warn(`Precache failed for ${url}: Status ${response.status}`);
        results.push({ url, status: 'failed', reason: `HTTP ${response.status}` });
      }
    } catch (error) {
      console.error(`Precache error for ${resource.url}:`, error);
      results.push({ url: resource.url, status: 'failed', reason: error.message });
    }
  }
  
  return results;
}

// 5. 主安装流程
self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    (async () => {
      // 安全预缓存
      const precacheResults = await safePrecache();
      console.log('Precache results:', precacheResults);
      
      // 预缓存通过workbox管理（只缓存确认存在的资源）
      const manifestToCache = PRECACHE_RESOURCES
        .filter(res => precacheResults.some(r => r.url === res.url && r.status === 'success'));
      
      if (manifestToCache.length > 0) {
        precacheAndRoute(manifestToCache);
      }
      
      // 通知客户端
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach(client => {
        client.postMessage({
          type: 'SW_STATUS',
          message: 'Service Worker installed. Cached resources: ' + 
                   PRECACHE_RESOURCES.length
        });
      });
    })()
  );
});

// 6. 清理过期缓存
cleanupOutdatedCaches();

// 7. 激活新Service Worker
self.skipWaiting();
clientsClaim();

// 8. 永久缓存处理函数（略 - 与之前相同）

// 9. 导航请求处理 - 添加重试机制
async function handleNavigationRequest(url: URL, event: FetchEvent): Promise<Response> {
  const MAX_RETRIES = 2;
  let retryCount = 0;
  
  const attemptFetch = async (): Promise<Response> => {
    try {
      // 先尝试从缓存获取
      const cachedResponse = await caches.match(url.pathname === '/' ? '/index.html' : url.pathname);
      if (cachedResponse) return cachedResponse;
      
      // 缓存放宽条件
      if (retryCount > 0) {
        const looseMatch = await caches.match(url.pathname, { ignoreSearch: true });
        if (looseMatch) return looseMatch;
      }
      
      // 尝试网络请求（不缓存，避免缓存500响应）
      const networkResponse = await fetch(event.request, {
        cache: 'no-store'
      });
      
      if (networkResponse.ok) {
        // 只缓存200响应
        if (networkResponse.status === 200) {
          const cache = await caches.open('dynamic-pages');
          event.waitUntil(cache.put(event.request.url, networkResponse.clone()));
        }
        return networkResponse;
      }
      
      throw new Error(`HTTP ${networkResponse.status}`);
    } catch (error) {
      console.warn(`Navigation request error (attempt ${retryCount + 1}):`, error);
      
      if (retryCount < MAX_RETRIES) {
        retryCount++;
        return attemptFetch();
      }
      
      // 最终回退
      return caches.match(OFFLINE_PAGE) || new Response('Service unavailable', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  };
  
  return attemptFetch();
}

// 10. fetch事件处理（略 - 与之前相同）

// 11. 激活事件 - 添加回退机制
self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    (async () => {
      // 确保Service Worker立即接管控制
      await self.clients.claim();
      
      // 安全清理缓存
      try {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(name => {
            if (name !== EXTERNAL_CACHE_NAME && 
                name !== PERMANENT_REQUEST_TRACKER &&
                !name.startsWith('workbox')) {
              return caches.delete(name);
            }
          })
        );
      } catch (error) {
        console.error('Cache cleanup error:', error);
      }
    })()
  );
});