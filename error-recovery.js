// 错误恢复系统
class ErrorRecoverySystem {
    constructor() {
        this.isActive = true;
        this.errorLog = [];
        this.recoveryAttempts = new Map();
        this.maxRecoveryAttempts = 3;
        
        // 初始化恢复策略
        this.initializeRecoveryStrategies();
        
        // 启动错误监控
        this.startErrorMonitoring();
        
        console.log('✅ 错误恢复系统已启动');
    }
    
    initializeRecoveryStrategies() {
        this.recoveryStrategies = new Map([
            ['script-error', {
                detect: (error) => error.type === 'script-error' || error.message?.includes('script'),
                recover: async (error) => {
                    console.log('尝试脚本错误恢复');
                    
                    // 重新加载失败的脚本
                    if (error.source) {
                        return await this.reloadScript(error.source);
                    }
                    
                    // 通用脚本恢复
                    return await this.refreshFailedComponents();
                }
            }],
            
            ['network-error', {
                detect: (error) => error.type === 'network-error' || error.message?.includes('fetch') || error.message?.includes('network'),
                recover: async (error) => {
                    console.log('尝试网络错误恢复');
                    
                    // 等待网络恢复
                    await this.delay(2000);
                    
                    // 重试网络请求
                    if (error.retryFunction) {
                        try {
                            return await error.retryFunction();
                        } catch (retryError) {
                            console.warn('网络重试失败:', retryError);
                            return false;
                        }
                    }
                    
                    return true;
                }
            }],
            
            ['memory-error', {
                detect: (error) => error.type === 'memory-error' || error.message?.includes('memory') || error.message?.includes('heap'),
                recover: async (error) => {
                    console.log('尝试内存错误恢复');
                    
                    // 执行内存清理
                    return await this.performMemoryCleanup();
                }
            }],
            
            ['component-error', {
                detect: (error) => error.type === 'component-error' || error.component,
                recover: async (error) => {
                    console.log('尝试组件错误恢复');
                    
                    // 重新初始化失败的组件
                    return await this.refreshFailedComponents();
                }
            }],
            
            ['audio-error', {
                detect: (error) => error.type === 'audio-error' || error.message?.includes('audio') || error.message?.includes('AudioContext'),
                recover: async (error) => {
                    console.log('尝试音频错误恢复');
                    
                    // 重新初始化音频管理器
                    if (window.audioManager) {
                        try {
                            await window.audioManager.initialize();
                            return true;
                        } catch (audioError) {
                            console.warn('音频恢复失败:', audioError);
                            return false;
                        }
                    }
                    
                    return false;
                }
            }],
            
            ['image-error', {
                detect: (error) => error.type === 'image-error' || error.message?.includes('image') || error.message?.includes('img'),
                recover: async (error) => {
                    console.log('尝试图片错误恢复');
                    
                    // 重新初始化图片管理器
                    if (window.imageManager) {
                        try {
                            window.imageManager.retryAttempts.clear();
                            return true;
                        } catch (imageError) {
                            console.warn('图片恢复失败:', imageError);
                            return false;
                        }
                    }
                    
                    return false;
                }
            }]
        ]);
    }
    
    async handleError(errorInfo) {
        if (!this.isActive) return;
        
        console.warn('🔧 错误恢复系统处理错误:', errorInfo);
        
        // 记录错误
        this.errorLog.push({
            ...errorInfo,
            timestamp: Date.now(),
            recovered: false
        });
        
        // 检查是否超过最大重试次数
        const errorKey = this.generateErrorKey(errorInfo);
        const attempts = this.recoveryAttempts.get(errorKey) || 0;
        
        if (attempts >= this.maxRecoveryAttempts) {
            console.error('❌ 错误恢复次数超限，停止尝试:', errorKey);
            this.reportCriticalError(errorInfo);
            return;
        }
        
        // 尝试恢复策略
        for (const [strategyName, strategy] of this.recoveryStrategies) {
            if (strategy.detect(errorInfo)) {
                console.log(`应用恢复策略: ${strategyName}`);
                
                try {
                    const recovered = await strategy.recover(errorInfo);
                    
                    if (recovered) {
                        console.log(`✅ 错误恢复成功: ${strategyName}`);
                        this.recoveryAttempts.delete(errorKey);
                        this.logRecoverySuccess(errorInfo, strategyName);
                        return;
                    } else {
                        console.warn(`❌ 错误恢复失败: ${strategyName}`);
                    }
                } catch (recoveryError) {
                    console.error(`恢复策略执行失败: ${strategyName}`, recoveryError);
                }
            }
        }
        
        // 增加尝试次数
        this.recoveryAttempts.set(errorKey, attempts + 1);
        
        // 如果没有找到合适的恢复策略，尝试通用恢复
        this.attemptGenericRecovery(errorInfo);
    }
    
    generateErrorKey(errorInfo) {
        return `${errorInfo.type}-${errorInfo.message?.substring(0, 50) || 'unknown'}`;
    }
    
    async attemptGenericRecovery(errorInfo) {
        console.log('尝试通用错误恢复');
        
        // 通用恢复策略
        const genericStrategies = [
            () => this.refreshFailedComponents(),
            () => this.clearCaches(),
            () => this.reinitializeServices()
        ];
        
        for (const strategy of genericStrategies) {
            try {
                const result = await strategy();
                if (result) {
                    console.log('✅ 通用恢复策略成功');
                    return;
                }
            } catch (error) {
                console.warn('通用恢复策略失败:', error);
            }
        }
    }
    
