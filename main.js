// 主要的JavaScript功能模块

// 图片管理系统已在 image-manager.js 中实现

// 天气API集成
class WeatherService {
    constructor() {
        this.apiKey = 'demo'; // 演示用
        this.location = '霞浦县';
        this.cache = new Map();
        this.cacheTimeout = 30 * 60 * 1000; // 30分钟缓存
    }
    
    async getCurrentWeather() {
        const cacheKey = `weather_${this.location}`;
        const cached = this.cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }
        
        try {
            // 模拟API调用（实际项目中应该调用真实的天气API）
            const weatherData = await this.simulateWeatherAPI();
            
            this.cache.set(cacheKey, {
                data: weatherData,
                timestamp: Date.now()
            });
            
            return weatherData;
        } catch (error) {
            console.error('获取天气信息失败:', error);
            return this.getDefaultWeather();
        }
    }
    
    async simulateWeatherAPI() {
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const conditions = ['晴天', '多云', '阴天', '小雨'];
        const temperatures = [28, 30, 32, 34, 36];
        const windDirections = ['东风', '南风', '西风', '北风'];
        const windSpeeds = ['3-4级', '4-5级', '5-6级'];
        
        return {
            condition: conditions[Math.floor(Math.random() * conditions.length)],
            temperature: temperatures[Math.floor(Math.random() * temperatures.length)],
            windDirection: windDirections[Math.floor(Math.random() * windDirections.length)],
            windSpeed: windSpeeds[Math.floor(Math.random() * windSpeeds.length)],
            humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
            icon: '☀️'
        };
    }
    
    getDefaultWeather() {
        return {
            condition: '晴天',
            temperature: 32,
            windDirection: '南风',
            windSpeed: '5-6级',
            humidity: 60,
            icon: '☀️'
        };
    }
}

// 用户体验增强：加载状态管理
class LoadingManager {
    constructor() {
        this.loadingStates = new Set();
    }
    
    showLoading(key, element) {
        this.loadingStates.add(key);
        if (element) {
            element.classList.add('loading');
            this.addLoadingSkeleton(element);
        }
    }
    
    hideLoading(key, element) {
        this.loadingStates.delete(key);
        if (element) {
            element.classList.remove('loading');
            this.removeLoadingSkeleton(element);
        }
    }
    
    addLoadingSkeleton(element) {
        const skeleton = document.createElement('div');
        skeleton.className = 'loading-skeleton absolute inset-0 rounded';
        skeleton.setAttribute('data-loading-skeleton', '');
        element.style.position = 'relative';
        element.appendChild(skeleton);
    }
    
    removeLoadingSkeleton(element) {
        const skeleton = element.querySelector('[data-loading-skeleton]');
        if (skeleton) {
            skeleton.remove();
        }
    }
    
    isLoading(key) {
        return this.loadingStates.has(key);
    }
}

// 全局实例
// 懒加载已迁移到 image-manager.js
const weatherService = new WeatherService();
const loadingManager = new LoadingManager();

// 打开腾讯地图
function openInteractiveMap() {
    // 使用更准确的腾讯地图URL格式，直接定位到霞浦县政府位置
    const lat = 26.885702;
    const lng = 120.005141;
    const name = encodeURIComponent('霞浦县');
    const addr = encodeURIComponent('福建省宁德市霞浦县');
    
    // 使用腾讯地图的标准URL格式，确保能直接跳转到指定位置
    const mapUrl = `https://apis.map.qq.com/uri/v1/marker?marker=coord:${lat},${lng};title:${name};addr:${addr}&referer=霞浦宣传网`;
    
    // 备用URL格式，如果上面的不工作则使用这个
    const backupUrl = `https://map.qq.com/m/place/detail?searchtype=nav&type=nav&c=350921&x=${lng}&y=${lat}&name=${name}&addr=${addr}`;
    
    // 尝试打开主URL，如果失败则使用备用URL
    try {
        window.open(mapUrl, '_blank');
    } catch (error) {
        console.log('使用备用地图URL');
        window.open(backupUrl, '_blank');
    }
}

// 打开百度地图
function openBaiduMap() {
    // 使用百度地图的坐标定位功能，直接跳转到霞浦县位置
    const lat = 26.885702;
    const lng = 120.005141;
    const name = encodeURIComponent('霞浦县');
    
    // 百度地图URL格式，使用坐标直接定位
    const mapUrl = `https://map.baidu.com/?newmap=1&ie=utf-8&s=con%26wd%3D${name}%26c%3D350921%26src%3D0&l=12&lat=${lat}&lng=${lng}`;
    
    // 备用URL格式
    const backupUrl = `https://map.baidu.com/?newmap=1&ie=utf-8&s=s%26wd%3D霞浦县`;
    
    try {
        window.open(mapUrl, '_blank');
    } catch (error) {
        console.log('使用备用百度地图URL');
        window.open(backupUrl, '_blank');
    }
}

// 初始化事件委托（地图按钮和景点卡片）
function initEventDelegation() {
    // 使用事件委托处理动态创建的按钮和景点卡片
    document.addEventListener('click', function(e) {
        // 处理地图按钮点击
        const button = e.target.closest('button[data-map-action]');
        if (button) {
            e.preventDefault();
            const action = button.getAttribute('data-map-action');
            if (action === 'tencent') {
                openInteractiveMap();
            } else if (action === 'baidu') {
                openBaiduMap();
            }
            return;
        }
        
        // 处理景点卡片点击
        const attractionCard = e.target.closest('[data-attraction]');
        if (attractionCard) {
            e.preventDefault();
            const attraction = attractionCard.getAttribute('data-attraction');
            if (attraction) {
                showAttractionDetail(attraction);
            }
            return;
        }
        
        // 处理景点地图按钮点击
        const attractionMapButton = e.target.closest('button[data-attraction-map]');
        if (attractionMapButton) {
            e.preventDefault();
            const attraction = attractionMapButton.getAttribute('data-attraction-map');
            if (attraction) {
                openAttractionMap(attraction);
            }
            return;
        }
        
        // 处理模态框关闭按钮点击
        const modalCloseButton = e.target.closest('[data-modal-close]');
        if (modalCloseButton) {
            e.preventDefault();
            closeModal(modalCloseButton);
            return;
        }
        
        // 处理复制按钮点击
        const copyButton = e.target.closest('button[data-copy-text]');
        if (copyButton) {
            e.preventDefault();
            const textToCopy = copyButton.getAttribute('data-copy-text');
            if (textToCopy) {
                copyToClipboard(textToCopy);
            }
            return;
        }
        
        // 处理分享按钮点击
        const shareButton = e.target.closest('button[data-share-platform]');
        if (shareButton) {
            e.preventDefault();
            const platform = shareButton.getAttribute('data-share-platform');
            if (platform === 'wechat') {
                shareToWeChat();
            } else if (platform === 'weibo') {
                shareToWeibo();
            } else if (platform === 'qq') {
                shareToQQ();
            }
            return;
        }
    });
}

// 图片状态统计已迁移到 image-manager.js

// 更新图片状态统计
function updateImageStats() {
    const statusElement = document.getElementById('image-status');
    if (statusElement && imageStats.fallback > 0) {
        statusElement.innerHTML = `
            <div class="flex items-center space-x-2 text-sm text-yellow-600 bg-yellow-50 px-3 py-2 rounded-lg">
                <i class="fas fa-exclamation-triangle"></i>
                <span>${imageStats.fallback} 张图片使用备用资源</span>
                <button onclick="retryAllFailedImages()" class="text-yellow-700 hover:text-yellow-800 underline">
                    重试全部
                </button>
            </div>
        `;
        statusElement.style.display = 'block';
    } else if (statusElement) {
        statusElement.style.display = 'none';
    }
}

