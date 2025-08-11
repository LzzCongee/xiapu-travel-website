// 移动端调试工具
class MobileDebugger {
    constructor() {
        this.debugInfo = {};
        this.init();
    }

    init() {
        // 只在移动设备上启用
        if (this.isMobile()) {
            this.collectDebugInfo();
            this.createDebugPanel();
            this.addDebugButton();
        }
    }

    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    collectDebugInfo() {
        this.debugInfo = {
            // 设备信息
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine,
            
            // 屏幕信息
            screenWidth: screen.width,
            screenHeight: screen.height,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            devicePixelRatio: window.devicePixelRatio,
            
            // 网络信息
            connection: this.getConnectionInfo(),
            
            // 位置信息
            location: {
                href: window.location.href,
                hostname: window.location.hostname,
                protocol: window.location.protocol,
                port: window.location.port
            },
            
            // 时间信息
            timestamp: new Date().toISOString(),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            
            // 浏览器特性检测
            features: this.detectFeatures(),
            
            // DNS 信息
            dnsInfo: this.checkDNS()
        };
    }

    getConnectionInfo() {
        if ('connection' in navigator) {
            const conn = navigator.connection;
            return {
                effectiveType: conn.effectiveType,
                downlink: conn.downlink,
                rtt: conn.rtt,
                saveData: conn.saveData
            };
        }
        return null;
    }

    detectFeatures() {
        return {
            serviceWorker: 'serviceWorker' in navigator,
            localStorage: typeof(Storage) !== 'undefined',
            sessionStorage: typeof(Storage) !== 'undefined',
            geolocation: 'geolocation' in navigator,
            touchEvents: 'ontouchstart' in window,
            webGL: this.checkWebGL(),
            webRTC: this.checkWebRTC(),
            css3D: this.checkCSS3D()
        };
    }

