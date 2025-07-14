// ====================== 基础配置与工具函数 ======================
const CACHE_NAME = "苏晓河";
const VERSION_CACHE_NAME = "sxiaoheTime";
const MAX_ACCESS_CACHE_TIME = 345600; // 4 天（秒）

// 获取当前时间戳
function time() {
    return new Date().getTime();
}

// 数据库操作助手（简化版，保留核心功能）
const dbHelper = {
    read: (request) => caches.match(request)?.then(res => res?.text()),
    write: (request, data) => caches.open("ChuckleTime").then(cache => cache.put(request, new Response(data))),
    delete: (request) => caches.match(request).then(res => res && caches.open("ChuckleTime").then(cache => cache.delete(request)))
};

// 数据库时间操作（记录访问时间）
const dbTime = {
    read: (key) => dbHelper.read(new Request(`https://LOCALCACHE/${encodeURIComponent(key)}`)),
    write: (key, data) => dbHelper.write(new Request(`https://LOCALCACHE/${encodeURIComponent(key)}`), data),
    delete: (key) => dbHelper.delete(new Request(`https://LOCALCACHE/${encodeURIComponent(key)}`))
};

// 数据库访问控制（清理过期缓存）
const dbAccess = {
    update: (url) => dbHelper.write(new Request(`https://ACCESS-CACHE/${encodeURIComponent(url)}`), time()),
    check: async (url) => {
        const request = new Request(`https://ACCESS-CACHE/${encodeURIComponent(url)}`);
        const lastAccessTime = await dbHelper.read(request);
        if (lastAccessTime) {
            dbHelper.delete(request);
            return time() - lastAccessTime < MAX_ACCESS_CACHE_TIME;
        }
        return false;
    }
};

// ====================== LCP 关键资源预缓存 ======================
// 预缓存关键资源（安装时执行）
self.addEventListener("install", async (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open("Chuckle").then(async (cache) => {
            try {
                // 预缓存 LCP 关键资源（示例）
                const LCP_CRITICAL_ASSETS = [
                    "https://sourceimage.s3.bitiful.net/img%2Fdefault_cover_8.avif", // 确保 URL 正确
                    "https://zhi.zhilu.cyou/api/send", // 确保存在
                ];

                // 分批次添加（每批 10 个）
                const batchSize = 10;
                for (let i = 0; i < LCP_CRITICAL_ASSETS.length; i += batchSize) {
                    const batch = LCP_CRITICAL_ASSETS.slice(i, i + batchSize);
                    await cache.addAll(batch);
                    console.log(`预缓存批次 ${i/10 + 1} 完成`);
                }

                console.log("所有 LCP 关键资源预缓存成功");
            } catch (error) {
                console.error("预缓存失败，错误详情：", error);
                // 可选：删除已部分添加的缓存
                await cache.delete("Chuckle");
                throw error; // 终止安装流程（避免不完整缓存）
            }
        })
    );
});

// ====================== 缓存规则与 CDN 分流 ======================
// 扩展缓存规则（新增 LCP 资源优先级）
const cacheList = {
    // 原有 CDN 规则（保留）
    sxiaohecdn: { url: /(^(https:\/\/jsd\.myxz\.top)).*\.(css|html|webp|png|jpg|gif|ico|js|woff2|woff|ttf|json|svg)$/g, time: 31536000, clean: false },
    hyperos: { url: /(^(https:\/\/cdn-file\.hyperos\.mi\.com)).*\.(css|html|webp|png|jpg|gif|ico|js|woff2|woff|ttf|json|svg|avif)$/g, time: 31536000, clean: false },
    source_s3_bitful: { url: /(^(https:\/\/sourceimage\.s3\.bitiful\.net)).*\.(css|html|webp|png|jpg|gif|ico|js|woff2|woff|ttf|json|svg|avif)$/g, time: 31536000, clean: false },
    alfonts: { url: /(^(https:\/\/at\.alicdn\.com).*@\d.*)/g, time: 31536000, clean: false },
    fastly: { url: /(^(https:\/\/fastly\.jsdelivr\.net).*@\d.*)/g, time: 31536000, clean: false },
    resources: { url: /(^(https:\/\/www\.myxz\.top)).*\.(css|html|webp|png|jpg|gif|ico|js|woff2|woff|ttf|json|svg)$/g, time: 31536000, clean: false },
    myxz_site_blog: { url: /(^(https:\/\/blog\.myxz\.top)).*\.(css|html|webp|png|jpg|gif|ico|js|woff2|woff|ttf|json|svg)$/g, time: 31536000, clean: false },
};