// 重试所有失败的图片
function retryAllFailedImages() {
    const failedImages = document.querySelectorAll('img[data-original-src]');
    let retryCount = 0;
    
    failedImages.forEach(img => {
        const originalSrc = img.getAttribute('data-original-src');
        if (originalSrc && img.src !== originalSrc) {
            img.style.filter = '';
            img.style.cursor = '';
            img.title = '';
            img.onclick = null;
            img.onerror = () => handleImageError(img);
            img.src = originalSrc;
            
            // 移除重试图标
            const retryIcon = img.parentElement.querySelector('.retry-icon');
            if (retryIcon) {
                retryIcon.remove();
            }
            
            retryCount++;
        }
    });
    
    if (retryCount > 0) {
        imageStats.fallback = 0;
        updateImageStats();
        showNotification(`正在重新加载 ${retryCount} 张图片...`, 'info');
    }
}

// 为所有现有图片添加错误处理
function initImageErrorHandling() {
    const allImages = document.querySelectorAll('img');
    imageStats.total = allImages.length;
    
    allImages.forEach(img => {
        // 如果图片还没有错误处理器，添加一个
        if (!img.onerror) {
            img.onerror = () => handleImageError(img);
        }
        
        // 检查图片是否已经加载失败
        if (img.complete && img.naturalWidth === 0) {
            handleImageError(img);
        }
    });
    
    // 创建状态显示元素
    if (!document.getElementById('image-status')) {
        const statusDiv = document.createElement('div');
        statusDiv.id = 'image-status';
        statusDiv.className = 'fixed bottom-4 left-4 z-50';
        statusDiv.style.display = 'none';
        document.body.appendChild(statusDiv);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    initSmoothScroll();
    initMobileMenu();
    initParallaxEffect();
    // 图片懒加载功能已集成到 ImageManager 类中，自动初始化
    // 图片错误处理已迁移到 image-manager.js
    initEventDelegation();
});

// 滚动动画初始化
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // 观察所有需要动画的元素
    const animatedElements = document.querySelectorAll('.fade-in');
    animatedElements.forEach(el => observer.observe(el));
}

// 平滑滚动
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // 考虑导航栏高度
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 移动端菜单切换函数（全局）
function toggleMobileMenu() {
    const mobileMenuBtn = document.querySelector('.md\\:hidden button');
    const navMenu = document.querySelector('nav .hidden.md\\:flex');
    
    if (mobileMenuBtn && navMenu) {
        try {
            navMenu.classList.toggle('hidden');
            navMenu.classList.toggle('flex');
            navMenu.classList.toggle('flex-col');
            navMenu.classList.toggle('absolute');
            navMenu.classList.toggle('top-16');
            navMenu.classList.toggle('left-0');
            navMenu.classList.toggle('w-full');
            navMenu.classList.toggle('bg-white');
            navMenu.classList.toggle('shadow-lg');
            navMenu.classList.toggle('p-4');
            navMenu.classList.toggle('z-50');
            
            // 更新按钮状态
            const isOpen = !navMenu.classList.contains('hidden');
            mobileMenuBtn.setAttribute('aria-expanded', isOpen);
            
            // 防止背景滚动
            if (isOpen) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        } catch (error) {
            console.warn('移动端菜单切换失败:', error);
        }
    }
}

// 移动端菜单初始化
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.md\\:hidden button');
    const navMenu = document.querySelector('nav .hidden.md\\:flex');
    
    if (mobileMenuBtn && navMenu) {
        // 添加触摸支持
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        mobileMenuBtn.addEventListener('touchend', function(e) {
            e.preventDefault();
            toggleMobileMenu();
        });
        
        // 点击外部关闭菜单
        document.addEventListener('click', function(e) {
            if (!mobileMenuBtn.contains(e.target) && !navMenu.contains(e.target)) {
                if (!navMenu.classList.contains('hidden')) {
                    toggleMobileMenu();
                }
            }
        });
    }
}

// 视差效果
function initParallaxEffect() {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// 备用图片池已迁移到 image-manager.js

// 图片错误处理已迁移到 image-manager.js

// 重试图标功能已迁移到 image-manager.js

// 图片懒加载已迁移到 image-manager.js

// 导航栏滚动效果
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    const scrolled = window.pageYOffset;
    
    if (scrolled > 100) {
        nav.classList.add('bg-white/95');
        nav.classList.remove('bg-white/90');
    } else {
        nav.classList.add('bg-white/90');
        nav.classList.remove('bg-white/95');
    }
});

