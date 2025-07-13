/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;

import { clientsClaim } from 'workbox-core';
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

// 1. 配置关键参数
const EXTERNAL_RESOURCES: string[] = [
  'https://sourceimage.s3.bitiful.net',
  'https://gcore.jsdelivr.net'
];

const EXTERNAL_CACHE_NAME = 'external-resources-permanent';
const PERMANENT_REQUEST_TRACKER = 'permanent-requests';
const OFFLINE_PAGE = '/offline.html';
const MAX_CONCURRENT_REQUESTS = 10; // 限制并发请求数

// 2. 预缓存核心资源 - 只包含真正必要的资源
const PRECACHE_RESOURCES = [
  '/',
  // 添加其他关键CSS/JS文件
  ...(self.__WB_MANIFEST || [])
].filter(resource => {
  // 过滤掉可能不存在的资源
  return !resource.includes('hot-update') && 
         !resource.includes('__webpack') &&
         !resource.includes('development');
});

// 3. 请求队列系统 - 限制并发请求
class RequestQueue {
  private queue: (() => Promise<void>)[] = [];
  private activeCount = 0;

  async add(requestFn: () => Promise<void>): Promise<void> {
    return new Promise((resolve) => {
      const execute = async () => {
        this.activeCount++;
        try {
          await requestFn();
        } catch (error) {
          console.error('Queue request error:', error);
        } finally {
          this.activeCount--;
          this.processQueue();
        }
        resolve();
      };

      this.queue.push(execute);
      this.processQueue();
    });
  }

  private processQueue() {
    while (this.queue.length > 0 && this.activeCount < MAX_CONCURRENT_REQUESTS) {
      const nextRequest = this.queue.shift();
      if (nextRequest) nextRequest();
    }
  }
}

const requestQueue = new RequestQueue();

// 4. 安全预缓存方法
async function safePrecache() {
  const cache = await caches.open('core-cache');
  
  for (const resource of PRECACHE_RESOURCES) {
    try {
      const url = new URL(resource, self.location.origin).href;
      
      // 检查是否已在缓存中
      const cached = await cache.match(url);
      if (cached) continue;
      
      await requestQueue.add(async () => {
        const response = await fetch(url, {
          method: 'GET',
          cache: 'no-store',
          credentials: 'same-origin'
        });
        
        if (response.ok) {
          await cache.put(url, response.clone());
          console.log(`Precached: ${url}`);
        } else {
          console.warn(`Precache skipped (${response.status}): ${url}`);
        }
      });
    } catch (error) {
      console.error(`Precache error for ${resource}:`, error);
    }
  }
}

// 5. 主安装流程
self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    (async () => {
      // 预缓存核心资源
      await safePrecache();
      
      // 通知客户端
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach(client => {
        client.postMessage({
          type: 'SW_STATUS',
          message: 'Service Worker installed'
        });
      });
    })()
  );
});

// 6. 激活阶段
self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    (async () => {
      // 清理旧缓存
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(name => {
          if (name !== 'core-cache' && 
              name !== EXTERNAL_CACHE_NAME && 
              name !== PERMANENT_REQUEST_TRACKER) {
            return caches.delete(name);
          }
        })
      );
      
      // 立即接管控制
      await self.clients.claim();
    })()
  );
});

// 7. 缓存策略配置
cleanupOutdatedCaches();
self.skipWaiting();
clientsClaim();

// 8. 永久缓存处理函数
async function markRequestAsPermanent(url: string): Promise<void> {
  const cache = await caches.open(PERMANENT_REQUEST_TRACKER);
  await cache.put(url, new Response('permanent'));
}

async function isPermanentRequest(url: string): Promise<boolean> {
  const cache = await caches.open(PERMANENT_REQUEST_TRACKER);
  const response = await cache.match(url);
  return !!response;
}

