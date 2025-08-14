/**
 * 系统健康检查器 - 监控网站各个组件的运行状态
 * 提供实时的系统状态监控和问题诊断
 */

class SystemHealthChecker {
    constructor() {
        this.components = {
            imageManager: { status: 'unknown', lastCheck: null, errors: [] },
            audioManager: { status: 'unknown', lastCheck: null, errors: [] },
            oceanAudioGenerator: { status: 'unknown', lastCheck: null, errors: [] },
            weatherService: { status: 'unknown', lastCheck: null, errors: [] },
            loadingManager: { status: 'unknown', lastCheck: null, errors: [] }
        };
        
        this.checkInterval = null;
        this.isMonitoring = false;
        this.healthIndicator = null;
        
        this.init();
    }
    
    init() {
        this.createHealthIndicator();
        this.startMonitoring();
        console.log('🏥 系统健康检查器已启动');
    }
    
    createHealthIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'system-health-indicator';
        indicator.className = 'fixed top-4 left-4 z-50 bg-white/90 backdrop-blur-md rounded-lg shadow-lg p-2 transition-all duration-300';
        indicator.style.display = 'none';
        
        indicator.innerHTML = `
            <div class="flex items-center space-x-2">
                <div id="health-status-icon" class="w-3 h-3 rounded-full bg-gray-400"></div>
                <span id="health-status-text" class="text-xs font-medium text-gray-600">检查中...</span>
                <button id="health-details-btn" class="text-xs text-blue-600 hover:text-blue-800">详情</button>
            </div>
        `;
        
        document.body.appendChild(indicator);
        this.healthIndicator = indicator;
        
