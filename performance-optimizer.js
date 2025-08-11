// 霞浦网站性能优化模块
class PerformanceOptimizer {
    constructor() {
        this.metrics = {
            loadTime: 0,
            renderTime: 0,
            interactionTime: 0
        };
        this.init();
    }
    
    init() {
        this.measurePerformance();
        this.optimizeImages();
        this.preloadCriticalResources();
        this.setupServiceWorker();
        this.enableCaching();
    }
    
    // 性能监控
    measurePerformance() {
        // 页面加载时间
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            this.metrics.loadTime = loadTime;
            console.log(`页面加载时间: ${loadTime.toFixed(2)}ms`);
            
            // 发送性能数据到分析服务（模拟）
            this.sendAnalytics('page_load_time', loadTime);
        });
        
        // 首次内容绘制时间
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.name === 'first-contentful-paint') {
                        console.log(`首次内容绘制: ${entry.startTime.toFixed(2)}ms`);
                        this.sendAnalytics('first_contentful_paint', entry.startTime);
                    }
                }
            });
            observer.observe({ entryTypes: ['paint'] });
        }
    }
    
    // 图片优化
    optimizeImages() {
        // 响应式图片
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // 添加WebP支持检测
            if (this.supportsWebP()) {
                const src = img.src || img.getAttribute('data-src');
                if (src && !src.includes('.webp')) {
                    // 在实际项目中，这里应该有WebP版本的图片
                    console.log('WebP支持已启用');
                }
            }
            
            // 添加图片错误处理
            img.addEventListener('error', () => {
                console.warn('图片加载失败:', img.src);
                // 可以设置默认占位图
                img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuWbvueJh+WKoOi9veWksei0pTwvdGV4dD48L3N2Zz4=';
            });
        });
    }
    
    // WebP支持检测
    supportsWebP() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    
    // 预加载关键资源
    preloadCriticalResources() {
        const criticalResources = [
            'https://cdn.tailwindcss.com',
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
        ];
        
        criticalResources.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = url;
            link.as = url.endsWith('.css') ? 'style' : 'script';
            document.head.appendChild(link);
        });
    }
    
    // Service Worker设置
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker注册成功:', registration);
                })
                .catch(error => {
                    console.log('Service Worker注册失败:', error);
                });
        }
    }
    
    // 缓存策略
    enableCaching() {
        // 本地存储优化
        const cacheVersion = '1.0.0';
        const currentVersion = localStorage.getItem('cache_version');
        
        if (currentVersion !== cacheVersion) {
            // 清理旧缓存
            localStorage.clear();
            localStorage.setItem('cache_version', cacheVersion);
            console.log('缓存已更新到版本:', cacheVersion);
        }
    }
    
    // 分析数据发送（模拟）
    sendAnalytics(event, value) {
        // 在实际项目中，这里会发送到Google Analytics或其他分析服务
        console.log(`分析事件: ${event}, 值: ${value}`);
    }
    
    // 内存优化
    optimizeMemory() {
        // 清理未使用的事件监听器
        window.addEventListener('beforeunload', () => {
            // 清理资源
            this.cleanup();
        });
    }
    
    cleanup() {
        // 清理操作
        console.log('清理资源...');
    }
}

// 用户体验增强模块
class UXEnhancer {
    constructor() {
        this.init();
    }
    
    init() {
        this.addLoadingStates();
        this.enhanceAccessibility();
        this.addKeyboardNavigation();
        this.optimizeForMobile();
    }
    
