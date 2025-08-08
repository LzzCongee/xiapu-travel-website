// 图片管理系统
class ImageManager {
    constructor() {
        this.fallbackImages = {
            landscape: [
                '/images/fallback-sunrise.svg',
                '/images/fallback-landscape.svg',
                '/images/fallback-fisherman.svg'
            ],
            food: [
                '/images/fallback-seafood.svg'
            ]
        };
        
        this.onlineImages = {
            sunrise: [
                'https://zhiyan-ai-agent-with-1258344702.cos.ap-guangzhou.tencentcos.cn/with/d9e716ba-389a-4395-ade8-a13fdcf9d03f/image_1754616767_3_1.jpg',
                'https://zhiyan-ai-agent-with-1258344702.cos.ap-guangzhou.tencentcos.cn/with/dc84ed5b-46f4-496f-a940-697c5f3f0b1c/image_1754616767_4_1.jpg',
                'https://zhiyan-ai-agent-with-1258344702.cos.ap-guangzhou.tencentcos.cn/with/354ae1b3-d38d-4ef8-a59b-dcd4bf01761a/image_1754616767_5_1.jpg'
            ],
            seafood: [
                'https://zhiyan-ai-agent-with-1258344702.cos.ap-guangzhou.tencentcos.cn/with/cf41abea-0a8e-4cee-995c-3f6173754c1b/image_1754616775_6_1.png',
                'https://zhiyan-ai-agent-with-1258344702.cos.ap-guangzhou.tencentcos.cn/with/629fb330-4d01-4e1b-9f46-6d64fd1ba204/image_1754616775_2_1.jpg',
                'https://zhiyan-ai-agent-with-1258344702.cos.ap-guangzhou.tencentcos.cn/with/e7b6949b-a321-4f04-9d02-49c8f03d8170/image_1754616775_1_1.png'
            ],
            fisherman: [
                'https://zhiyan-ai-agent-with-1258344702.cos.ap-guangzhou.tencentcos.cn/with/1530caa9-c3ae-4347-915d-c36c892a49fa/image_1754616784_1_1.png',
                'https://zhiyan-ai-agent-with-1258344702.cos.ap-guangzhou.tencentcos.cn/with/9c9d1680-4b7e-4390-adf2-8cc896e4f440/image_1754616784_4_1.png'
            ]
        };
        
        this.imageStats = {
            total: 0,
            loaded: 0,
            failed: 0,
            fallback: 0,
            online: 0
        };
        
        this.retryAttempts = new Map();
        this.maxRetries = 2;
        this.init();
    }
    
    init() {
        this.setupImageObserver();
        this.createStatusIndicator();
        this.bindEvents();
        console.log('🖼️ 图片管理系统已初始化');
    }
    
    // 设置图片观察器
    setupImageObserver() {
        if ('IntersectionObserver' in window) {
            this.imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        this.imageObserver.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '50px'
            });
            
