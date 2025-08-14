// 图片状态检查工具
class ImageStatusChecker {
    constructor() {
        this.checkInterval = null;
        this.isChecking = false;
        this.init();
    }
    
    init() {
        this.createStatusPanel();
        this.startPeriodicCheck();
        console.log('✅ 图片状态检查工具已初始化');
    }
    
    // 创建状态面板
    createStatusPanel() {
        // 确保document.body存在
        if (!document.body) {
            console.warn('⚠️ document.body不存在，延迟创建状态面板');
            setTimeout(() => this.createStatusPanel(), 100);
            return;
        }

        const panel = document.createElement('div');
        panel.id = 'image-status-panel';
        panel.className = 'fixed top-4 right-4 bg-white rounded-lg shadow-lg p-4 z-50 max-w-sm';
        panel.style.display = 'none';
        
        panel.innerHTML = `
            <div class="flex items-center justify-between mb-3">
                <h3 class="font-bold text-gray-800">图片状态</h3>
                <button id="close-status-panel" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div id="status-content">
                <div class="text-sm text-gray-600">正在检查图片状态...</div>
            </div>
            <div class="mt-3 flex space-x-2">
                <button id="refresh-images" class="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
                    刷新图片
                </button>
                <button id="check-images" class="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">
                    重新检查
                </button>
            </div>
        `;
        
        document.body.appendChild(panel);
        this.bindPanelEvents();
    }
    