    async refreshFailedComponents() {
        console.log('刷新失败的组件');
        
        // 检查并重新初始化失败的组件
        const components = [
            { name: 'imageManager', class: 'ImageManager' },
            { name: 'audioManager', class: 'AudioManager' },
            { name: 'weatherService', class: 'WeatherService' }
        ];
        
        let refreshed = false;
        
        for (const component of components) {
            if (!window[component.name] || !window[component.name].isInitialized) {
                try {
                    if (window[component.class]) {
                        console.log(`重新初始化 ${component.name}`);
                        window[component.name] = new window[component.class]();
                        refreshed = true;
                    }
                } catch (error) {
                    console.warn(`重新初始化 ${component.name} 失败:`, error);
                }
            }
        }
        
        return refreshed;
    }
    
    async clearCaches() {
        console.log('清理缓存');
        
        try {
            // 清理图片缓存
            if (window.imageManager) {
                window.imageManager.retryAttempts.clear();
            }
            
            // 清理天气缓存
            if (window.weatherService && window.weatherService.cache) {
                window.weatherService.cache.clear();
            }
            
            // 清理浏览器缓存（如果支持）
            if ('caches' in window) {
                const cacheNames = await caches.keys();
                await Promise.all(
                    cacheNames.map(cacheName => caches.delete(cacheName))
                );
            }
            
            return true;
        } catch (error) {
            console.warn('清理缓存失败:', error);
            return false;
        }
    }
    
    async reinitializeServices() {
        console.log('重新初始化服务');
        
        try {
            // 重新初始化关键服务
            if (typeof initializeApplication === 'function') {
                initializeApplication();
                return true;
            }
            return false;
        } catch (error) {
            console.warn('重新初始化服务失败:', error);
            return false;
        }
    }
    
    async reloadScript(src) {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.head.appendChild(script);
        });
    }
    
    async performMemoryCleanup() {
        console.log('执行内存清理');
        
        try {
            // 清理音频资源
            if (window.audioManager && window.audioManager.cleanup) {
                window.audioManager.cleanup();
            }
            
            // 清理图片缓存
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                if (img.complete && img.naturalWidth === 0) {
                    img.remove();
                }
            });
            
            // 强制垃圾回收（如果支持）
            if (window.gc) {
                window.gc();
            }
            
            return true;
        } catch (error) {
            console.warn('内存清理失败:', error);
            return false;
        }
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    logRecoverySuccess(errorInfo, strategyName) {
        const successLog = {
            originalError: errorInfo,
            strategy: strategyName,
            timestamp: Date.now(),
            type: 'recovery-success'
        };
        
        this.errorLog.push(successLog);
        console.log('🎉 错误恢复成功:', successLog);
    }
    
    reportCriticalError(errorInfo) {
        console.error('🚨 关键错误，无法自动恢复:', errorInfo);
        
        // 可以在这里添加错误上报逻辑
        // 例如发送到错误监控服务
        
        // 显示用户友好的错误提示
        this.showErrorNotification(errorInfo);
    }
    
    showErrorNotification(errorInfo) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm';
        notification.innerHTML = `
            <div class="flex items-start space-x-3">
                <i class="fas fa-exclamation-triangle text-yellow-300 mt-1"></i>
                <div class="flex-1">
                    <div class="font-semibold">系统遇到问题</div>
                    <div class="text-sm opacity-90 mt-1">我们正在尝试修复，请稍后再试</div>
                    <button class="text-sm underline mt-2" onclick="location.reload()">刷新页面</button>
                </div>
                <button class="text-white/70 hover:text-white" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // 10秒后自动移除
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 10000);
    }
    
    startErrorMonitoring() {
        // 定期检查系统健康状态
        setInterval(() => {
            this.performHealthCheck();
        }, 60000); // 每分钟检查一次
    }
    
    performHealthCheck() {
        // 检查内存使用
        if (performance.memory && performance.memory.usedJSHeapSize > 100 * 1024 * 1024) {
            this.handleError({
                type: 'memory-warning',
                message: 'High memory usage detected',
                memoryUsed: performance.memory.usedJSHeapSize,
                timestamp: Date.now()
            });
        }
        
        // 检查关键组件状态
        const criticalComponents = ['imageManager', 'audioManager'];
        criticalComponents.forEach(componentName => {
            const component = window[componentName];
            if (component && component.isInitialized === false) {
                this.handleError({
                    type: 'component-failure',
                    message: `${componentName} is not initialized`,
                    component: componentName,
                    timestamp: Date.now()
                });
            }
        });
    }
    
    getErrorReport() {
        return {
            totalErrors: this.errorLog.length,
            recentErrors: this.errorLog.slice(-10),
            recoveryAttempts: Object.fromEntries(this.recoveryAttempts),
            isActive: this.isActive
        };
    }
    
    cleanup() {
        this.isActive = false;
        this.errorLog = [];
        this.recoveryAttempts.clear();
        console.log('错误恢复系统已清理');
    }
}

// 自动启动错误恢复系统
document.addEventListener('DOMContentLoaded', () => {
    window.errorRecoverySystem = new ErrorRecoverySystem();
});

// 页面卸载时清理
window.addEventListener('beforeunload', () => {
    if (window.errorRecoverySystem) {
        window.errorRecoverySystem.cleanup();
    }
});

// 导出供其他模块使用
window.ErrorRecoverySystem = ErrorRecoverySystem;