    checkWebGL() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && canvas.getContext('webgl'));
        } catch (e) {
            return false;
        }
    }

    checkWebRTC() {
        return !!(window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection);
    }

    checkCSS3D() {
        const el = document.createElement('div');
        el.style.transform = 'translate3d(0,0,0)';
        return el.style.transform !== '';
    }

    async checkDNS() {
        const domains = [
            'vercel.com',
            'cdn.tailwindcss.com',
            'cdnjs.cloudflare.com'
        ];
        
        const results = {};
        
        for (const domain of domains) {
            try {
                const start = performance.now();
                const response = await fetch(`https://${domain}/favicon.ico`, { 
                    method: 'HEAD',
                    mode: 'no-cors',
                    cache: 'no-cache'
                });
                const end = performance.now();
                
                results[domain] = {
                    accessible: true,
                    responseTime: Math.round(end - start)
                };
            } catch (error) {
                results[domain] = {
                    accessible: false,
                    error: error.message
                };
            }
        }
        
        return results;
    }

    createDebugPanel() {
        const panel = document.createElement('div');
        panel.id = 'mobile-debug-panel';
        panel.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            z-index: 10000;
            padding: 20px;
            overflow-y: auto;
            font-family: monospace;
            font-size: 12px;
            line-height: 1.4;
            display: none;
        `;

        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="margin: 0; color: #00ff00;">📱 移动端调试信息</h2>
                <button onclick="this.parentElement.parentElement.style.display='none'" 
                        style="background: #ff4444; color: white; border: none; padding: 10px; border-radius: 5px;">
                    关闭
                </button>
            </div>
            <div id="debug-content"></div>
        `;

        document.body.appendChild(panel);
        this.updateDebugContent();
    }

    updateDebugContent() {
        const content = document.getElementById('debug-content');
        if (!content) return;

        content.innerHTML = `
            <div style="margin-bottom: 20px;">
                <h3 style="color: #00ff00; margin-bottom: 10px;">🌐 网络状态</h3>
                <p>在线状态: ${this.debugInfo.onLine ? '✅ 在线' : '❌ 离线'}</p>
                <p>连接类型: ${this.debugInfo.connection ? this.debugInfo.connection.effectiveType : '未知'}</p>
                <p>下载速度: ${this.debugInfo.connection ? this.debugInfo.connection.downlink + ' Mbps' : '未知'}</p>
                <p>延迟: ${this.debugInfo.connection ? this.debugInfo.connection.rtt + ' ms' : '未知'}</p>
            </div>

            <div style="margin-bottom: 20px;">
                <h3 style="color: #00ff00; margin-bottom: 10px;">📱 设备信息</h3>
                <p>用户代理: ${this.debugInfo.userAgent}</p>
                <p>平台: ${this.debugInfo.platform}</p>
                <p>语言: ${this.debugInfo.language}</p>
                <p>屏幕尺寸: ${this.debugInfo.screenWidth} x ${this.debugInfo.screenHeight}</p>
                <p>窗口尺寸: ${this.debugInfo.windowWidth} x ${this.debugInfo.windowHeight}</p>
                <p>像素比: ${this.debugInfo.devicePixelRatio}</p>
            </div>

            <div style="margin-bottom: 20px;">
                <h3 style="color: #00ff00; margin-bottom: 10px;">🌍 位置信息</h3>
                <p>当前URL: ${this.debugInfo.location.href}</p>
                <p>主机名: ${this.debugInfo.location.hostname}</p>
                <p>协议: ${this.debugInfo.location.protocol}</p>
                <p>端口: ${this.debugInfo.location.port || '默认'}</p>
                <p>时区: ${this.debugInfo.timezone}</p>
            </div>

            <div style="margin-bottom: 20px;">
                <h3 style="color: #00ff00; margin-bottom: 10px;">🔧 浏览器特性</h3>
                <p>Service Worker: ${this.debugInfo.features.serviceWorker ? '✅' : '❌'}</p>
                <p>本地存储: ${this.debugInfo.features.localStorage ? '✅' : '❌'}</p>
                <p>会话存储: ${this.debugInfo.features.sessionStorage ? '✅' : '❌'}</p>
                <p>地理位置: ${this.debugInfo.features.geolocation ? '✅' : '❌'}</p>
                <p>触摸事件: ${this.debugInfo.features.touchEvents ? '✅' : '❌'}</p>
                <p>WebGL: ${this.debugInfo.features.webGL ? '✅' : '❌'}</p>
                <p>WebRTC: ${this.debugInfo.features.webRTC ? '✅' : '❌'}</p>
                <p>CSS 3D: ${this.debugInfo.features.css3D ? '✅' : '❌'}</p>
            </div>

            <div style="margin-bottom: 20px;">
                <h3 style="color: #00ff00; margin-bottom: 10px;">🔍 DNS 检测</h3>
                <div id="dns-results">检测中...</div>
            </div>

            <div style="margin-bottom: 20px;">
                <h3 style="color: #00ff00; margin-bottom: 10px;">📋 操作建议</h3>
                <div id="suggestions"></div>
            </div>

            <div style="margin-bottom: 20px;">
                <button onclick="mobileDebugger.copyDebugInfo()" 
                        style="background: #0066cc; color: white; border: none; padding: 10px 20px; border-radius: 5px; margin-right: 10px;">
                    复制调试信息
                </button>
                <button onclick="mobileDebugger.testConnectivity()" 
                        style="background: #00aa00; color: white; border: none; padding: 10px 20px; border-radius: 5px;">
                    测试连接性
                </button>
            </div>
        `;

        this.updateDNSResults();
        this.generateSuggestions();
    }

    async updateDNSResults() {
        const dnsResults = document.getElementById('dns-results');
        if (!dnsResults) return;

        const dnsInfo = await this.checkDNS();
        let html = '';
        
        for (const [domain, info] of Object.entries(dnsInfo)) {
            const status = info.accessible ? '✅' : '❌';
            const time = info.responseTime ? ` (${info.responseTime}ms)` : '';
            const error = info.error ? ` - ${info.error}` : '';
            html += `<p>${domain}: ${status}${time}${error}</p>`;
        }
        
        dnsResults.innerHTML = html;
    }

    generateSuggestions() {
        const suggestions = document.getElementById('suggestions');
        if (!suggestions) return;

        const tips = [];

        // 网络相关建议
        if (!this.debugInfo.onLine) {
            tips.push('❌ 设备处于离线状态，请检查网络连接');
        }

        if (this.debugInfo.connection && this.debugInfo.connection.effectiveType === 'slow-2g') {
            tips.push('⚠️ 网络速度较慢，建议切换到更快的网络');
        }

        // 浏览器相关建议
        if (!this.debugInfo.features.localStorage) {
            tips.push('⚠️ 浏览器不支持本地存储，可能影响功能');
        }

        // DNS 相关建议
        if (this.debugInfo.location.protocol === 'http:') {
            tips.push('⚠️ 当前使用HTTP协议，建议使用HTTPS');
        }

        // 通用建议
        tips.push('💡 尝试清除浏览器缓存和Cookie');
        tips.push('💡 尝试切换到其他网络（WiFi/移动数据）');
        tips.push('💡 尝试使用其他浏览器访问');
        tips.push('💡 检查是否启用了VPN或代理');

        suggestions.innerHTML = tips.map(tip => `<p>${tip}</p>`).join('');
    }

    addDebugButton() {
        const button = document.createElement('button');
        button.innerHTML = '🐛';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #ff4444;
            color: white;
            border: none;
            font-size: 20px;
            z-index: 9999;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        `;

        button.addEventListener('click', () => {
            const panel = document.getElementById('mobile-debug-panel');
            if (panel) {
                panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
                if (panel.style.display === 'block') {
                    this.collectDebugInfo();
                    this.updateDebugContent();
                }
            }
        });

        document.body.appendChild(button);
    }

    copyDebugInfo() {
        const info = JSON.stringify(this.debugInfo, null, 2);
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(info).then(() => {
                alert('调试信息已复制到剪贴板');
            }).catch(() => {
                this.fallbackCopy(info);
            });
        } else {
            this.fallbackCopy(info);
        }
    }

    fallbackCopy(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            alert('调试信息已复制到剪贴板');
        } catch (err) {
            alert('复制失败，请手动复制调试信息');
        }
        
        document.body.removeChild(textArea);
    }

    async testConnectivity() {
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = '测试中...';
        button.disabled = true;

        try {
            // 测试主要资源
            const tests = [
                { name: 'Tailwind CSS', url: 'https://cdn.tailwindcss.com' },
                { name: 'Font Awesome', url: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css' },
                { name: 'QR Code Library', url: 'https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js' }
            ];

            const results = [];
            for (const test of tests) {
                try {
                    const start = performance.now();
                    await fetch(test.url, { method: 'HEAD', mode: 'no-cors' });
                    const end = performance.now();
                    results.push(`✅ ${test.name}: ${Math.round(end - start)}ms`);
                } catch (error) {
                    results.push(`❌ ${test.name}: ${error.message}`);
                }
            }

            alert('连接性测试结果:\n' + results.join('\n'));
        } catch (error) {
            alert('测试失败: ' + error.message);
        } finally {
            button.textContent = originalText;
            button.disabled = false;
        }
    }
}

// 初始化移动端调试器
const mobileDebugger = new MobileDebugger();

// 导出供其他脚本使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileDebugger;
}