async function handlePermanentCacheStrategy(request: Request, event: ExtendableEvent): Promise<Response> {
  const url = request.url;
  
  // 检查是否已标记为永久请求
  if (await isPermanentRequest(url)) {
    const cache = await caches.open(EXTERNAL_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    if (cachedResponse) return cachedResponse;
  }
  
  try {
    // 使用队列控制并发请求
    return await new Promise<Response>((resolve, reject) => {
      requestQueue.add(async () => {
        try {
          const fetchOptions: RequestInit = {
            method: request.method,
            headers: request.headers,
            mode: 'cors',
            credentials: 'omit',
            cache: 'no-cache'
          };
          
          const fetchResponse = await fetch(request, fetchOptions);
          
          if (fetchResponse.ok) {
            const responseToCache = fetchResponse.clone();
            const cache = await caches.open(EXTERNAL_CACHE_NAME);
            
            // 标记为永久缓存
            event.waitUntil(markRequestAsPermanent(url));
            event.waitUntil(cache.put(request, responseToCache));
            
            resolve(fetchResponse);
          } else {
            reject(new Error(`Fetch failed with status ${fetchResponse.status}`));
          }
        } catch (error) {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Fetch failed for external resource:', url, error);
    
    // 尝试返回缓存版本
    const cache = await caches.open(EXTERNAL_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    if (cachedResponse) return cachedResponse;
    
    // 最终回退
    return new Response('Service Unavailable', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// 9. 注册路由策略
// 静态资源缓存策略
registerRoute(
  ({ request }) => 
    request.destination === 'script' || 
    request.destination === 'style' ||
    request.destination === 'font',
  new StaleWhileRevalidate({
    cacheName: 'static-assets',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30天
      }),
    ],
  })
);

// 图片缓存策略
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 200,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30天
      }),
    ],
  })
);

// 10. fetch事件处理
self.addEventListener('fetch', (event: FetchEvent) => {
  const url = new URL(event.request.url);
  
  // 处理导航请求
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // 尝试从缓存获取
          const cachedPage = await caches.match(url.pathname === '/' ? '/index.html' : url.pathname);
          if (cachedPage) return cachedPage;
          
          // 网络请求
          return await fetch(event.request);
        } catch (error) {
          return caches.match(OFFLINE_PAGE) || new Response('Offline', {
            status: 200,
            headers: { 'Content-Type': 'text/html' }
          });
        }
      })()
    );
    return;
  }
  
  // 处理外部资源
  const isExternal = EXTERNAL_RESOURCES.some(domain => 
    url.href.startsWith(domain) || 
    url.hostname.endsWith(`.${domain}`)
  );
  
  if (isExternal) {
    event.respondWith(handlePermanentCacheStrategy(event.request, event));
    return;
  }
  
  // 其他请求使用默认策略（由Workbox处理）
});

// 11. 消息处理
self.addEventListener('message', (event: ExtendableMessageEvent) => {
  if (event.data?.type === 'CLEAR_CACHE') {
    caches.delete(EXTERNAL_CACHE_NAME);
    caches.delete(PERMANENT_REQUEST_TRACKER);
    event.source?.postMessage({ type: 'CACHE_CLEARED' });
  }
});

// 12. 后台同步处理
self.addEventListener('sync', (event: SyncEvent) => {
  if (event.tag === 'update-cache') {
    console.log('Background sync for cache update');
    // 这里可以添加缓存更新逻辑
  }
});

// 13. 性能监控
let requestCount = 0;
let cacheHitCount = 0;

self.addEventListener('fetch', (event: FetchEvent) => {
  requestCount++;
  
  event.respondWith(
    (async () => {
      const cachedResponse = await caches.match(event.request);
      if (cachedResponse) {
        cacheHitCount++;
        return cachedResponse;
      }
      return fetch(event.request);
    })()
  );
});

// 定期报告性能
setInterval(() => {
  const hitRate = requestCount > 0 ? (cacheHitCount / requestCount * 100).toFixed(1) : 0;
  console.log(`Cache hit rate: ${hitRate}% (${cacheHitCount}/${requestCount})`);
  
  // 重置计数器
  requestCount = 0;
  cacheHitCount = 0;
}, 60 * 1000); // 每分钟报告一次