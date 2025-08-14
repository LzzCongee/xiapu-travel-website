/**
 * 性能监控器 - 监控网站性能指标并提供优化建议
 * 检测内存使用、加载时间、渲染性能等关键指标
 */

class PerformanceMonitor {
    constructor() {
        this.metrics = {
            pageLoadTime: 0,
            domContentLoadedTime: 0,
            firstPaintTime: 0,
            firstContentfulPaintTime: 0,
            memoryUsage: { used: 0, total: 0 },
            imageLoadStats: { total: 0, loaded: 0, failed: 0 },
            audioInitTime: 0,
            lastUpdateTime: Date.now()
        };
        
        this.observers = [];
        this.isMonitoring = false;
        this.performanceLog = [];
        
        this.init();
    }
    
    init() {
        this.collectInitialMetrics();
        this.setupPerformanceObservers();
        this.startMonitoring();
        console.log('📊 性能监控器已启动');
    }
    
    collectInitialMetrics() {
        // 收集页面加载时间
        if (performance.timing) {
            const timing = performance.timing;
            this.metrics.pageLoadTime = timing.loadEventEnd - timing.navigationStart;
            this.metrics.domContentLoadedTime = timing.domContentLoadedEventEnd - timing.navigationStart;
        }
        
        // 收集Paint时间
        if (performance.getEntriesByType) {
            const paintEntries = performance.getEntriesByType('paint');
            paintEntries.forEach(entry => {
                if (entry.name === 'first-paint') {
                    this.metrics.firstPaintTime = entry.startTime;
                } else if (entry.name === 'first-contentful-paint') {
                    this.metrics.firstContentfulPaintTime = entry.startTime;
                }
            });
        }
        
        // 收集内存使用情况
        this.updateMemoryUsage();
    }
    
    setupPerformanceObservers() {
        // 观察长任务
        if ('PerformanceObserver' in window) {
            try {
                const longTaskObserver = new PerformanceObserver((list) => {
                    list.getEntries().forEach(entry => {
                        if (entry.duration > 50) { // 超过50ms的任务
                            this.logPerformanceIssue('long-task', {
                                duration: entry.duration,
                                startTime: entry.startTime,
                                name: entry.name
                            });
                        }
                    });
                });
                longTaskObserver.observe({ entryTypes: ['longtask'] });
                this.observers.push(longTaskObserver);
            } catch (error) {
                console.warn('长任务观察器不支持:', error);
            }
            
            // 观察资源加载
            try {
                const resourceObserver = new PerformanceObserver((list) => {
                    list.getEntries().forEach(entry => {
                        if (entry.duration > 3000) { // 超过3秒的资源加载
                            this.logPerformanceIssue('slow-resource', {
                                name: entry.name,
                                duration: entry.duration,
                                size: entry.transferSize
                            });
                        }
                    });
                });
                resourceObserver.observe({ entryTypes: ['resource'] });
                this.observers.push(resourceObserver);
            } catch (error) {
                console.warn('资源观察器不支持:', error);
            }
        }
    }
    
    startMonitoring() {
        if (this.isMonitoring) return;
        
        this.isMonitoring = true;
        
        // 每10秒更新一次指标
        this.monitoringInterval = setInterval(() => {
            this.updateMetrics();
        }, 10000);
        
        // 每分钟检查一次性能问题
        this.checkInterval = setInterval(() => {
            this.checkPerformanceIssues();
        }, 60000);
    }
    
