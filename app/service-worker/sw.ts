/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;

import { clientsClaim } from 'workbox-core';
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

// 1. 修复资源过滤问题
function filterResources(resources: any[]): string[] {
  return resources
    .filter(resource => {
      // 统一处理字符串和对象格式的资源
      const url = typeof resource === 'string' ? resource : resource.url;
      return url && 
             !url.includes('hot-update') && 
             !url.includes('__webpack') && 
             !url.includes('development');
    })
    .map(resource => {
      // 转换为字符串URL格式
      return typeof resource === 'string' ? resource : resource.url;
    });
}

// 2. 定义需要缓存的外部资源域名
const EXTERNAL_RESOURCES: string[] = [
  'https://sourceimage.s3.bitiful.net',
  'https://gcore.jsdelivr.net'
];

// 3. 定义缓存名称
const EXTERNAL_CACHE_NAME = 'external-resources-permanent';
const PERMANENT_REQUEST_TRACKER = 'permanent-requests';
const OFFLINE_PAGE = '/offline.html';

// 4. 获取并过滤预缓存资源
const WB_MANIFEST = self.__WB_MANIFEST || [];
const PRECACHE_RESOURCES = [
  { url: '/', revision: 'v1' },
  ...WB_MANIFEST
];

// 过滤后的资源URL列表
const PRECACHE_URLS = filterResources(PRECACHE_RESOURCES);

// 5. 安全预缓存方法
async function safePrecache() {
  const cache = await caches.open('core-cache');
  
  for (const url of PRECACHE_URLS) {
    try {
      const absoluteUrl = new URL(url, self.location.origin).href;
      const response = await fetch(absoluteUrl, {
        method: 'GET',
        cache: 'no-store',
        credentials: 'same-origin'
      });
      
      if (response.ok) {
        await cache.put(absoluteUrl, response.clone());
        console.log(`Precached: ${absoluteUrl}`);
      } else {
        console.warn(`Precache skipped (${response.status}): ${absoluteUrl}`);
      }
    } catch (error) {
      console.error(`Precache error for ${url}:`, error);
    }
  }
}

// 6. 主安装流程
self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    (async () => {
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

// 7. 激活阶段
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

// 8. 缓存策略配置
cleanupOutdatedCaches();
self.skipWaiting();
clientsClaim();

// 9. 永久缓存处理函数
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
      
      // 标记该请求为永久缓存
      event.waitUntil(markRequestAsPermanent(url));
      event.waitUntil(cache.put(request, responseToCache));
      
      return fetchResponse;
    }
    
    // 尝试使用可能的旧缓存
    const cache = await caches.open(EXTERNAL_CACHE_NAME);
    const staleResponse = await cache.match(request);
    if (staleResponse) {
      event.waitUntil(markRequestAsPermanent(url));
      return staleResponse;
    }
    
    throw new Error('Fetch failed and no stale cache available');
    
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

// 10. 导航请求处理
async function handleNavigationRequest(url: URL, event: FetchEvent): Promise<Response> {
  try {
    // 尝试从缓存获取
    const cache = await caches.open('core-cache');
    const requestPath = url.pathname === '/' ? '/index.html' : url.pathname;
    const cachedResponse = await cache.match(requestPath);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // 网络请求
    return await fetch(event.request);
  } catch (error) {
    return caches.match(OFFLINE_PAGE) || new Response('Offline', {
      status: 200,
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// 11. fetch事件处理
self.addEventListener('fetch', (event: FetchEvent) => {
  const url = new URL(event.request.url);
  
  // 处理导航请求
  if (event.request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(url, event));
    return;
  }
  
  // 处理外部资源请求
  const isExternal = EXTERNAL_RESOURCES.some(domain => 
    url.href.startsWith(domain) || 
    url.hostname.endsWith(`.${domain}`)
  );
  
  if (isExternal) {
    event.respondWith(handlePermanentCacheStrategy(event.request, event));
    return;
  }
  
  // 其他静态资源
  if (['script', 'style', 'image', 'font'].includes(event.request.destination)) {
    event.respondWith(
      new StaleWhileRevalidate({
        cacheName: 'static-assets'
      }).handle({ event })
    );
  }
});

// 12. 消息处理
self.addEventListener('message', (event: ExtendableMessageEvent) => {
  if (event.data?.type === 'CLEAR_CACHE') {
    caches.delete(EXTERNAL_CACHE_NAME);
    caches.delete(PERMANENT_REQUEST_TRACKER);
    event.source?.postMessage({ type: 'CACHE_CLEARED' });
  }
});