// 按钮点击效果
document.addEventListener('click', function(e) {
    // 英雄区域按钮
    if (e.target.closest('.bg-sunset-orange')) {
        e.preventDefault();
        document.querySelector('#scenery').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
    
    // 查看地图按钮 - 优先检查，避免与其他按钮冲突
    if (e.target.textContent.includes('查看地图') || 
        (e.target.closest('button') && e.target.closest('button').textContent.includes('查看地图'))) {
        e.preventDefault();
        e.stopPropagation();
        showMapModal();
        return;
    }
    
    // 观看视频按钮
    if (e.target.textContent.includes('观看视频') || 
        (e.target.closest('button') && e.target.closest('button').textContent.includes('观看视频'))) {
        e.preventDefault();
        e.stopPropagation();
        showVideoModal();
        return;
    }
    
    // 联系我们按钮
    if (e.target.textContent.includes('联系我们') || 
        (e.target.closest('button') && e.target.closest('button').textContent.includes('联系我们'))) {
        e.preventDefault();
        e.stopPropagation();
        showContactModal();
        return;
    }
});

// 显示视频模态框
function showVideoModal() {
    const modal = createModal('霞浦视频集锦', `
        <div class="space-y-6">
            <!-- 主视频播放区域 -->
            <div class="aspect-video bg-black rounded-lg overflow-hidden relative">
                <canvas id="mainVideoCanvas" class="w-full h-full object-cover cursor-pointer"></canvas>
                <div class="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    <i class="fas fa-play mr-1"></i>霞浦滩涂日出
                </div>
                <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <button id="playPauseBtn" class="bg-black/70 text-white px-4 py-2 rounded-full hover:bg-black/90 transition-all">
                        <i class="fas fa-play mr-2"></i>播放
                    </button>
                    <div class="text-white text-sm bg-black/70 px-3 py-1 rounded-full">
                        动态生成视频
                    </div>
                </div>
            </div>
            
            <!-- 视频播放列表 -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="video-item cursor-pointer bg-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-all" 
                     data-scene="sunrise"
                     data-title="霞浦滩涂日出">
                    <div class="aspect-video relative">
                        <img src="https://zhiyan-ai-agent-with-1258344702.cos.ap-guangzhou.tencentcos.cn/with/43557910-28c6-49b9-9f40-77c6b1b3a552/image_1754559652_1_1.jpg" 
                             alt="霞浦滩涂日出" class="w-full h-full object-cover" data-image-type="landscape" onerror="handleImageError(this)">
                        <div class="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <i class="fas fa-play-circle text-white text-3xl"></i>
                        </div>
                        <div class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                            动画
                        </div>
                    </div>
                    <div class="p-3">
                        <h4 class="font-semibold text-gray-800 text-sm">霞浦滩涂日出</h4>
                        <p class="text-xs text-gray-600 mt-1">金色阳光洒向大地</p>
                    </div>
                </div>
                
                <div class="video-item cursor-pointer bg-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-all"
                     data-scene="fishing"
                     data-title="海上牧场">
                    <div class="aspect-video relative">
                        <img src="https://zhiyan-ai-agent-with-1258344702.cos.ap-guangzhou.tencentcos.cn/with/2ae33763-0a7c-4763-815a-9a6615d6c58e/image_1754559698_2_1.jpg" 
                             alt="渔民劳作" class="w-full h-full object-cover" data-image-type="landscape" onerror="handleImageError(this)">
                        <div class="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <i class="fas fa-play-circle text-white text-3xl"></i>
                        </div>
                        <div class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                            动画
                        </div>
                    </div>
                    <div class="p-3">
                        <h4 class="font-semibold text-gray-800 text-sm">海上牧场</h4>
                        <p class="text-xs text-gray-600 mt-1">渔民的勤劳与智慧</p>
                    </div>
                </div>
                
                <div class="video-item cursor-pointer bg-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-all"
                     data-scene="photography"
                     data-title="摄影天堂">
                    <div class="aspect-video relative">
                        <img src="https://zhiyan-ai-agent-with-1258344702.cos.ap-guangzhou.tencentcos.cn/with/39621b3d-098c-4bc7-b96f-814fef7c43de/image_1754559659_1_1.jpg" 
                             alt="霞浦风光" class="w-full h-full object-cover" data-image-type="landscape" onerror="handleImageError(this)">
                        <div class="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <i class="fas fa-play-circle text-white text-3xl"></i>
                        </div>
                        <div class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                            动画
                        </div>
                    </div>
                    <div class="p-3">
                        <h4 class="font-semibold text-gray-800 text-sm">摄影天堂</h4>
                        <p class="text-xs text-gray-600 mt-1">捕捉美丽瞬间</p>
                    </div>
                </div>
            </div>
            
            <!-- 视频描述 -->
            <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-semibold text-gray-800 mb-2">
                    <i class="fas fa-info-circle text-blue-500 mr-2"></i>关于这些视频
                </h4>
                <p class="text-sm text-gray-600 leading-relaxed">
                    这些视频展现了霞浦最美的瞬间：清晨的第一缕阳光洒向滩涂，勤劳的渔民在海上牧场中劳作，
                    摄影师们用镜头捕捉着这片土地的独特魅力。每一帧画面都诉说着霞浦的故事。
                </p>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
    
    // 初始化Canvas视频生成器
    const canvas = modal.querySelector('#mainVideoCanvas');
    let videoGenerator = null;
    let currentScene = 'sunrise';
    let isPlaying = false;
    
    // 先获取按钮元素
    const playPauseBtn = modal.querySelector('#playPauseBtn');
    
    function updatePlayButton() {
        if (playPauseBtn) {
            if (isPlaying) {
                playPauseBtn.innerHTML = '<i class="fas fa-pause mr-2"></i>暂停';
            } else {
                playPauseBtn.innerHTML = '<i class="fas fa-play mr-2"></i>播放';
            }
        }
    }
    
    function initVideoGenerator() {
        videoGenerator = new XiapuVideoGenerator(canvas);
        videoGenerator.play(currentScene);
        isPlaying = true;
        updatePlayButton();
    }
    
    // 播放/暂停按钮功能
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', function() {
            if (!videoGenerator) return;
            
            if (isPlaying) {
                videoGenerator.stop();
                isPlaying = false;
            } else {
                videoGenerator.play(currentScene);
                isPlaying = true;
            }
            updatePlayButton();
        });
    }
    
    // 动态加载视频生成器
    if (typeof XiapuVideoGenerator === 'undefined') {
        const script = document.createElement('script');
        script.src = 'video-generator.js';
        script.onload = function() {
            initVideoGenerator();
        };
        document.head.appendChild(script);
    } else {
        initVideoGenerator();
    }
    
    // 添加视频切换功能
    const videoItems = modal.querySelectorAll('.video-item');
    
    videoItems.forEach(item => {
        item.addEventListener('click', function() {
            const scene = this.dataset.scene;
            const title = this.dataset.title;
            
            if (!videoGenerator) return;
            
            // 停止当前动画
            videoGenerator.stop();
            currentScene = scene;
            
            // 更新标题
            const titleElement = modal.querySelector('.absolute.top-4.left-4');
            titleElement.innerHTML = `<i class="fas fa-play mr-1"></i>${title}`;
            
            // 高亮当前选中的视频
            videoItems.forEach(v => v.classList.remove('ring-2', 'ring-blue-500'));
            this.classList.add('ring-2', 'ring-blue-500');
            
            // 播放新场景
            videoGenerator.play(currentScene);
            isPlaying = true;
            updatePlayButton();
        });
    });
    
    // 默认选中第一个视频
    videoItems[0].classList.add('ring-2', 'ring-blue-500');
    
    // 添加全屏按钮
    const fullscreenBtn = document.createElement('button');
    fullscreenBtn.className = 'absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm hover:bg-black/90 transition-all';
    fullscreenBtn.innerHTML = '<i class="fas fa-expand mr-1"></i>全屏';
    canvas.parentElement.appendChild(fullscreenBtn);
    
    fullscreenBtn.addEventListener('click', function() {
        if (canvas.requestFullscreen) {
            canvas.requestFullscreen();
        } else if (canvas.webkitRequestFullscreen) {
            canvas.webkitRequestFullscreen();
        } else if (canvas.msRequestFullscreen) {
            canvas.msRequestFullscreen();
        }
    });
    
    // Canvas点击播放/暂停
    canvas.addEventListener('click', function() {
        if (!videoGenerator) return;
        
        if (isPlaying) {
            videoGenerator.stop();
            isPlaying = false;
        } else {
            videoGenerator.play(currentScene);
            isPlaying = true;
        }
        updatePlayButton();
    });
    
    // 模态框关闭时停止动画
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            if (videoGenerator) {
                videoGenerator.stop();
            }
            modal.remove();
        }
    });
}

// 显示联系模态框
function showContactModal() {
    const modal = createModal('联系我们', `
        <div class="space-y-4">
            <div class="flex items-center p-4 bg-gray-50 rounded-lg">
                <i class="fas fa-phone text-ocean-blue text-xl mr-4"></i>
                <div>
                    <h4 class="font-semibold text-gray-800">旅游咨询热线</h4>
                    <p class="text-gray-600">400-123-4567</p>
                </div>
            </div>
            <div class="flex items-center p-4 bg-gray-50 rounded-lg">
                <i class="fas fa-envelope text-ocean-blue text-xl mr-4"></i>
                <div>
                    <h4 class="font-semibold text-gray-800">邮箱地址</h4>
                    <p class="text-gray-600">info@xiapu-tourism.com</p>
                </div>
            </div>
            <div class="flex items-center p-4 bg-gray-50 rounded-lg">
                <i class="fas fa-map-marker-alt text-ocean-blue text-xl mr-4"></i>
                <div>
                    <h4 class="font-semibold text-gray-800">地址</h4>
                    <p class="text-gray-600">福建省宁德市霞浦县</p>
                </div>
            </div>
            <div class="flex items-center p-4 bg-gray-50 rounded-lg">
                <i class="fas fa-clock text-ocean-blue text-xl mr-4"></i>
                <div>
                    <h4 class="font-semibold text-gray-800">服务时间</h4>
                    <p class="text-gray-600">周一至周日 8:00-18:00</p>
                </div>
            </div>
        </div>
    `);
    document.body.appendChild(modal);
}

// 显示地图模态框
function showMapModal() {
    const modal = createModal('霞浦地理位置与景点分布', `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- 地理信息卡片 -->
            <div class="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6">
                <div class="flex items-center mb-4">
                    <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                        <i class="fas fa-map-marker-alt text-white text-xl"></i>
                    </div>
                    <div>
                        <h3 class="text-lg font-bold text-gray-800">地理坐标</h3>
                        <p class="text-sm text-gray-600">精确定位信息</p>
                    </div>
                </div>
                <div class="space-y-3">
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">纬度</span>
                        <span class="font-mono text-blue-600 font-semibold">26.885971°N</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">经度</span>
                        <span class="font-mono text-blue-600 font-semibold">120.005267°E</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">行政区划</span>
                        <span class="text-gray-800 font-semibold">350921</span>
                    </div>
                </div>
            </div>

            <!-- 天气信息卡片 -->
            <div class="bg-gradient-to-br from-orange-50 to-yellow-100 rounded-xl p-6">
                <div class="flex items-center mb-4">
                    <div class="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mr-4">
                        <i class="fas fa-sun text-white text-xl"></i>
                    </div>
                    <div>
                        <h3 class="text-lg font-bold text-gray-800">实时天气</h3>
                        <p class="text-sm text-gray-600">当前气象状况</p>
                    </div>
                </div>
                <div class="space-y-3">
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">天气</span>
                        <span class="text-orange-600 font-semibold">☀️ 晴天</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">温度</span>
                        <span class="text-2xl font-bold text-orange-600">34°C</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">风向风力</span>
                        <span class="text-gray-800 font-semibold">南风 5-6级</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">湿度</span>
                        <span class="text-gray-800 font-semibold">60%</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 主要景点分布 -->
        <div class="mt-6">
            <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <i class="fas fa-camera text-blue-500 mr-3"></i>
                主要景点分布
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer" data-attraction="滩涂">
                    <div class="flex items-start">
                        <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                            <i class="fas fa-water text-blue-600"></i>
                        </div>
                        <div class="flex-1">
                            <h4 class="font-semibold text-gray-800">霞浦滩涂</h4>
                            <p class="text-sm text-gray-600 mb-2">松山街道北岐村</p>
                            <div class="text-xs text-gray-500 mb-2">
                                <span class="mr-3">📍 26.877897°N, 120.063112°E</span>
                            </div>
                            <div class="flex items-center text-xs">
                                <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full mr-2">摄影胜地</span>
                                <span class="text-gray-500">点击查看详情</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-yellow-300 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer" data-attraction="沙滩">
                    <div class="flex items-start">
                        <div class="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                            <i class="fas fa-umbrella-beach text-yellow-600"></i>
                        </div>
                        <div class="flex-1">
                            <h4 class="font-semibold text-gray-800">大京沙滩</h4>
                            <p class="text-sm text-gray-600 mb-2">霞浦东方红接待中心东北</p>
                            <div class="text-xs text-gray-500 mb-2">
                                <span class="mr-3">📍 26.696582°N, 120.109509°E</span>
                            </div>
                            <div class="flex items-center text-xs">
                                <span class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full mr-2">海滨度假</span>
                                <span class="text-gray-500">点击查看详情</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-green-300 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer" data-attraction="杨家溪">
                    <div class="flex items-start">
                        <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                            <i class="fas fa-tree text-green-600"></i>
                        </div>
                        <div class="flex-1">
                            <h4 class="font-semibold text-gray-800">杨家溪景区</h4>
                            <p class="text-sm text-gray-600 mb-2">牙城镇杨家溪村</p>
                            <div class="text-xs text-gray-500 mb-2">
                                <span class="mr-3">📍 27.015762°N, 120.147296°E</span>
                            </div>
                            <div class="flex items-center text-xs">
                                <span class="bg-green-100 text-green-800 px-2 py-1 rounded-full mr-2">生态旅游</span>
                                <span class="text-gray-500">点击查看详情</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-purple-300 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer" data-attraction="赤岸">
                    <div class="flex items-start">
                        <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                            <i class="fas fa-mountain text-purple-600"></i>
                        </div>
                        <div class="flex-1">
                            <h4 class="font-semibold text-gray-800">赤岸风景区</h4>
                            <p class="text-sm text-gray-600 mb-2">973县道附近</p>
                            <div class="text-xs text-gray-500 mb-2">
                                <span class="mr-3">📍 26.900230°N, 120.052430°E</span>
                            </div>
                            <div class="flex items-center text-xs">
                                <span class="bg-purple-100 text-purple-800 px-2 py-1 rounded-full mr-2">自然风光</span>
                                <span class="text-gray-500">点击查看详情</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 交通指南 -->
        <div class="mt-6 bg-gray-50 rounded-xl p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <i class="fas fa-route text-green-500 mr-3"></i>
                交通指南
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="text-center">
                    <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <i class="fas fa-train text-blue-600 text-2xl"></i>
                    </div>
                    <h4 class="font-semibold text-gray-800 mb-2">高铁出行</h4>
                    <p class="text-sm text-gray-600">福州-霞浦 约2小时</p>
                    <p class="text-xs text-gray-500 mt-1">动车组直达，班次频繁</p>
                </div>
                <div class="text-center">
                    <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <i class="fas fa-car text-green-600 text-2xl"></i>
                    </div>
                    <h4 class="font-semibold text-gray-800 mb-2">自驾出行</h4>
                    <p class="text-sm text-gray-600">沈海高速霞浦出口</p>
                    <p class="text-xs text-gray-500 mt-1">全程高速，路况良好</p>
                </div>
                <div class="text-center">
                    <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <i class="fas fa-plane text-orange-600 text-2xl"></i>
                    </div>
                    <h4 class="font-semibold text-gray-800 mb-2">航空出行</h4>
                    <p class="text-sm text-gray-600">福州机场转高铁</p>
                    <p class="text-xs text-gray-500 mt-1">机场大巴+动车组</p>
                </div>
            </div>
        </div>

        <!-- 地图可视化 -->
        <div class="mt-6">
            <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <i class="fas fa-globe-asia text-green-500 mr-3"></i>
                位置示意图
            </h3>
            <div class="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-6">
                <canvas id="mapCanvas" width="600" height="400" class="w-full h-auto border border-gray-200 rounded-lg shadow-inner"></canvas>
            </div>
        </div>

        <!-- 互动地图按钮 -->
        <div class="mt-6 text-center space-x-4">
            <button data-map-action="tencent" class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                <i class="fas fa-external-link-alt mr-2"></i>
                打开腾讯地图
            </button>
            <button data-map-action="baidu" class="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-full font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                <i class="fas fa-map mr-2"></i>
                打开百度地图
            </button>
        </div>
    `);
    document.body.appendChild(modal);
}

// 这些函数已在文件开头定义，此处移除重复定义

// 绘制地图Canvas
function drawMapCanvas() {
    const canvas = document.getElementById('mapCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // 清空画布
    ctx.clearRect(0, 0, width, height);
    
    // 绘制背景渐变
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#e0f2fe');
    gradient.addColorStop(0.5, '#bae6fd');
    gradient.addColorStop(1, '#7dd3fc');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // 绘制海岸线（简化的福建海岸）
    ctx.strokeStyle = '#0369a1';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.quadraticCurveTo(200, 80, 300, 120);
    ctx.quadraticCurveTo(400, 140, 500, 180);
    ctx.quadraticCurveTo(520, 220, 480, 280);
    ctx.quadraticCurveTo(450, 320, 400, 340);
    ctx.stroke();
    
    // 绘制陆地区域
    ctx.fillStyle = '#22c55e';
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.quadraticCurveTo(200, 80, 300, 120);
    ctx.quadraticCurveTo(400, 140, 500, 180);
    ctx.quadraticCurveTo(520, 220, 480, 280);
    ctx.quadraticCurveTo(450, 320, 400, 340);
    ctx.lineTo(400, 400);
    ctx.lineTo(100, 400);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
    
    // 绘制霞浦位置标记
    const xiaopuX = 320;
    const xiaopuY = 200;
    
    // 位置标记圆圈动画
    const time = Date.now() * 0.003;
    for (let i = 0; i < 3; i++) {
        ctx.strokeStyle = `rgba(239, 68, 68, ${0.8 - i * 0.2})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(xiaopuX, xiaopuY, 15 + i * 10 + Math.sin(time + i) * 5, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    // 主标记点
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(xiaopuX, xiaopuY, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // 标记文字
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('霞浦县', xiaopuX, xiaopuY - 25);
    
    // 绘制主要景点
    const attractions = [
        { name: '滩涂', x: 300, y: 180, color: '#3b82f6' },
        { name: '大京沙滩', x: 380, y: 160, color: '#f59e0b' },
        { name: '杨家溪', x: 360, y: 140, color: '#10b981' },
        { name: '赤岸', x: 340, y: 190, color: '#8b5cf6' }
    ];
    
    attractions.forEach(attraction => {
        // 景点标记
        ctx.fillStyle = attraction.color;
        ctx.beginPath();
        ctx.arc(attraction.x, attraction.y, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // 景点名称
        ctx.fillStyle = '#374151';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(attraction.name, attraction.x, attraction.y - 10);
    });
    
    // 绘制坐标信息
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('纬度: 26.885971°N', 20, height - 40);
    ctx.fillText('经度: 120.005267°E', 20, height - 20);
    
    // 绘制指北针
    const compassX = width - 60;
    const compassY = 60;
    
    // 指北针背景
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.beginPath();
    ctx.arc(compassX, compassY, 25, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(compassX, compassY, 25, 0, Math.PI * 2);
    ctx.stroke();
    
    // 指北针箭头
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(compassX, compassY - 15);
    ctx.lineTo(compassX - 5, compassY + 5);
    ctx.lineTo(compassX + 5, compassY + 5);
    ctx.closePath();
    ctx.fill();
    
    // N字母
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('N', compassX, compassY - 30);
    
    // 请求下一帧动画
    requestAnimationFrame(drawMapCanvas);
}

// 显示景点详情
function showAttractionDetail(attraction) {
    const attractionData = {
        '滩涂': {
            title: '霞浦滩涂',
            description: '世界级摄影胜地，以其独特的滩涂风光和渔民劳作场景闻名于世',
            features: ['日出日落', '渔民劳作', '海上牧场', '光影艺术'],
            bestTime: '4-6月、9-11月',
            tips: '最佳拍摄时间为日出前后1小时',
            color: 'blue'
        },
        '沙滩': {
            title: '大京沙滩',
            description: '霞浦最美的海滨沙滩，拥有细腻的沙质和清澈的海水',
            features: ['海滨浴场', '沙滩运动', '海鲜美食', '度假休闲'],
            bestTime: '5-10月',
            tips: '夏季是最佳游泳季节，注意防晒',
            color: 'yellow'
        },
        '杨家溪': {
            title: '杨家溪景区',
            description: '被誉为"海国桃源"，以古榕群和溪流风光著称',
            features: ['千年古榕', '溪流漂流', '生态徒步', '民俗文化'],
            bestTime: '全年适宜',
            tips: '春秋季节风景最佳，适合徒步',
            color: 'green'
        },
        '赤岸': {
            title: '赤岸风景区',
            description: '以红色岩石海岸和独特地质景观为特色的自然风景区',
            features: ['红色岩石', '海蚀地貌', '观景台', '地质奇观'],
            bestTime: '4-11月',
            tips: '注意安全，部分区域岩石湿滑',
            color: 'purple'
        }
    };
    
    const data = attractionData[attraction];
    if (!data) return;
    
    const colorClasses = {
        blue: 'from-blue-500 to-indigo-600',
        yellow: 'from-yellow-500 to-orange-600',
        green: 'from-green-500 to-emerald-600',
        purple: 'from-purple-500 to-violet-600'
    };
    
    const modal = createModal(data.title + ' - 详细信息', `
        <div class="space-y-6">
            <div class="bg-gradient-to-r ${colorClasses[data.color]} text-white rounded-xl p-6">
                <h3 class="text-2xl font-bold mb-2">${data.title}</h3>
                <p class="text-white/90">${data.description}</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-gray-50 rounded-lg p-4">
                    <h4 class="font-semibold text-gray-800 mb-3 flex items-center">
                        <i class="fas fa-star text-yellow-500 mr-2"></i>
                        主要特色
                    </h4>
                    <div class="space-y-2">
                        ${data.features.map(feature => `
                            <div class="flex items-center">
                                <i class="fas fa-check text-green-500 mr-2"></i>
                                <span class="text-gray-700">${feature}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="bg-gray-50 rounded-lg p-4">
                    <h4 class="font-semibold text-gray-800 mb-3 flex items-center">
                        <i class="fas fa-calendar text-blue-500 mr-2"></i>
                        游览信息
                    </h4>
                    <div class="space-y-3">
                        <div>
                            <span class="text-sm text-gray-600">最佳时间：</span>
                            <span class="font-medium text-gray-800">${data.bestTime}</span>
                        </div>
                        <div>
                            <span class="text-sm text-gray-600">温馨提示：</span>
                            <p class="text-sm text-gray-700 mt-1">${data.tips}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="text-center">
                <button data-attraction-map="${attraction}" class="bg-gradient-to-r ${colorClasses[data.color]} text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all duration-300">
                    <i class="fas fa-map-marker-alt mr-2"></i>
                    在地图中查看
                </button>
            </div>
        </div>
    `);
    document.body.appendChild(modal);
}

// 在地图中打开特定景点
function openAttractionMap(attraction) {
    const coordinates = {
        '滩涂': { lat: 26.877897, lng: 120.063112, name: '霞浦滩涂' },
        '沙滩': { lat: 26.696582, lng: 120.109509, name: '大京沙滩' },
        '杨家溪': { lat: 27.015762, lng: 120.147296, name: '杨家溪景区' },
        '赤岸': { lat: 26.900230, lng: 120.052430, name: '赤岸风景区' }
    };
    
    const coord = coordinates[attraction];
    if (coord) {
        const name = encodeURIComponent(coord.name);
        const addr = encodeURIComponent(`福建省宁德市霞浦县${coord.name}`);
        
        // 使用腾讯地图的标准URI API格式，确保能直接定位到景点
        const mapUrl = `https://apis.map.qq.com/uri/v1/marker?marker=coord:${coord.lat},${coord.lng};title:${name};addr:${addr}&referer=霞浦宣传网`;
        
        // 备用URL格式
        const backupUrl = `https://map.qq.com/m/place/detail?searchtype=nav&type=nav&c=350921&x=${coord.lng}&y=${coord.lat}&name=${name}&addr=${addr}`;
        
        // 尝试打开主URL，如果失败则使用备用URL
        try {
            window.open(mapUrl, '_blank');
        } catch (error) {
            console.log('使用备用景点地图URL');
            window.open(backupUrl, '_blank');
        }
    }
}

// 创建模态框
function createModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 opacity-0 transition-opacity duration-300';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform scale-95 transition-transform duration-300 shadow-2xl">
            <div class="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                <h3 class="text-xl font-bold text-gray-800 flex items-center">
                    <i class="fas fa-map-marked-alt text-blue-500 mr-3"></i>
                    ${title}
                </h3>
                <button data-modal-close class="text-gray-400 hover:text-gray-600 text-2xl transition-colors duration-200 hover:bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="p-6">
                ${content}
            </div>
        </div>
    `;
    
    // 点击背景关闭模态框
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal(modal.querySelector('[data-modal-close]'));
        }
    });
    
    // 添加打开动画
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.querySelector('.bg-white').classList.remove('scale-95');
        modal.querySelector('.bg-white').classList.add('scale-100');
        
        // 如果是地图模态框，启动Canvas绘制
        if (modal.querySelector('#mapCanvas')) {
            setTimeout(() => {
                drawMapCanvas();
            }, 300);
        }
    }, 10);
    
    return modal;
}

// 关闭模态框动画
function closeModal(button) {
    const modal = button.closest('.fixed');
    modal.classList.add('opacity-0');
    modal.querySelector('.bg-white').classList.remove('scale-100');
    modal.querySelector('.bg-white').classList.add('scale-95');
    setTimeout(() => {
        modal.remove();
    }, 300);
}

// 卡片悬停效果增强
document.addEventListener('mouseenter', function(e) {
    if (e.target && e.target.closest && e.target.closest('.card-hover')) {
        const card = e.target.closest('.card-hover');
        card.style.transform = 'translateY(-8px) scale(1.02)';
    }
}, true);

document.addEventListener('mouseleave', function(e) {
    if (e.target && e.target.closest && e.target.closest('.card-hover')) {
        const card = e.target.closest('.card-hover');
        card.style.transform = 'translateY(0) scale(1)';
    }
}, true);

// 添加页面加载动画
window.addEventListener('load', function() {
    const loader = document.createElement('div');
    loader.className = 'fixed inset-0 bg-white flex items-center justify-center z-50';
    loader.innerHTML = `
        <div class="text-center">
            <div class="w-16 h-16 border-4 border-ocean-blue border-t-transparent rounded-full animate-spin mb-4"></div>
            <p class="text-gray-600">正在加载霞浦之美...</p>
        </div>
    `;
    
    document.body.appendChild(loader);
    
    setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.transition = 'opacity 0.5s ease';
        setTimeout(() => loader.remove(), 500);
    }, 1000);
});

// 添加滚动进度条
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'fixed top-0 left-0 h-1 bg-gradient-to-r from-ocean-blue to-sunset-orange z-50 transition-all duration-300';
    progressBar.style.width = '0%';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// 初始化滚动进度条
initScrollProgress();

// 添加返回顶部按钮
function initBackToTop() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'fixed bottom-8 right-8 w-12 h-12 bg-ocean-blue text-white rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 opacity-0 pointer-events-none z-40';
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTopBtn);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.pointerEvents = 'auto';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.pointerEvents = 'none';
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 初始化返回顶部按钮
initBackToTop();

// 添加浮动工具栏
function initFloatingToolbar() {
    const toolbar = document.createElement('div');
    toolbar.className = 'fixed bottom-8 left-8 flex flex-col space-y-3 z-40';
    
    // 天气按钮
    const weatherBtn = document.createElement('button');
    weatherBtn.className = 'w-12 h-12 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 hover:scale-110';
    weatherBtn.innerHTML = '<i class="fas fa-cloud-sun"></i>';
    weatherBtn.setAttribute('aria-label', '查看天气');
    weatherBtn.addEventListener('click', showWeatherModal);
    
    // 分享按钮
    const shareBtn = document.createElement('button');
    shareBtn.className = 'w-12 h-12 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-110';
    shareBtn.innerHTML = '<i class="fas fa-share-alt"></i>';
    shareBtn.setAttribute('aria-label', '分享页面');
    shareBtn.addEventListener('click', showShareModal);
    
    // 收藏按钮
    const favoriteBtn = document.createElement('button');
    favoriteBtn.className = 'w-12 h-12 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-all duration-300 hover:scale-110';
    favoriteBtn.innerHTML = '<i class="fas fa-heart"></i>';
    favoriteBtn.setAttribute('aria-label', '收藏页面');
    favoriteBtn.addEventListener('click', toggleFavorite);
    
    toolbar.appendChild(weatherBtn);
    toolbar.appendChild(shareBtn);
    toolbar.appendChild(favoriteBtn);
    document.body.appendChild(toolbar);
}

// 天气模态框
async function showWeatherModal() {
    loadingManager.showLoading('weather');
    
    try {
        const weather = await weatherService.getCurrentWeather();
        
        const modal = createModal('霞浦实时天气', `
            <div class="text-center">
                <div class="text-6xl mb-4">${weather.icon}</div>
                <div class="text-3xl font-bold text-gray-800 mb-2">${weather.temperature}°C</div>
                <div class="text-lg text-gray-600 mb-6">${weather.condition}</div>
                
                <div class="grid grid-cols-2 gap-4 text-sm">
                    <div class="bg-blue-50 p-3 rounded-lg">
                        <div class="text-blue-600 font-semibold">风向风力</div>
                        <div class="text-gray-800">${weather.windDirection} ${weather.windSpeed}</div>
                    </div>
                    <div class="bg-green-50 p-3 rounded-lg">
                        <div class="text-green-600 font-semibold">湿度</div>
                        <div class="text-gray-800">${weather.humidity}%</div>
                    </div>
                </div>
                
                <div class="mt-6 p-4 bg-yellow-50 rounded-lg">
                    <div class="text-yellow-800 text-sm">
                        <i class="fas fa-lightbulb mr-2"></i>
                        <strong>摄影建议：</strong>
                        ${weather.condition === '晴天' ? '光线充足，适合拍摄滩涂日出日落' : 
                          weather.condition === '多云' ? '云层丰富，适合拍摄戏剧性天空' : 
                          '柔和光线，适合人文摄影'}
                    </div>
                </div>
            </div>
        `);
        
        document.body.appendChild(modal);
    } catch (error) {
        console.error('显示天气信息失败:', error);
    } finally {
        loadingManager.hideLoading('weather');
    }
}

// 分享模态框
function showShareModal() {
    const currentUrl = window.location.href;
    const title = '霞浦 - 中国最美滩涂摄影天堂';
    
    const modal = createModal('分享霞浦之美', `
        <div class="text-center">
            <div class="mb-6">
                <div class="text-lg font-semibold text-gray-800 mb-2">分享到社交平台</div>
                <div class="flex justify-center space-x-4">
                    <button data-share-platform="wechat" class="w-12 h-12 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors">
                        <i class="fab fa-weixin"></i>
                    </button>
                    <button data-share-platform="weibo" class="w-12 h-12 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                        <i class="fab fa-weibo"></i>
                    </button>
                    <button data-share-platform="qq" class="w-12 h-12 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
                        <i class="fab fa-qq"></i>
                    </button>
                </div>
            </div>
            
            <div class="mb-6">
                <div class="text-lg font-semibold text-gray-800 mb-2">复制链接</div>
                <div class="flex items-center space-x-2">
                    <input type="text" value="${currentUrl}" readonly 
                           class="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm">
                    <button data-copy-text="${currentUrl}" 
                            class="px-4 py-2 bg-ocean-blue text-white rounded-lg hover:bg-blue-600 transition-colors">
                        <i class="fas fa-copy"></i>
                    </button>
                </div>
            </div>
            
            <div class="text-sm text-gray-500">
                分享霞浦的美丽，让更多人了解这个摄影天堂
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
}

// 收藏功能
function toggleFavorite() {
    const isFavorited = localStorage.getItem('xiapu_favorited') === 'true';
    
    if (isFavorited) {
        localStorage.removeItem('xiapu_favorited');
        showNotification('已取消收藏', 'info');
    } else {
        localStorage.setItem('xiapu_favorited', 'true');
        showNotification('已添加到收藏', 'success');
    }
    
    updateFavoriteButton();
}

// 更新收藏按钮状态
function updateFavoriteButton() {
    const favoriteBtn = document.querySelector('[aria-label="收藏页面"]');
    const isFavorited = localStorage.getItem('xiapu_favorited') === 'true';
    
    if (favoriteBtn) {
        if (isFavorited) {
            favoriteBtn.innerHTML = '<i class="fas fa-heart"></i>';
            favoriteBtn.className = favoriteBtn.className.replace('bg-red-500', 'bg-pink-500');
        } else {
            favoriteBtn.innerHTML = '<i class="far fa-heart"></i>';
            favoriteBtn.className = favoriteBtn.className.replace('bg-pink-500', 'bg-red-500');
        }
    }
}

// 通知系统
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500'
    };
    
    notification.className = `fixed top-20 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300`;
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : type === 'warning' ? 'exclamation' : 'info'} mr-2"></i>
            ${message}
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 工具函数
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('链接已复制到剪贴板', 'success');
    }).catch(() => {
        showNotification('复制失败，请手动复制', 'error');
    });
}