    stopMonitoring() {
        this.isMonitoring = false;
        
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
        }
        
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
        }
        
        // 清理观察器
        this.observers.forEach(observer => {
            try {
                observer.disconnect();
            } catch (error) {
                console.warn('断开性能观察器时出错:', error);
            }
        });
        this.observers = [];
    }
    
    updateMetrics() {
        // 更新内存使用
        this.updateMemoryUsage();
        
        // 更新图片加载统计
        this.updateImageLoadStats();
        
        // 更新时间戳
        this.metrics.lastUpdateTime = Date.now();
    }
    
    updateMemoryUsage() {
        if (performance.memory) {
            this.metrics.memoryUsage = {
                used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024), // MB
                total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024), // MB
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024) // MB
            };
        }
    }
    
    updateImageLoadStats() {
        if (window.imageManager && window.imageManager.imageStats) {
            this.metrics.imageLoadStats = { ...window.imageManager.imageStats };
        }
    }
    
    checkPerformanceIssues() {
        const issues = [];
        
        // 检查内存使用
        if (this.metrics.memoryUsage.used > 100) { // 超过100MB
            issues.push({
                type: 'high-memory',
                severity: 'warning',
                message: `内存使用过高: ${this.metrics.memoryUsage.used}MB`,
                suggestion: '考虑清理未使用的资源或优化图片加载'
            });
        }
        
        // 检查图片加载失败率
        const imageStats = this.metrics.imageLoadStats;
        if (imageStats.total > 0) {
            const failureRate = imageStats.failed / imageStats.total;
            if (failureRate > 0.2) { // 失败率超过20%
                issues.push({
                    type: 'high-image-failure',
                    severity: 'error',
                    message: `图片加载失败率过高: ${Math.round(failureRate * 100)}%`,
                    suggestion: '检查图片URL或网络连接'
                });
            }
        }
        
        // 检查页面加载时间
        if (this.metrics.pageLoadTime > 5000) { // 超过5秒
            issues.push({
                type: 'slow-page-load',
                severity: 'warning',
                message: `页面加载时间过长: ${Math.round(this.metrics.pageLoadTime)}ms`,
                suggestion: '优化资源加载顺序或减少资源大小'
            });
        }
        
        // 如果有问题，记录并可选择性地通知用户
        if (issues.length > 0) {
            this.logPerformanceIssues(issues);
        }
    }
    
    logPerformanceIssue(type, data) {
        const issue = {
            type,
            data,
            timestamp: Date.now()
        };
        
        this.performanceLog.push(issue);
        
        // 保持日志大小在合理范围内
        if (this.performanceLog.length > 100) {
            this.performanceLog = this.performanceLog.slice(-50);
        }
        
        console.warn('性能问题:', issue);
    }
    
    logPerformanceIssues(issues) {
        issues.forEach(issue => {
            this.logPerformanceIssue('performance-check', issue);
        });
    }
    
    getPerformanceReport() {
        return {
            metrics: { ...this.metrics },
            issues: this.performanceLog.slice(-20), // 最近20个问题
            recommendations: this.generateRecommendations()
        };
    }
    
    generateRecommendations() {
        const recommendations = [];
        
        // 基于当前指标生成建议
        if (this.metrics.memoryUsage.used > 50) {
            recommendations.push('考虑实现图片懒加载以减少内存使用');
        }
        
        if (this.metrics.imageLoadStats.failed > 0) {
            recommendations.push('检查失败的图片URL并提供备用图片');
        }
        
        if (this.metrics.firstContentfulPaintTime > 2000) {
            recommendations.push('优化关键资源的加载顺序以提高首屏渲染速度');
        }
        
        return recommendations;
    }
    
    // 创建性能报告模态框
    showPerformanceReport() {
        const report = this.getPerformanceReport();
        const modal = this.createModal('性能报告', this.generateReportHTML(report));
        document.body.appendChild(modal);
    }
    
    generateReportHTML(report) {
        const { metrics, issues, recommendations } = report;
        
        return `
            <div class="space-y-6">
                <!-- 基础指标 -->
                <div>
                    <h4 class="font-semibold mb-3">基础指标</h4>
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div class="bg-blue-50 p-3 rounded">
                            <div class="font-medium">页面加载时间</div>
                            <div class="text-blue-600">${Math.round(metrics.pageLoadTime)}ms</div>
                        </div>
                        <div class="bg-green-50 p-3 rounded">
                            <div class="font-medium">首屏渲染时间</div>
                            <div class="text-green-600">${Math.round(metrics.firstContentfulPaintTime)}ms</div>
                        </div>
                        <div class="bg-purple-50 p-3 rounded">
                            <div class="font-medium">内存使用</div>
                            <div class="text-purple-600">${metrics.memoryUsage.used}MB / ${metrics.memoryUsage.total}MB</div>
                        </div>
                        <div class="bg-orange-50 p-3 rounded">
                            <div class="font-medium">图片加载</div>
                            <div class="text-orange-600">${metrics.imageLoadStats.loaded}/${metrics.imageLoadStats.total}</div>
                        </div>
                    </div>
                </div>
                
                <!-- 最近问题 -->
                ${issues.length > 0 ? `
                    <div>
                        <h4 class="font-semibold mb-3">最近问题 (${issues.length})</h4>
                        <div class="space-y-2 max-h-40 overflow-y-auto">
                            ${issues.slice(-5).map(issue => `
                                <div class="text-sm p-2 bg-red-50 rounded border-l-4 border-red-400">
                                    <div class="font-medium">${issue.type}</div>
                                    <div class="text-gray-600">${new Date(issue.timestamp).toLocaleTimeString()}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <!-- 优化建议 -->
                ${recommendations.length > 0 ? `
                    <div>
                        <h4 class="font-semibold mb-3">优化建议</h4>
                        <ul class="space-y-2 text-sm">
                            ${recommendations.map(rec => `
                                <li class="flex items-start space-x-2">
                                    <i class="fas fa-lightbulb text-yellow-500 mt-0.5"></i>
                                    <span>${rec}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    createModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
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
    
    // 清理资源
    cleanup() {
        this.stopMonitoring();
        this.performanceLog = [];
        console.log('性能监控器资源已清理');
    }
}

// 自动启动性能监控
document.addEventListener('DOMContentLoaded', () => {
    // 延迟启动，确保页面基本加载完成
    setTimeout(() => {
        window.performanceMonitor = new PerformanceMonitor();
        
        // 添加快捷键查看性能报告 (Ctrl+Shift+P)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'P') {
                e.preventDefault();
                window.performanceMonitor.showPerformanceReport();
            }
        });
    }, 3000);
});

// 页面卸载时清理
window.addEventListener('beforeunload', () => {
    if (window.performanceMonitor) {
        window.performanceMonitor.cleanup();
    }
});

// 导出供其他模块使用
window.PerformanceMonitor = PerformanceMonitor;