        // 绑定详情按钮事件
        document.getElementById('health-details-btn')?.addEventListener('click', () => {
            this.showHealthDetails();
        });
    }
    
    startMonitoring() {
        if (this.isMonitoring) return;
        
        this.isMonitoring = true;
        
        // 立即执行一次检查
        this.performHealthCheck();
        
        // 每30秒检查一次
        this.checkInterval = setInterval(() => {
            this.performHealthCheck();
        }, 30000);
    }
    
    stopMonitoring() {
        this.isMonitoring = false;
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
    }
    
    async performHealthCheck() {
        const timestamp = Date.now();
        let overallHealth = 'healthy';
        let healthyCount = 0;
        let totalCount = 0;
        
        // 检查图片管理器
        try {
            if (window.imageManager && window.imageManager.isInitialized) {
                this.components.imageManager.status = 'healthy';
                healthyCount++;
            } else {
                this.components.imageManager.status = 'warning';
                this.components.imageManager.errors.push('未初始化或初始化失败');
            }
        } catch (error) {
            this.components.imageManager.status = 'error';
            this.components.imageManager.errors.push(error.message);
        }
        this.components.imageManager.lastCheck = timestamp;
        totalCount++;
        
        // 检查音频管理器
        try {
            if (window.audioManager && window.audioManager.isInitialized) {
                this.components.audioManager.status = 'healthy';
                healthyCount++;
            } else {
                this.components.audioManager.status = 'warning';
                this.components.audioManager.errors.push('未初始化或初始化失败');
            }
        } catch (error) {
            this.components.audioManager.status = 'error';
            this.components.audioManager.errors.push(error.message);
        }
        this.components.audioManager.lastCheck = timestamp;
        totalCount++;
        
        // 检查海洋音效生成器
        try {
            if (window.audioManager && window.audioManager.oceanGenerator && window.audioManager.oceanGenerator.isInitialized) {
                this.components.oceanAudioGenerator.status = 'healthy';
                healthyCount++;
            } else {
                this.components.oceanAudioGenerator.status = 'warning';
                this.components.oceanAudioGenerator.errors.push('未初始化或初始化失败');
            }
        } catch (error) {
            this.components.oceanAudioGenerator.status = 'error';
            this.components.oceanAudioGenerator.errors.push(error.message);
        }
        this.components.oceanAudioGenerator.lastCheck = timestamp;
        totalCount++;
        
        // 检查天气服务
        try {
            if (window.weatherService) {
                // 检查天气服务的各项功能
                const isAutoUpdateRunning = window.weatherService.updateInterval !== null;
                const hasRecentUpdate = window.weatherService.getLastUpdateTime();
                const cacheSize = window.weatherService.cache.size;
                
                if (isAutoUpdateRunning && hasRecentUpdate) {
                    this.components.weatherService.status = 'healthy';
                    this.components.weatherService.errors = []; // 清除之前的错误
                    healthyCount++;
                } else if (!isAutoUpdateRunning) {
                    this.components.weatherService.status = 'warning';
                    this.components.weatherService.errors = ['自动更新已停止'];
                } else {
                    this.components.weatherService.status = 'warning';
                    this.components.weatherService.errors = ['尚未获取天气数据'];
                }
                
                // 添加额外信息
                this.components.weatherService.info = {
                    autoUpdate: isAutoUpdateRunning,
                    lastUpdate: hasRecentUpdate ? window.weatherService.getFormattedUpdateTime() : '未更新',
                    cacheSize: cacheSize
                };
            } else {
                this.components.weatherService.status = 'warning';
                this.components.weatherService.errors.push('未初始化');
            }
        } catch (error) {
            this.components.weatherService.status = 'error';
            this.components.weatherService.errors.push(error.message);
        }
        this.components.weatherService.lastCheck = timestamp;
        totalCount++;
        
        // 检查加载管理器
        try {
            if (window.loadingManager) {
                this.components.loadingManager.status = 'healthy';
                healthyCount++;
            } else {
                this.components.loadingManager.status = 'warning';
                this.components.loadingManager.errors.push('未初始化');
            }
        } catch (error) {
            this.components.loadingManager.status = 'error';
            this.components.loadingManager.errors.push(error.message);
        }
        this.components.loadingManager.lastCheck = timestamp;
        totalCount++;
        
        // 计算整体健康状态
        const healthRatio = healthyCount / totalCount;
        if (healthRatio >= 0.8) {
            overallHealth = 'healthy';
        } else if (healthRatio >= 0.5) {
            overallHealth = 'warning';
        } else {
            overallHealth = 'error';
        }
        
        this.updateHealthIndicator(overallHealth, healthyCount, totalCount);
    }
    
    updateHealthIndicator(status, healthyCount, totalCount) {
        const icon = document.getElementById('health-status-icon');
        const text = document.getElementById('health-status-text');
        
        if (!icon || !text) return;
        
        // 更新图标颜色
        icon.className = 'w-3 h-3 rounded-full';
        switch (status) {
            case 'healthy':
                icon.classList.add('bg-green-500');
                break;
            case 'warning':
                icon.classList.add('bg-yellow-500');
                break;
            case 'error':
                icon.classList.add('bg-red-500');
                break;
            default:
                icon.classList.add('bg-gray-400');
        }
        
        // 更新状态文本
        text.textContent = `${healthyCount}/${totalCount} 正常`;
        
        // 显示健康指示器（仅在有问题时显示）
        if (status !== 'healthy') {
            this.healthIndicator.style.display = 'block';
        } else {
            // 健康状态下隐藏指示器
            setTimeout(() => {
                this.healthIndicator.style.display = 'none';
            }, 3000);
        }
    }
    
    showHealthDetails() {
        const modal = this.createModal('系统健康状态', this.generateHealthReport());
        document.body.appendChild(modal);
    }
    
    generateHealthReport() {
        let report = '<div class="space-y-4">';
        
        Object.entries(this.components).forEach(([name, component]) => {
            const statusColor = component.status === 'healthy' ? 'text-green-600' : 
                               component.status === 'warning' ? 'text-yellow-600' : 'text-red-600';
            const statusIcon = component.status === 'healthy' ? '✅' : 
                              component.status === 'warning' ? '⚠️' : '❌';
            
            report += `
                <div class="border rounded-lg p-3">
                    <div class="flex items-center justify-between mb-2">
                        <span class="font-medium">${this.getComponentDisplayName(name)}</span>
                        <span class="${statusColor}">${statusIcon} ${component.status}</span>
                    </div>
                    <div class="text-sm text-gray-600">
                        最后检查: ${component.lastCheck ? new Date(component.lastCheck).toLocaleTimeString() : '未检查'}
                    </div>
                    ${component.info && name === 'weatherService' ? `
                        <div class="mt-2 p-2 bg-blue-50 rounded text-sm">
                            <div class="grid grid-cols-2 gap-2">
                                <div>自动更新: ${component.info.autoUpdate ? '✅ 运行中' : '❌ 已停止'}</div>
                                <div>缓存大小: ${component.info.cacheSize}</div>
                                <div class="col-span-2">上次更新: ${component.info.lastUpdate}</div>
                            </div>
                        </div>
                    ` : ''}
                    ${component.errors.length > 0 ? `
                        <div class="mt-2">
                            <div class="text-sm font-medium text-red-600">错误信息:</div>
                            <ul class="text-sm text-red-500 list-disc list-inside">
                                ${component.errors.slice(-3).map(error => `<li>${error}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            `;
        });
        
        report += '</div>';
        return report;
    }
    
    getComponentDisplayName(name) {
        const displayNames = {
            imageManager: '图片管理器',
            audioManager: '音频管理器',
            oceanAudioGenerator: '海洋音效生成器',
            weatherService: '天气服务',
            loadingManager: '加载管理器'
        };
        return displayNames[name] || name;
    }
    
    createModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
                <div class="flex items-center justify-between p-4 border-b">
                    <h3 class="text-lg font-semibold">${title}</h3>
                    <button class="text-gray-400 hover:text-gray-600" onclick="this.closest('.fixed').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="p-4">
                    ${content}
                </div>
            </div>
        `;
        
        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        return modal;
    }
    
    // 清理错误记录
    clearErrors(componentName) {
        if (this.components[componentName]) {
            this.components[componentName].errors = [];
        }
    }
    
    // 获取系统整体状态
    getOverallStatus() {
        const statuses = Object.values(this.components).map(c => c.status);
        const healthyCount = statuses.filter(s => s === 'healthy').length;
        const totalCount = statuses.length;
        
        if (healthyCount === totalCount) return 'healthy';
        if (healthyCount >= totalCount * 0.8) return 'warning';
        return 'error';
    }
}

// 自动启动系统健康检查
document.addEventListener('DOMContentLoaded', () => {
    // 延迟启动，确保其他组件已初始化
    setTimeout(() => {
        window.systemHealthChecker = new SystemHealthChecker();
    }, 2000);
});

// 导出供其他模块使用
window.SystemHealthChecker = SystemHealthChecker;