function shareToWeChat() {
    const currentUrl = window.location.href;
    
    const modal = createModal('微信扫一扫分享', `
        <div class="text-center">
            <div class="mb-4">
                <div id="qrcode-container" class="flex justify-center">
                    <div class="bg-gray-100 rounded-lg p-4" style="width: 220px; height: 220px; display: flex; align-items: center; justify-content: center;">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                </div>
            </div>
            <p class="text-gray-600 mb-4">
                <i class="fab fa-weixin text-green-500 text-xl mr-2"></i>
                使用微信扫描上方二维码即可分享
            </p>
            <div class="bg-gray-50 p-4 rounded-lg">
                <p class="text-sm text-gray-500 mb-2">
                    <i class="fas fa-link mr-1"></i>
                    分享链接：
                </p>
                <div class="flex items-center gap-2">
                    <input type="text" value="${currentUrl}" readonly 
                           class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded bg-white text-gray-700">
                    <button data-copy-text="${currentUrl}" 
                            class="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors flex items-center gap-1">
                        <i class="fas fa-copy"></i>
                        复制
                    </button>
                </div>
            </div>
            <div class="mt-4 text-xs text-gray-400">
                <p>💡 提示：网站需要部署到公网才能被微信扫码访问</p>
            </div>
        </div>
    `);
    
    // 生成二维码
    setTimeout(() => {
        const container = document.getElementById('qrcode-container');
        if (container && window.QRCode) {
            container.innerHTML = '';
            
            // 创建canvas元素
            const canvas = document.createElement('canvas');
            container.appendChild(canvas);
            
            // 生成二维码
            QRCode.toCanvas(canvas, currentUrl, {
                width: 200,
                height: 200,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            }, function (error) {
                if (error) {
                    console.error('二维码生成失败:', error);
                    container.innerHTML = `
                        <div class="text-red-500 text-sm">
                            <i class="fas fa-exclamation-triangle mb-2"></i>
                            <p>二维码生成失败</p>
                            <p class="text-xs mt-1">请复制链接手动分享</p>
                        </div>
                    `;
                } else {
                    // 添加样式
                    canvas.className = 'rounded-lg shadow-lg';
                }
            });
        } else {
            // 降级到在线API
            const container = document.getElementById('qrcode-container');
            if (container) {
                const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}`;
                container.innerHTML = `
                    <img src="${qrCodeUrl}" alt="二维码" class="rounded-lg shadow-lg" style="width: 200px; height: 200px;">
                `;
            }
        }
    }, 100);
    
    showNotification('二维码已生成，请使用微信扫一扫', 'success');
}

function shareToWeibo() {
    const url = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent('霞浦 - 中国最美滩涂摄影天堂')}`;
    window.open(url, '_blank');
}

function shareToQQ() {
    const url = `https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent('霞浦 - 中国最美滩涂摄影天堂')}`;
    window.open(url, '_blank');
}

// 添加键盘快捷键支持
document.addEventListener('keydown', function(e) {
    // ESC键关闭模态框
    if (e.key === 'Escape') {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            closeModal();
        }
    }
    
    // Ctrl+K 或 Cmd+K 打开搜索
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        showSearchModal();
    }
    
    // 空格键暂停/播放视频
    if (e.key === ' ' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        toggleVideoPlayback();
    }
});

// 搜索功能
function showSearchModal() {
    // 检查是否已经有搜索模态框打开
    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) {
        return; // 如果已经有模态框，直接返回
    }
    
    const modal = createModal('🔍 搜索霞浦', `
        <div class="mb-6">
            <div class="relative">
                <input type="text" id="searchInput" placeholder="搜索景点、美食、攻略..." 
                       class="w-full px-5 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-ocean-blue focus:border-ocean-blue transition-all duration-300 text-lg">
                <i class="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
            <div class="flex items-center justify-between mt-3">
                <div class="flex items-center space-x-2 text-sm text-gray-500">
                    <span>💡 提示：试试搜索"滩涂"、"海鲜"、"摄影"</span>
                </div>
                <div class="text-xs text-gray-400">
                    <kbd class="px-2 py-1 bg-gray-100 rounded">ESC</kbd> 关闭
                </div>
            </div>
        </div>
        <div id="searchResults" class="max-h-80 overflow-y-auto">
            <div class="text-gray-500 text-center py-12">
                <div class="mb-4">
                    <i class="fas fa-search text-4xl text-ocean-blue opacity-50"></i>
                </div>
                <p class="text-lg font-medium mb-2">开始探索霞浦</p>
                <p class="text-sm">输入关键词发现更多精彩内容</p>
            </div>
        </div>
    `);
    
    if (!modal) {
        console.error('创建搜索模态框失败');
        return;
    }
    
    document.body.appendChild(modal);
    
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    if (!searchInput || !searchResults) {
        console.error('搜索元素未找到');
        return;
    }
    
    // 聚焦搜索框
    setTimeout(() => {
        searchInput.focus();
        searchInput.select();
    }, 100);
    
    // 防抖函数
    let searchTimeout;
    
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.trim();
        
        // 清除之前的定时器
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        
        if (query.length > 0) {
            // 显示加载状态
            searchResults.innerHTML = `
                <div class="text-center py-4">
                    <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-ocean-blue mx-auto mb-2"></div>
                    <p class="text-gray-500 text-sm">搜索中...</p>
                </div>
            `;
            
            // 防抖搜索
            searchTimeout = setTimeout(() => {
                performSearch(query, searchResults);
            }, 300);
        } else {
            searchResults.innerHTML = `
                <div class="text-gray-500 text-center py-12">
                    <div class="mb-4">
                        <i class="fas fa-search text-4xl text-ocean-blue opacity-50"></i>
                    </div>
                    <p class="text-lg font-medium mb-2">开始探索霞浦</p>
                    <p class="text-sm">输入关键词发现更多精彩内容</p>
                </div>
            `;
        }
    });
    
    // 回车键搜索
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const query = e.target.value.trim();
            if (query.length > 0) {
                if (searchTimeout) {
                    clearTimeout(searchTimeout);
                }
                performSearch(query, searchResults);
            }
        }
    });
}