    // 添加加载状态
    addLoadingStates() {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                if (!button.disabled) {
                    button.classList.add('loading');
                    button.disabled = true;
                    
                    // 模拟异步操作
                    setTimeout(() => {
                        button.classList.remove('loading');
                        button.disabled = false;
                    }, 1000);
                }
            });
        });
    }
    
    // 可访问性增强
    enhanceAccessibility() {
        // 添加焦点指示器
        const focusableElements = document.querySelectorAll('a, button, input, textarea, select');
        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.style.outline = '2px solid #0ea5e9';
                element.style.outlineOffset = '2px';
            });
            
            element.addEventListener('blur', () => {
                element.style.outline = 'none';
            });
        });
        
        // 添加跳转到主内容的链接
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = '跳转到主内容';
        skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-ocean-blue text-white px-4 py-2 rounded z-50';
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    // 键盘导航增强
    addKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Tab键导航增强
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }
    
    // 移动端优化
    optimizeForMobile() {
        // 触摸反馈
        const touchElements = document.querySelectorAll('button, a, .card-hover');
        touchElements.forEach(element => {
            element.addEventListener('touchstart', () => {
                element.style.transform = 'scale(0.98)';
            });
            
            element.addEventListener('touchend', () => {
                element.style.transform = '';
            });
        });
        
        // 防止双击缩放
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }
}

// SEO优化模块
class SEOOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        this.addStructuredData();
        this.optimizeMetaTags();
        this.addBreadcrumbs();
    }
    
    // 添加结构化数据
    addStructuredData() {
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "TouristDestination",
            "name": "霞浦",
            "description": "中国最美滩涂摄影天堂",
            "image": "https://zhiyan-ai-agent-with-1258344702.cos.ap-guangzhou.tencentcos.cn/with/43557910-28c6-49b9-9f40-77c6b1b3a552/image_1754559652_1_1.jpg",
            "address": {
                "@type": "PostalAddress",
                "addressCountry": "CN",
                "addressRegion": "福建省",
                "addressLocality": "宁德市",
                "streetAddress": "霞浦县"
            },
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": "26.885971",
                "longitude": "120.005267"
            },
            "touristType": ["摄影爱好者", "自然风光爱好者", "文化体验者"]
        };
        
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
    }
    
    // 优化Meta标签
    optimizeMetaTags() {
        // 动态更新页面标题
        const sections = document.querySelectorAll('section[id]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    const titles = {
                        'hero': '霞浦 - 中国最美滩涂摄影天堂',
                        'scenery': '霞浦自然风光 - 滩涂美景',
                        'culture': '霞浦渔业文化 - 传统与现代',
                        'photography': '霞浦摄影攻略 - 光影艺术',
                        'food': '霞浦美食特产 - 海鲜盛宴'
                    };
                    
                    if (titles[sectionId]) {
                        document.title = titles[sectionId];
                    }
                }
            });
        }, { threshold: 0.5 });
        
        sections.forEach(section => observer.observe(section));
    }
    
    // 添加面包屑导航
    addBreadcrumbs() {
        const breadcrumbs = document.createElement('nav');
        breadcrumbs.className = 'fixed top-16 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm z-40 hidden md:block';
        breadcrumbs.innerHTML = `
            <ol class="flex items-center space-x-2 text-sm">
                <li><a href="#hero" class="text-ocean-blue hover:underline">首页</a></li>
                <li class="text-gray-400">/</li>
                <li id="current-section" class="text-gray-600">霞浦之美</li>
            </ol>
        `;
        
        document.body.appendChild(breadcrumbs);
        
        // 更新当前位置
        const sections = document.querySelectorAll('section[id]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionNames = {
                        'hero': '霞浦之美',
                        'scenery': '自然风光',
                        'culture': '渔业文化',
                        'photography': '摄影天堂',
                        'food': '美食特产'
                    };
                    
                    const currentSection = document.getElementById('current-section');
                    if (currentSection && sectionNames[entry.target.id]) {
                        currentSection.textContent = sectionNames[entry.target.id];
                    }
                }
            });
        }, { threshold: 0.5 });
        
        sections.forEach(section => observer.observe(section));
    }
}

// 初始化所有优化模块
document.addEventListener('DOMContentLoaded', () => {
    const performanceOptimizer = new PerformanceOptimizer();
    const uxEnhancer = new UXEnhancer();
    const seoOptimizer = new SEOOptimizer();
    
    console.log('🚀 性能优化模块已启动');
    console.log('✨ 用户体验增强已启动');
    console.log('🔍 SEO优化已启动');
});

// 导出模块（如果需要）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PerformanceOptimizer,
        UXEnhancer,
        SEOOptimizer
    };
}