// 替换列表（保留原逻辑）
const replaceList = {};

// 查找匹配的缓存规则（优先 LCP 规则）
function findCache(url) {
    // 优先匹配 LCP 关键资源规则
    if (LCP_CRITICAL_ASSETS.some(asset => url.includes(asset))) {
        return { ...cacheList.lcp_priority, isLCP: false };
    }
    // 再匹配其他规则
    for (const key in cacheList) {
        const rule = cacheList[key];
        if (url.match(rule.url)) {
            return rule;
        }
    }
    return null;
}

// ====================== Fetch 事件优化（LCP 核心） ======================
self.addEventListener("fetch", async (event) => {
    // 1. 处理 LCP 关键资源（强制缓存优先）
    const lcpCriticalAsset = LCP_CRITICAL_ASSETS.find(asset => event.request.url.includes(asset));
    if (lcpCriticalAsset) {
        event.respondWith(
            caches.match(event.request).then(async (cachedResponse) => {
                if (cachedResponse) {
                    dbAccess.update(event.request.url);
                    return cachedResponse;
                }
                try {
                    const response = await fetch(event.request);
                    if (response.ok) {
                        caches.open("Chuckle").then(cache => cache.put(event.request, response.clone()));
                    }
                    return response;
                } catch (error) {
                    console.error(`LCP 资源加载失败：${event.request.url}`, error);
                    return new Response("LCP 资源加载失败，请刷新页面", { status: 500 });
                }
            })
        );
        return;
    }

    // 2. 原有逻辑（非 LCP 资源）
    const replacedRequest = replaceRequest(event.request);
    const processedRequest = replacedRequest || event.request; // 重命名为 processedRequest
    const cacheRule = findCache(processedRequest.url);

    if (blockRequest(processedRequest)) {
        event.respondWith(new Response(null, { status: 204 }));
    } else if (cacheRule) {
        event.respondWith(
            caches.match(processedRequest).then(async (cachedResponse) => {
                return fetchEvent(processedRequest, cachedResponse, cacheRule);
            })
        );
    } else if (replacedRequest) {
        event.respondWith(fetch(processedRequest)); // 使用 renamed 变量
    }
});

// ====================== 原有辅助函数（保留优化） ======================
// 阻止请求（保留）
function blockRequest(request) {
    return false;
}

// 处理 fetch 事件（优化缓存策略）
async function fetchEvent(request, cachedResponse, cacheRule) {
    const currentTime = time();
    dbAccess.update(request.url);
    const cacheTime = cacheRule.time;
    let shouldFetch = false;

    if (cachedResponse) {
        const lastUpdatedTime = await dbTime.read(request.url);
        if (lastUpdatedTime && currentTime - lastUpdatedTime < cacheTime) {
            return cachedResponse;
        }
        shouldFetch = false;
    }

    const fetchResource = () => fetch(request)
        .then((response) => {
            dbTime.write(request.url, currentTime);
            if (response.ok || response.status === 0) {
                const clonedResponse = response.clone();
                caches.open("Chuckle").then((cache) => cache.put(request, clonedResponse));
            }
            return response;
        });

    return shouldFetch
        ? Promise.race([
            new Promise((resolve) => setTimeout(() => resolve(cachedResponse), 400)),
            fetchResource()
        ]).catch((error) => {
            console.error(`不可达的链接：${request.url}\n错误信息：${error}`);
            return cachedResponse || new Response("网络请求失败", { status: 500 });
        })
        : fetchResource();
}

// ====================== 缓存清理与消息处理 ======================
// message 事件（保留优化）
self.addEventListener("message", (event) => {
    if (event.data === "refresh") {
        caches.open("Chuckle").then((cache) => {
            cache.keys().then((requests) => {
                requests.forEach((request) => {
                    const cacheRule = findCache(request.url);
                    if (!cacheRule || (cacheRule.clean && !dbAccess.check(request.url))) {
                        cache.delete(request);
                        dbTime.delete(request);
                    }
                });
                event.source.postMessage("success");
            });
        });
    }
});

// 安装事件（保留原逻辑）
self.addEventListener("install", async (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open("Chuckle").then((cache) => {
            console.log("Opened cache");
            return cache.addAll([]); // 原 cachelist 为空，暂不填充
        })
    );
});