// 执行搜索
function performSearch(query, resultsContainer) {
    if (!query || !resultsContainer) {
        console.error('搜索参数无效');
        return;
    }
    
    const searchData = [
        { 
            title: '霞浦滩涂', 
            type: '景点', 
            description: '中国最美滩涂，摄影胜地',
            keywords: ['滩涂', '摄影', '日出', '日落', '风景']
        },
        { 
            title: '北岐日出', 
            type: '景点', 
            description: '观赏滩涂日出的最佳地点',
            keywords: ['日出', '摄影', '滩涂', '北岐']
        },
        { 
            title: '杨家溪', 
            type: '景点', 
            description: '古榕树群和竹筏漂流',
            keywords: ['古榕树', '竹筏', '漂流', '自然']
        },
        { 
            title: '大京沙滩', 
            type: '景点', 
            description: '细腻沙滩，海滨度假',
            keywords: ['沙滩', '海滨', '度假', '游泳']
        },
        { 
            title: '霞浦紫菜', 
            type: '美食', 
            description: '地理标志产品，营养丰富',
            keywords: ['紫菜', '特产', '营养', '海产品']
        },
        { 
            title: '海鲜大餐', 
            type: '美食', 
            description: '新鲜海鲜，地道做法',
            keywords: ['海鲜', '美食', '新鲜', '地道']
        },
        { 
            title: '摄影攻略', 
            type: '攻略', 
            description: '最佳拍摄时间和地点',
            keywords: ['摄影', '攻略', '技巧', '时间', '地点']
        },
        { 
            title: '交通指南', 
            type: '攻略', 
            description: '如何到达霞浦',
            keywords: ['交通', '路线', '指南', '到达']
        },
        { 
            title: '住宿推荐', 
            type: '攻略', 
            description: '霞浦优质住宿选择',
            keywords: ['住宿', '酒店', '民宿', '推荐']
        },
        { 
            title: '最佳旅游时间', 
            type: '攻略', 
            description: '霞浦四季旅游指南',
            keywords: ['时间', '季节', '天气', '旅游']
        }
    ];
    
    const queryLower = query.toLowerCase();
    const results = searchData.filter(item => 
        item.title.toLowerCase().includes(queryLower) ||
        item.description.toLowerCase().includes(queryLower) ||
        item.keywords.some(keyword => keyword.toLowerCase().includes(queryLower))
    );
    
    if (results.length > 0) {
        resultsContainer.innerHTML = `
            <div class="mb-4 pb-3 border-b border-gray-200">
                <div class="flex items-center justify-between">
                    <p class="text-sm text-gray-600 flex items-center">
                        <i class="fas fa-check-circle text-green-500 mr-2"></i>
                        找到 <span class="font-semibold text-ocean-blue mx-1">${results.length}</span> 个相关结果
                    </p>
                    <span class="text-xs text-gray-400">点击查看详情</span>
                </div>
            </div>
            ${results.map((item, index) => `
                <div class="search-result-item p-4 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 rounded-xl cursor-pointer border border-transparent hover:border-ocean-blue/20 transition-all duration-300 mb-3 group"
                     onclick="handleSearchResultClick('${item.title}', '${item.type}')">
                    <div class="flex items-start justify-between">
                        <div class="flex-1">
                            <div class="flex items-center mb-2">
                                <h4 class="font-semibold text-gray-800 text-lg group-hover:text-ocean-blue transition-colors">${highlightSearchTerm(item.title, query)}</h4>
                                <span class="ml-3 inline-flex items-center px-3 py-1 bg-gradient-to-r from-ocean-blue/10 to-sunset-orange/10 text-ocean-blue text-xs rounded-full font-medium">
                                    <i class="fas fa-${item.type === '景点' ? 'mountain' : item.type === '美食' ? 'utensils' : item.type === '攻略' ? 'map' : 'info-circle'} mr-1"></i>
                                    ${item.type}
                                </span>
                            </div>
                            <p class="text-gray-600 mb-3 leading-relaxed">${highlightSearchTerm(item.description, query)}</p>
                            <div class="flex items-center text-xs text-gray-400">
                                <i class="fas fa-tags mr-2"></i>
                                <div class="flex flex-wrap gap-1">
                                    ${item.keywords.slice(0, 4).map(keyword => `
                                        <span class="px-2 py-1 bg-gray-100 hover:bg-ocean-blue/10 text-gray-600 hover:text-ocean-blue rounded-full transition-colors cursor-pointer">${keyword}</span>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                        <div class="ml-4 flex flex-col items-center">
                            <div class="w-8 h-8 bg-ocean-blue/10 rounded-full flex items-center justify-center group-hover:bg-ocean-blue group-hover:text-white transition-all">
                                <i class="fas fa-chevron-right text-sm"></i>
                            </div>
                            <span class="text-xs text-gray-400 mt-1">#${index + 1}</span>
                        </div>
                    </div>
                </div>
            `).join('')}
        `;
    } else {
        resultsContainer.innerHTML = `
            <div class="text-center py-12 text-gray-500">
                <div class="mb-6">
                    <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-search-minus text-3xl text-gray-300"></i>
                    </div>
                    <p class="text-lg font-medium mb-2">未找到相关内容</p>
                    <p class="text-sm text-gray-400">试试搜索其他关键词，或者从下面的热门搜索开始</p>
                </div>
                <div class="space-y-3">
                    <p class="text-sm font-medium text-gray-600 mb-3">🔥 热门搜索</p>
                    <div class="flex flex-wrap justify-center gap-2">
                        <button class="px-4 py-2 bg-gradient-to-r from-ocean-blue/10 to-ocean-blue/20 hover:from-ocean-blue hover:to-ocean-blue hover:text-white text-ocean-blue rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105" onclick="document.getElementById('searchInput').value='滩涂'; performSearch('滩涂', document.getElementById('searchResults'));">
                            <i class="fas fa-mountain mr-1"></i>滩涂摄影
                        </button>
                        <button class="px-4 py-2 bg-gradient-to-r from-sunset-orange/10 to-sunset-orange/20 hover:from-sunset-orange hover:to-sunset-orange hover:text-white text-sunset-orange rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105" onclick="document.getElementById('searchInput').value='海鲜'; performSearch('海鲜', document.getElementById('searchResults'));">
                            <i class="fas fa-utensils mr-1"></i>海鲜美食
                        </button>
                        <button class="px-4 py-2 bg-gradient-to-r from-green-400/10 to-green-400/20 hover:from-green-400 hover:to-green-400 hover:text-white text-green-600 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105" onclick="document.getElementById('searchInput').value='摄影'; performSearch('摄影', document.getElementById('searchResults'));">
                            <i class="fas fa-camera mr-1"></i>摄影攻略
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}

// 高亮搜索词
function highlightSearchTerm(text, searchTerm) {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
}

// 处理搜索结果点击
function handleSearchResultClick(title, type) {
    console.log('点击搜索结果:', { title, type });
    
    // 关闭搜索模态框
    closeModal();
    
    // 根据类型执行不同的操作
    switch (type) {
        case '景点':
            // 滚动到相关景点区域
            const attractionsSection = document.getElementById('attractions') || 
                                     document.querySelector('[data-section="attractions"]') ||
                                     document.querySelector('.attractions');
            if (attractionsSection) {
                attractionsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // 添加高亮效果
                attractionsSection.classList.add('highlight-section');
                setTimeout(() => {
                    attractionsSection.classList.remove('highlight-section');
                }, 2000);
            }
            break;
            
        case '美食':
            // 滚动到美食区域
            const foodSection = document.getElementById('food') || 
                               document.querySelector('[data-section="food"]') ||
                               document.querySelector('.food');
            if (foodSection) {
                foodSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                foodSection.classList.add('highlight-section');
                setTimeout(() => {
                    foodSection.classList.remove('highlight-section');
                }, 2000);
            }
            break;
            
        case '攻略':
            // 滚动到攻略区域或显示相关信息
            const guideSection = document.getElementById('guide') || 
                               document.querySelector('[data-section="guide"]') ||
                               document.querySelector('.guide');
            if (guideSection) {
                guideSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                guideSection.classList.add('highlight-section');
                setTimeout(() => {
                    guideSection.classList.remove('highlight-section');
                }, 2000);
            }
            break;
            
        default:
            // 默认滚动到页面顶部
            window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // 显示通知
    showNotification(`正在查看: ${title}`, 'info');
}

// 重复的showNotification函数已删除，使用第1487行的原始函数

// 重复的toggleMobileMenu函数已删除，使用第382行的原始函数

// 视频播放控制
function toggleVideoPlayback() {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    });
}

// 初始化新功能
initFloatingToolbar();
updateFavoriteButton();

// 页面可见性API - 当页面不可见时暂停动画
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // 页面不可见时暂停动画和视频
        document.querySelectorAll('video').forEach(video => video.pause());
        document.body.classList.add('page-hidden');
    } else {
        // 页面可见时恢复
        document.body.classList.remove('page-hidden');
    }
});

// 添加触摸手势支持（移动端）
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', function(e) {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // 检测滑动手势
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
            // 向右滑动
            console.log('向右滑动');
        } else {
            // 向左滑动
            console.log('向左滑动');
        }
    }
});

// 将需要在HTML中调用的函数暴露到全局作用域
window.showSearchModal = showSearchModal;
window.toggleMobileMenu = toggleMobileMenu;
window.handleSearchResultClick = handleSearchResultClick;
window.performSearch = performSearch;
window.retryAllFailedImages = retryAllFailedImages;

console.log('霞浦宣传网站已加载完成 🌊📸');