            this.observeImages();
        } else {
            this.loadAllImages();
        }
    }
    
    // 观察所有图片
    observeImages() {
        const images = document.querySelectorAll('img[data-src], img:not([src])');
        images.forEach(img => {
            this.imageStats.total++;
            this.setupImageErrorHandling(img);
            
            if (img.hasAttribute('data-src') || !img.src) {
                this.imageObserver.observe(img);
            }
        });
        this.updateStatusIndicator();
    }
    
    // 加载图片
    loadImage(img) {
        const src = img.getAttribute('data-src') || this.getImageSrc(img);
        if (!src) return;
        
        // 尝试在线图片
        this.tryOnlineImage(img, src).then(success => {
            if (success) {
                this.imageStats.loaded++;
                this.imageStats.online++;
                img.classList.add('loaded');
                img.removeAttribute('data-src');
            } else {
                this.handleImageError(img);
            }
            this.updateStatusIndicator();
        });
    }
    
    // 尝试加载在线图片
    async tryOnlineImage(img, src) {
        return new Promise((resolve) => {
            const testImg = new Image();
            testImg.onload = () => {
                img.src = src;
                resolve(true);
            };
            testImg.onerror = () => {
                resolve(false);
            };
            testImg.src = src;
            
            // 设置超时
            setTimeout(() => {
                resolve(false);
            }, 5000);
        });
    }
    
    // 获取图片源
    getImageSrc(img) {
        const imageType = img.getAttribute('data-image-type') || 'landscape';
        const altText = img.alt.toLowerCase();
        
        // 根据alt文本智能匹配
        if (altText.includes('日出') || altText.includes('sunrise')) {
            return this.getRandomOnlineImage('sunrise');
        } else if (altText.includes('海鲜') || altText.includes('美食') || altText.includes('seafood')) {
            return this.getRandomOnlineImage('seafood');
        } else if (altText.includes('渔民') || altText.includes('劳作') || altText.includes('fisherman')) {
            return this.getRandomOnlineImage('fisherman');
        }
        
        return this.getRandomOnlineImage('sunrise'); // 默认
    }
    
    // 获取随机在线图片
    getRandomOnlineImage(category) {
        const images = this.onlineImages[category] || this.onlineImages.sunrise;
        return images[Math.floor(Math.random() * images.length)];
    }
    
    // 获取随机备用图片
    getRandomFallbackImage(type = 'landscape') {
        const images = this.fallbackImages[type] || this.fallbackImages.landscape;
        return images[Math.floor(Math.random() * images.length)];
    }
    
    // 设置图片错误处理
    setupImageErrorHandling(img) {
        img.onerror = () => this.handleImageError(img);
        
        // 添加重试功能
        img.addEventListener('click', (e) => {
            if (img.classList.contains('fallback-image')) {
                e.preventDefault();
                this.retryImage(img);
            }
        });
    }
    
    // 处理图片错误
    handleImageError(img, retryCount = 0) {
        const imgId = this.getImageId(img);
        const currentRetries = this.retryAttempts.get(imgId) || 0;
        
        if (currentRetries < this.maxRetries) {
            // 重试加载原图片
            this.retryAttempts.set(imgId, currentRetries + 1);
            setTimeout(() => {
                const originalSrc = img.getAttribute('data-original-src') || img.src;
                if (originalSrc) {
                    img.src = originalSrc;
                }
            }, 1000 * (currentRetries + 1)); // 递增延迟
            return;
        }
        
        // 使用备用图片
        this.useFallbackImage(img);
    }
    
    // 使用备用图片
    useFallbackImage(img) {
        const imageType = img.getAttribute('data-image-type') || 'landscape';
        const fallbackSrc = this.getRandomFallbackImage(imageType);
        
        // 保存原始src
        if (!img.getAttribute('data-original-src')) {
            img.setAttribute('data-original-src', img.src || img.getAttribute('data-src'));
        }
        
        img.src = fallbackSrc;
        img.classList.add('fallback-image');
        img.style.filter = 'sepia(0.2) opacity(0.9)';
        img.title = '备用图片 - 原图片加载失败，点击可重试';
        img.onerror = null; // 移除错误处理，避免无限循环
        
        // 添加重试图标
        this.addRetryIcon(img);
        
        this.imageStats.failed++;
        this.imageStats.fallback++;
        this.updateStatusIndicator();
        
        console.warn('图片加载失败，已切换到备用图片:', img.getAttribute('data-original-src'));
    }
    
    // 添加重试图标
    addRetryIcon(img) {
        if (img.parentElement.querySelector('.retry-icon')) return;
        
        const retryIcon = document.createElement('div');
        retryIcon.className = 'retry-icon absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded cursor-pointer hover:bg-opacity-70 transition-all';
        retryIcon.innerHTML = '<i class="fas fa-redo text-xs"></i>';
        retryIcon.title = '重试加载原图片';
        
        retryIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            this.retryImage(img);
        });
        
        // 确保父元素有相对定位
        if (getComputedStyle(img.parentElement).position === 'static') {
            img.parentElement.style.position = 'relative';
        }
        
        img.parentElement.appendChild(retryIcon);
    }
    
    // 重试图片
    retryImage(img) {
        const originalSrc = img.getAttribute('data-original-src');
        if (!originalSrc) return;
        
        // 移除备用图片样式
        img.classList.remove('fallback-image');
        img.style.filter = '';
        img.title = '';
        
        // 移除重试图标
        const retryIcon = img.parentElement.querySelector('.retry-icon');
        if (retryIcon) {
            retryIcon.remove();
        }
        
        // 重置重试计数
        const imgId = this.getImageId(img);
        this.retryAttempts.delete(imgId);
        
        // 重新设置错误处理
        this.setupImageErrorHandling(img);
        
        // 尝试加载原图片
        this.tryOnlineImage(img, originalSrc).then(success => {
            if (success) {
                this.imageStats.fallback--;
                this.imageStats.loaded++;
                this.imageStats.online++;
                this.updateStatusIndicator();
                this.showNotification('图片重试成功！', 'success');
            } else {
                this.useFallbackImage(img);
                this.showNotification('图片重试失败，继续使用备用图片', 'warning');
            }
        });
    }
    
    // 获取图片ID
    getImageId(img) {
        return img.src + img.alt + img.className;
    }
    
    // 加载所有图片（降级处理）
    loadAllImages() {
        const images = document.querySelectorAll('img[data-src], img:not([src])');
        images.forEach(img => {
            this.imageStats.total++;
            this.setupImageErrorHandling(img);
            this.loadImage(img);
        });
        this.updateStatusIndicator();
    }
    
    // 创建状态指示器
    createStatusIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'image-status-indicator';
        indicator.className = 'fixed bottom-4 left-4 bg-black bg-opacity-80 text-white px-4 py-2 rounded-lg text-sm z-50 transition-all duration-300';
        indicator.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="fas fa-image"></i>
                <span id="image-status-text">图片加载中...</span>
                <button id="retry-all-btn" class="ml-2 px-2 py-1 bg-blue-500 hover:bg-blue-600 rounded text-xs transition-colors" style="display: none;">
                    重试全部
                </button>
            </div>
        `;
        
        document.body.appendChild(indicator);
        
        // 绑定重试全部按钮
        document.getElementById('retry-all-btn').addEventListener('click', () => {
            this.retryAllFailedImages();
        });
        
        // 5秒后自动隐藏
        setTimeout(() => {
            indicator.style.opacity = '0.7';
            indicator.style.transform = 'translateY(10px)';
        }, 5000);
    }
    
    // 更新状态指示器
    updateStatusIndicator() {
        const statusElement = document.getElementById('image-status-text');
        const retryBtn = document.getElementById('retry-all-btn');
        
        if (statusElement) {
            const { total, loaded, failed, fallback, online } = this.imageStats;
            
            if (total === 0) {
                statusElement.innerHTML = '暂无图片';
            } else if (loaded + failed === total) {
                statusElement.innerHTML = `
                    <span class="text-green-400">${online} 张在线图片</span>
                    ${fallback > 0 ? `<span class="text-yellow-400">${fallback} 张备用图片</span>` : ''}
                `;
                
                if (fallback > 0 && retryBtn) {
                    retryBtn.style.display = 'inline-block';
                }
            } else {
                statusElement.innerHTML = `加载中 ${loaded + failed}/${total}`;
            }
        }
    }
    
    // 重试所有失败的图片
    retryAllFailedImages() {
        const fallbackImages = document.querySelectorAll('.fallback-image');
        let retryCount = 0;
        
        fallbackImages.forEach(img => {
            setTimeout(() => {
                this.retryImage(img);
            }, retryCount * 500); // 错开重试时间
            retryCount++;
        });
        
        if (retryCount > 0) {
            this.showNotification(`正在重试 ${retryCount} 张图片...`, 'info');
        }
    }
    
    // 显示通知
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 px-4 py-2 rounded-lg text-white z-50 transition-all duration-300 ${
            type === 'success' ? 'bg-green-500' : 
            type === 'warning' ? 'bg-yellow-500' : 
            type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        }`;
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : type === 'warning' ? 'exclamation' : 'info'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // 动画显示
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        }, 100);
        
        // 3秒后自动移除
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.parentElement.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // 绑定事件
    bindEvents() {
        // 监听新图片添加
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        const images = node.tagName === 'IMG' ? [node] : node.querySelectorAll('img');
                        images.forEach(img => {
                            if (!img.hasAttribute('data-processed')) {
                                img.setAttribute('data-processed', 'true');
                                this.imageStats.total++;
                                this.setupImageErrorHandling(img);
                                
                                if (img.hasAttribute('data-src') || !img.src) {
                                    this.imageObserver.observe(img);
                                }
                                
                                this.updateStatusIndicator();
                            }
                        });
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // 搜索在线图片
    async searchOnlineImages(query, count = 3) {
        try {
            // 这里可以集成真实的图片搜索API
            // 目前返回模拟数据
            console.log(`搜索图片: ${query}, 数量: ${count}`);
            
            // 模拟API延迟
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // 返回搜索结果
            return {
                success: true,
                images: this.onlineImages.sunrise.slice(0, count),
                message: `找到 ${count} 张相关图片`
            };
        } catch (error) {
            console.error('在线图片搜索失败:', error);
            return {
                success: false,
                images: [],
                message: '搜索失败，将使用备用图片'
            };
        }
    }
    
    // 获取统计信息
    getStats() {
        return { ...this.imageStats };
    }
    
    // 清理资源
    destroy() {
        if (this.imageObserver) {
            this.imageObserver.disconnect();
        }
        
        const indicator = document.getElementById('image-status-indicator');
        if (indicator) {
            indicator.remove();
        }
        
        console.log('🖼️ 图片管理系统已清理');
    }
}

// 导出图片管理器
window.ImageManager = ImageManager;

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
    window.imageManager = new ImageManager();
});

console.log('🖼️ 图片管理系统模块已加载');