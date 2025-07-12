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
const EXTERNAL_CACHE_NAME = 'external-resources-v1';

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

// 4. 激活阶段清理旧缓存
self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== EXTERNAL_CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

// --- 自定义外部资源缓存功能 ---

// 处理外部资源请求
async function handleExternalRequest(request: Request): Promise<Response> {
  const cache = await caches.open(EXTERNAL_CACHE_NAME);
  
  // 尝试从缓存中获取响应
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  // 配置跨域请求选项
  const fetchOptions: RequestInit = {
    method: request.method,
    headers: request.headers,
    mode: 'cors',
    credentials: 'omit',
    cache: 'no-cache'
  };

  try {
    // 发起网络请求
    const fetchResponse = await fetch(request, fetchOptions);
    
    // 只缓存成功的响应
    if (fetchResponse.ok) {
      // 克隆响应以便缓存和使用
      const responseToCache = fetchResponse.clone();
      
      // 异步缓存响应（不阻塞返回）
      event.waitUntil(cache.put(request, responseToCache));
      
      // 检查缓存控制头
      const cacheControl = fetchResponse.headers.get('Cache-Control');
      const maxAge = cacheControl?.match(/max-age=(\d+)/)?.[1];
      
      // 如果资源有明确的缓存时间，设置定时更新
      if (maxAge) {
        const expirationTime = Date.now() + parseInt(maxAge) * 1000;
        const cacheMetadata = {
          url: request.url,
          timestamp: Date.now(),
          expiration: expirationTime
        };
        
        // 使用单独的缓存存储元数据
        const metadataCache = await caches.open('cache-metadata');
        await metadataCache.put(request.url, new Response(JSON.stringify(cacheMetadata)));
      }
    }
    
    return fetchResponse;
  } catch (error) {
    console.error('Fetch failed for external resource:', request.url, error);
    
    // 尝试返回可能存在的旧版本缓存
    const staleResponse = await cache.match(request);
    if (staleResponse) {
      return staleResponse;
    }
    
    // 最后的备选方案
    return new Response('Service Unavailable', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// 缓存更新任务
async function updateCachedResources() {
  const cache = await caches.open(EXTERNAL_CACHE_NAME);
  const metadataCache = await caches.open('cache-metadata');
  
  // 获取所有缓存请求
  const requests = await cache.keys();
  
  for (const request of requests) {
    try {
      // 获取缓存的元数据
      const metadataResponse = await metadataCache.match(request.url);
      
      if (metadataResponse) {
        const metadata = await metadataResponse.json();
        
        // 检查是否过期
        if (metadata.expiration && metadata.expiration <= Date.now()) {
          // 刷新缓存
          const newResponse = await fetch(request);
          
          if (newResponse.ok) {
            await cache.put(request, newResponse.clone());
            
            // 更新元数据
            const cacheControl = newResponse.headers.get('Cache-Control');
            const maxAge = cacheControl?.match(/max-age=(\d+)/)?.[1];
            
            if (maxAge) {
              metadata.expiration = Date.now() + parseInt(maxAge) * 1000;
              metadata.timestamp = Date.now();
              await metadataCache.put(request.url, new Response(JSON.stringify(metadata)));
            }
          }
        }
      }
    } catch (error) {
      console.warn('Failed to update cached resource:', request.url, error);
    }
  }
}

// 所有 fetch 事件的主处理程序
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
  
  // 处理外部资源请求
  if (isExternal) {
    event.respondWith(handleExternalRequest(event.request));
  }
  // 其他请求继续使用默认行为（由 Workbox 处理）
});

// 定期更新缓存资源
self.addEventListener('periodicsync', (event: Event) => {
  if (event.tag === 'update-cache') {
    event.waitUntil(updateCachedResources());
  }
});

// 安装后定期执行缓存更新（每天一次）
self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    (async () => {
      if ('periodicSync' in self.registration) {
        try {
          // @ts-ignore - 暂未包含在 TS 类型定义中
          await self.registration.periodicSync.register('update-cache', {
            minInterval: 24 * 60 * 60 * 1000 // 24小时
          });
        } catch (error) {
          console.warn('Periodic sync registration failed:', error);
        }
      }
    })()
  );
});