    // 绑定面板事件
    bindPanelEvents() {
        const panel = document.getElementById('image-status-panel');
        const closeBtn = document.getElementById('close-status-panel');
        const refreshBtn = document.getElementById('refresh-images');
        const checkBtn = document.getElementById('check-images');
        
        // 确保所有元素都存在
        if (!panel || !closeBtn || !refreshBtn || !checkBtn) {
            console.warn('⚠️ 面板元素不完整，跳过事件绑定');
            return;
        }
        
        closeBtn.addEventListener('click', () => {
            panel.style.display = 'none';
        });
        
        refreshBtn.addEventListener('click', () => {
            this.refreshAllImages();
        });
        
        checkBtn.addEventListener('click', () => {
            this.checkAllImages();
        });
        
        // 添加快捷键支持 (Ctrl+I)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'i') {
                e.preventDefault();
                this.toggleStatusPanel();
            }
        });
    }
    
    // 切换状态面板显示
    toggleStatusPanel() {
        const panel = document.getElementById('image-status-panel');
        if (panel.style.display === 'none') {
            panel.style.display = 'block';
            this.checkAllImages();
        } else {
            panel.style.display = 'none';
        }
    }
    
    // 开始定期检查
    startPeriodicCheck() {
        // 每60秒检查一次
        this.checkInterval = setInterval(() => {
            this.checkAllImages(false); // 静默检查
        }, 60000);
    }
    
    // 检查所有图片
    async checkAllImages(showPanel = true) {
        if (this.isChecking) return;
        this.isChecking = true;
        
        if (showPanel) {
            document.getElementById('image-status-panel').style.display = 'block';
        }
        
        const images = document.querySelectorAll('img');
        const results = {
            total: images.length,
            loaded: 0,
            loading: 0,
            failed: 0,
            fallback: 0,
            details: []
        };
        
        for (let img of images) {
            const status = await this.checkImageStatus(img);
            results.details.push(status);
            
            switch (status.status) {
                case 'loaded':
                    results.loaded++;
                    break;
                case 'loading':
                    results.loading++;
                    break;
                case 'failed':
                    results.failed++;
                    break;
                case 'fallback':
                    results.fallback++;
                    break;
            }
        }
        
        this.updateStatusDisplay(results);
        this.isChecking = false;
        
        return results;
    }
    
    // 检查单个图片状态
    async checkImageStatus(img) {
        const src = img.src || img.getAttribute('data-src');
        const alt = img.alt || '未命名图片';
        
        if (!src) {
            return {
                alt,
                src: '无',
                status: 'failed',
                message: '缺少图片源'
            };
        }
        
        if (img.classList.contains('fallback-image')) {
            return {
                alt,
                src,
                status: 'fallback',
                message: '使用备用图片'
            };
        }
        
        if (img.classList.contains('image-loaded')) {
            return {
                alt,
                src,
                status: 'loaded',
                message: '加载成功'
            };
        }
        
        if (img.hasAttribute('data-src')) {
            return {
                alt,
                src,
                status: 'loading',
                message: '等待加载'
            };
        }
        
        // 测试图片是否可以加载
        try {
            await this.testImageLoad(src);
            return {
                alt,
                src,
                status: 'loaded',
                message: '加载成功'
            };
        } catch (error) {
            return {
                alt,
                src,
                status: 'failed',
                message: '加载失败'
            };
        }
    }
    
    // 测试图片加载
    testImageLoad(src) {
        return new Promise((resolve, reject) => {
            const testImg = new Image();
            testImg.onload = () => resolve();
            testImg.onerror = () => reject();
            testImg.src = src;
            
            setTimeout(() => reject(new Error('超时')), 5000);
        });
    }
    
    // 更新状态显示
    updateStatusDisplay(results) {
        const content = document.getElementById('status-content');
        if (!content) return;
        
        const successRate = ((results.loaded / results.total) * 100).toFixed(1);
        
        content.innerHTML = `
            <div class="space-y-2">
                <div class="flex justify-between">
                    <span>总图片数:</span>
                    <span class="font-semibold">${results.total}</span>
                </div>
                <div class="flex justify-between">
                    <span>已加载:</span>
                    <span class="font-semibold text-green-600">${results.loaded}</span>
                </div>
                <div class="flex justify-between">
                    <span>加载中:</span>
                    <span class="font-semibold text-blue-600">${results.loading}</span>
                </div>
                <div class="flex justify-between">
                    <span>备用图片:</span>
                    <span class="font-semibold text-yellow-600">${results.fallback}</span>
                </div>
                <div class="flex justify-between">
                    <span>加载失败:</span>
                    <span class="font-semibold text-red-600">${results.failed}</span>
                </div>
                <div class="border-t pt-2">
                    <div class="flex justify-between">
                        <span>成功率:</span>
                        <span class="font-semibold ${successRate >= 90 ? 'text-green-600' : successRate >= 70 ? 'text-yellow-600' : 'text-red-600'}">${successRate}%</span>
                    </div>
                </div>
            </div>
            
            ${results.failed > 0 || results.fallback > 0 ? `
                <div class="mt-3 p-2 bg-yellow-50 rounded">
                    <div class="text-xs text-yellow-800">
                        <strong>问题图片:</strong>
                        ${results.details
                            .filter(d => d.status === 'failed' || d.status === 'fallback')
                            .slice(0, 3)
                            .map(d => `<div>• ${d.alt}: ${d.message}</div>`)
                            .join('')}
                        ${results.failed + results.fallback > 3 ? `<div>...还有 ${results.failed + results.fallback - 3} 张</div>` : ''}
                    </div>
                </div>
            ` : ''}
        `;
    }
    
    // 刷新所有图片
    refreshAllImages() {
        if (window.imageManager) {
            window.imageManager.retryFailedImages();
            setTimeout(() => {
                this.checkAllImages(false);
            }, 2000);
        }
        
        // 手动触发懒加载
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            if (window.imageManager) {
                window.imageManager.loadImage(img);
            }
        });
    }
    
    // 销毁检查器
    destroy() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
        }
        
        const panel = document.getElementById('image-status-panel');
        if (panel) {
            panel.remove();
        }
    }
}

// 全局实例
// window.imageStatusChecker = new ImageStatusChecker();

// 等待DOM加载完成后再初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.imageStatusChecker = new ImageStatusChecker();
    });
} else {
    // DOM已经加载完成
    window.imageStatusChecker = new ImageStatusChecker();
}

// 添加到控制台的快捷方法
window.checkImages = () => {
    if (window.imageStatusChecker) {
        window.imageStatusChecker.checkAllImages();
    } else {
        console.warn('⚠️ 图片状态检查工具尚未初始化');
    }
};

window.showImageStatus = () => {
    if (window.imageStatusChecker) {
        window.imageStatusChecker.toggleStatusPanel();
    } else {
        console.warn('⚠️ 图片状态检查工具尚未初始化');
    }
};

console.log('🔍 图片状态检查工具已加载');
console.log('💡 使用 Ctrl+I 打开图片状态面板');
console.log('💡 使用 checkImages() 检查所有图片');
console.log('💡 使用 showImageStatus() 显示状态面板');