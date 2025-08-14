// 霞浦网站 Service Worker
const CACHE_NAME = 'xiapu-v1.0.0';
const STATIC_CACHE = 'xiapu-static-v1.0.0';
const DYNAMIC_CACHE = 'xiapu-dynamic-v1.0.0';

// 需要缓存的静态资源
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/main.js',
    '/video-generator.js',
    '/hero-video.js',
    '/performance-optimizer.js',
    'https://cdn.tailwindcss.com',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// 需要缓存的图片资源
const IMAGE_ASSETS = [
    'https://zhiyan-ai-agent-with-1258344702.cos.ap-guangzhou.tencentcos.cn/with/43557910-28c6-49b9-9f40-77c6b1b3a552/image_1754559652_1_1.jpg',
    'https://zhiyan-ai-agent-with-1258344702.cos.ap-guangzhou.tencentcos.cn/with/4f2376bd-d630-4f5c-800b-710b0aebda69/image_1754559690_3_1.jpg',
    'https://zhiyan-ai-agent-with-1258344702.cos.ap-guangzhou.tencentcos.cn/with/2ae33763-0a7c-4763-815a-9a6615d6c58e/image_1754559698_2_1.jpg',
    'https://zhiyan-ai-agent-with-1258344702.cos.ap-guangzhou.tencentcos.cn/with/54337f46-2b56-48b1-9b8f-1795fcdaf116/image_1754559705_1_1.jpg'
];

// Service Worker 安装事件
self.addEventListener('install', event => {
    console.log('Service Worker 安装中...');
    
    event.waitUntil(
        Promise.all([
            // 缓存静态资源
            caches.open(STATIC_CACHE).then(cache => {
                console.log('缓存静态资源...');
                return cache.addAll(STATIC_ASSETS);
            }),
            // 预缓存关键图片
            caches.open(DYNAMIC_CACHE).then(cache => {
                console.log('预缓存图片资源...');
                return cache.addAll(IMAGE_ASSETS);
            })
        ]).then(() => {
            console.log('Service Worker 安装完成');
            // 强制激活新的 Service Worker
            return self.skipWaiting();
        })
    );
});

// Service Worker 激活事件
self.addEventListener('activate', event => {
    console.log('Service Worker 激活中...');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // 删除旧版本的缓存
                    if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                        console.log('删除旧缓存:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('Service Worker 激活完成');
            // 立即控制所有页面
            return self.clients.claim();
        })
    );
});

// 网络请求拦截
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // 只处理 GET 请求
    if (request.method !== 'GET') {
        return;
    }
    
    // 处理不同类型的资源
    if (isStaticAsset(request.url)) {
        // 静态资源：缓存优先策略
        event.respondWith(cacheFirst(request, STATIC_CACHE));
    } else if (isImageAsset(request.url)) {
        // 图片资源：缓存优先，带回退策略
        event.respondWith(cacheFirstWithFallback(request, DYNAMIC_CACHE));
    } else if (isAPIRequest(request.url)) {
        // API请求：网络优先策略
        event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    } else {
        // 其他资源：网络优先策略
        event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    }
});

// 缓存优先策略
async function cacheFirst(request, cacheName) {
    try {
        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            console.log('从缓存返回:', request.url);
            return cachedResponse;
        }
        
        console.log('缓存未命中，从网络获取:', request.url);
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('缓存优先策略失败:', error);
        return new Response('网络错误', { status: 503 });
    }
}

// 缓存优先策略（带回退）
async function cacheFirstWithFallback(request, cacheName) {
    try {
        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
            return networkResponse;
        }
        
        // 如果网络请求失败，返回占位图片
        return getFallbackImage();
    } catch (error) {
        console.error('图片加载失败:', error);
        return getFallbackImage();
    }
}

// 网络优先策略
async function networkFirst(request, cacheName) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('网络请求失败，尝试从缓存获取:', request.url);
        
        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // 如果是HTML页面请求，返回离线页面
        if (request.headers.get('accept').includes('text/html')) {
            return getOfflinePage();
        }
        
        return new Response('离线状态', { status: 503 });
    }
}

// 判断是否为静态资源
function isStaticAsset(url) {
    return STATIC_ASSETS.some(asset => url.includes(asset)) ||
           url.includes('.js') ||
           url.includes('.css') ||
           url.includes('.html');
}

// 判断是否为图片资源
function isImageAsset(url) {
    return url.includes('.jpg') ||
           url.includes('.jpeg') ||
           url.includes('.png') ||
           url.includes('.gif') ||
           url.includes('.webp') ||
           url.includes('.svg') ||
           IMAGE_ASSETS.some(asset => url.includes(asset));
}

// 判断是否为API请求
function isAPIRequest(url) {
    return url.includes('/api/') ||
           url.includes('weather') ||
           url.includes('map');
}

// 获取占位图片
function getFallbackImage() {
    const svg = `
        <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#f3f4f6"/>
            <text x="50%" y="50%" font-family="Arial" font-size="14" fill="#9ca3af" text-anchor="middle" dy=".3em">
                图片暂时无法加载
            </text>
        </svg>
    `;
    
    return new Response(svg, {
        headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'no-cache'
        }
    });
}

// 获取离线页面
function getOfflinePage() {
    const html = `
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>离线状态 - 霞浦之美</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    margin: 0;
                    padding: 0;
                    background: linear-gradient(135deg, #0ea5e9, #f97316);
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                }
                .container {
                    text-align: center;
                    padding: 2rem;
                }
                .icon {
                    font-size: 4rem;
                    margin-bottom: 1rem;
                }
                h1 {
                    font-size: 2rem;
                    margin-bottom: 1rem;
                }
                p {
                    font-size: 1.1rem;
                    opacity: 0.9;
                    margin-bottom: 2rem;
                }
                .retry-btn {
                    background: rgba(255, 255, 255, 0.2);
                    border: 2px solid white;
                    color: white;
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.5rem;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .retry-btn:hover {
                    background: rgba(255, 255, 255, 0.3);
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="icon">📱</div>
                <h1>您当前处于离线状态</h1>
                <p>请检查网络连接后重试</p>
                <button class="retry-btn" onclick="window.location.reload()">
                    重新加载
                </button>
            </div>
        </body>
        </html>
    `;
    
    return new Response(html, {
        headers: {
            'Content-Type': 'text/html',
            'Cache-Control': 'no-cache'
        }
    });
}

// 后台同步（如果支持）
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        console.log('执行后台同步...');
        event.waitUntil(doBackgroundSync());
    }
});

// 执行后台同步
async function doBackgroundSync() {
    try {
        // 这里可以执行一些后台任务
        // 比如同步用户数据、更新缓存等
        console.log('后台同步完成');
    } catch (error) {
        console.error('后台同步失败:', error);
    }
}

// 推送通知（如果支持）
self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/icon-192x192.png',
            badge: '/badge-72x72.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: data.primaryKey
            },
            actions: [
                {
                    action: 'explore',
                    title: '立即探索',
                    icon: '/icon-explore.png'
                },
                {
                    action: 'close',
                    title: '关闭',
                    icon: '/icon-close.png'
                }
            ]
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// 通知点击处理
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

console.log('霞浦网站 Service Worker 已加载 🌊');