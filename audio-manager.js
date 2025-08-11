/**
 * 音频管理器 - 为霞浦旅游网站提供背景音乐功能
 * 支持多种海洋风格的背景音乐，提供完整的播放控制
 */

class AudioManager {
    constructor() {
        this.audioContext = null;
        this.currentAudio = null;
        this.isPlaying = false;
        this.volume = 0.3;
        this.currentTrack = 0;
        this.isInitialized = false;
        this.fadeInterval = null;
        
        // 海洋音效生成器
        this.oceanGenerator = null;
        
        // 音乐场景列表 - 使用Web Audio API生成的海洋音效
        this.tracks = [
            {
                name: '海浪轻语',
                scene: 'calm',
                description: '宁静的海浪声，营造平和的海边氛围',
                generated: true
            },
            {
                name: '晨曦海韵', 
                scene: 'sunrise',
                description: '清晨海边的自然声音，适合日出场景',
                generated: true
            },
            {
                name: '渔港风暴',
                scene: 'stormy',
                description: '壮观的海浪声与海风声的完美结合',
                generated: true
            }
        ];
        
        this.init();
    }
    
    async init() {
        try {
            // 创建音频控制界面
            this.createAudioControls();
            
            // 初始化海洋音效生成器
            this.oceanGenerator = new OceanAudioGenerator();
            const initialized = await this.oceanGenerator.init();
            
            if (initialized) {
                // 设置初始场景
                this.updateTrackInfo(this.tracks[0]);
                this.isInitialized = true;
                console.log('音频管理器初始化成功 - 使用海洋音效生成器');
            } else {
                throw new Error('海洋音效生成器初始化失败');
            }
        } catch (error) {
            console.warn('音频初始化失败:', error);
            this.hideAudioControls();
        }
    }
    
    async initWebAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.warn('Web Audio API 不支持:', error);
        }
    }
    
    createAudioControls() {
        // 创建音频控制面板
        const controlsHTML = `
            <div id="audio-controls" class="fixed bottom-6 right-6 z-50 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-4 transition-all duration-300 transform translate-y-0">
                <div class="flex items-center space-x-3">
                    <!-- 播放/暂停按钮 -->
                    <button id="play-pause-btn" class="w-10 h-10 bg-ocean-blue hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-105">
                        <i class="fas fa-play text-xs"></i>
                    </button>
                    
                    <!-- 音量控制 -->
                    <div class="flex items-center space-x-3">
                        <i id="volume-icon" class="fas fa-volume-up text-gray-600 text-sm cursor-pointer hover:text-ocean-blue transition-colors duration-200" title="点击静音/取消静音"></i>
                        <div class="flex items-center space-x-2">
                            <input type="range" id="volume-slider" min="0" max="100" value="30" 
                                   class="w-20 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer" title="拖动调节音量">
                            <span id="volume-display" class="text-xs text-gray-600 font-medium min-w-[2rem]">30%</span>
                        </div>
                    </div>
                    
                    <!-- 曲目信息 -->
                    <div class="hidden md:block">
                        <div id="track-name" class="text-xs font-medium text-gray-800">海浪轻语</div>
                        <div id="track-description" class="text-xs text-gray-500">轻柔的海浪声</div>
                        <div class="text-xs text-gray-400 mt-1" title="键盘快捷键：空格=播放/暂停，↑↓=音量，M=静音，N=下一首">
                            <i class="fas fa-keyboard mr-1"></i>快捷键可用
                        </div>
                    </div>
                    
                    <!-- 下一首按钮 -->
                    <button id="next-track-btn" class="w-7 h-7 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full flex items-center justify-center transition-all duration-200">
                        <i class="fas fa-forward text-xs"></i>
                    </button>
                    
                    <!-- 最小化按钮 -->
                    <button id="minimize-audio-btn" class="w-7 h-7 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full flex items-center justify-center transition-all duration-200">
                        <i class="fas fa-minus text-xs"></i>
                    </button>
                </div>
                
                <!-- 进度条 -->
                <div class="mt-3 hidden" id="progress-container">
                    <div class="flex items-center space-x-2 text-xs text-gray-500">
                        <span id="current-time">0:00</span>
                        <div class="flex-1 bg-gray-200 rounded-full h-1">
                            <div id="progress-bar" class="bg-ocean-blue h-1 rounded-full transition-all duration-300" style="width: 0%"></div>
                        </div>
                        <span id="total-time">0:00</span>
                    </div>
                </div>
            </div>
            
            <!-- 最小化状态的音频控制 -->
            <div id="audio-controls-mini" class="fixed bottom-6 right-6 z-50 bg-ocean-blue text-white rounded-full w-12 h-12 flex items-center justify-center shadow-xl cursor-pointer transition-all duration-300 transform scale-0">
                <i class="fas fa-music text-xs"></i>
            </div>
        `;
        
        // 插入到页面中
        document.body.insertAdjacentHTML('beforeend', controlsHTML);
        
        // 绑定事件
        this.bindAudioEvents();
    }
    
    bindAudioEvents() {
        const playPauseBtn = document.getElementById('play-pause-btn');
        const volumeSlider = document.getElementById('volume-slider');
        const nextTrackBtn = document.getElementById('next-track-btn');
        const minimizeBtn = document.getElementById('minimize-audio-btn');
        const miniControls = document.getElementById('audio-controls-mini');
        const fullControls = document.getElementById('audio-controls');
        const volumeIcon = document.getElementById('volume-icon');
        
        // 存储静音前的音量
        this.previousVolume = this.volume;
        
        // 播放/暂停
        playPauseBtn?.addEventListener('click', () => {
            this.togglePlayPause();
        });
        
        // 音量控制
        volumeSlider?.addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            this.setVolume(volume);
            
            // 更新音量显示
            const volumeDisplay = document.getElementById('volume-display');
            const volumeIcon = document.getElementById('volume-icon');
            
            if (volumeDisplay) {
                volumeDisplay.textContent = `${e.target.value}%`;
            }
            
            // 根据音量大小更新图标
            if (volumeIcon) {
                if (volume === 0) {
                    volumeIcon.className = 'fas fa-volume-mute text-gray-600 text-sm';
                } else if (volume < 0.3) {
                    volumeIcon.className = 'fas fa-volume-down text-gray-600 text-sm';
                } else if (volume < 0.7) {
                    volumeIcon.className = 'fas fa-volume-up text-gray-600 text-sm';
                } else {
                    volumeIcon.className = 'fas fa-volume-up text-ocean-blue text-sm';
                }
            }
            
            // 更新滑块背景渐变
            const percentage = e.target.value;
            e.target.style.background = `linear-gradient(to right, #0ea5e9 0%, #0ea5e9 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`;
        });
        
        // 下一首
        nextTrackBtn?.addEventListener('click', () => {
            this.nextTrack();
        });
        
        // 音量图标点击静音/取消静音
        volumeIcon?.addEventListener('click', () => {
            if (this.volume > 0) {
                // 静音
                this.previousVolume = this.volume;
                this.setVolume(0);
            } else {
                // 取消静音，恢复之前的音量
                this.setVolume(this.previousVolume || 0.3);
            }
        });
        
        // 最小化/展开
        minimizeBtn?.addEventListener('click', () => {
            fullControls.style.transform = 'translateY(100px) scale(0.8)';
            fullControls.style.opacity = '0';
            setTimeout(() => {
                fullControls.style.display = 'none';
                miniControls.style.transform = 'scale(1)';
            }, 300);
        });
        
        miniControls?.addEventListener('click', () => {
            miniControls.style.transform = 'scale(0)';
            setTimeout(() => {
                fullControls.style.display = 'block';
                fullControls.style.transform = 'translateY(0) scale(1)';
                fullControls.style.opacity = '1';
            }, 100);
        });
        
        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            // 只在没有输入框聚焦时响应快捷键
            if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
                switch(e.key) {
                    case ' ': // 空格键播放/暂停
                        e.preventDefault();
                        this.togglePlayPause();
                        break;
                    case 'ArrowUp': // 上箭头增加音量
                        e.preventDefault();
                        this.setVolume(Math.min(1, this.volume + 0.1));
                        break;
                    case 'ArrowDown': // 下箭头减少音量
                        e.preventDefault();
                        this.setVolume(Math.max(0, this.volume - 0.1));
                        break;
                    case 'm': // M键静音/取消静音
                    case 'M':
                        e.preventDefault();
                        if (this.volume > 0) {
                            this.previousVolume = this.volume;
                            this.setVolume(0);
                        } else {
                            this.setVolume(this.previousVolume || 0.3);
                        }
                        break;
                    case 'n': // N键下一首
                    case 'N':
                        e.preventDefault();
                        this.nextTrack();
                        break;
                }
            }
        });
    }
    
    // 方法已移除，现在使用海洋音效生成器
    
    // 这些方法已被海洋音效生成器替代
    
    async togglePlayPause() {
        if (!this.isInitialized) {
            await this.init();
        }
        
        // 处理用户交互激活音频上下文
        if (this.audioContext && this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
        
        const playPauseBtn = document.getElementById('play-pause-btn');
        const icon = playPauseBtn?.querySelector('i');
        
        if (this.isPlaying) {
            this.pause();
            icon?.classList.replace('fa-pause', 'fa-play');
        } else {
            this.play();
            icon?.classList.replace('fa-play', 'fa-pause');
        }
    }
    
    async play() {
        try {
            if (this.oceanGenerator) {
                const track = this.tracks[this.currentTrack];
                const success = await this.oceanGenerator.startOceanAmbient(track.scene);
                if (success) {
                    this.oceanGenerator.fadeIn(2);
                    this.isPlaying = true;
                    console.log(`开始播放: ${track.name}`);
                }
            }
        } catch (error) {
            console.warn('播放失败:', error);
        }
    }
    
    pause() {
        if (this.oceanGenerator && this.isPlaying) {
            this.oceanGenerator.fadeOut(1);
            this.isPlaying = false;
            console.log('暂停播放');
        }
    }
    
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        
        if (this.oceanGenerator) {
            this.oceanGenerator.setVolume(this.volume);
        }
        
        // 同步更新UI显示
        const volumeSlider = document.getElementById('volume-slider');
        const volumeDisplay = document.getElementById('volume-display');
        const volumeIcon = document.getElementById('volume-icon');
        
        if (volumeSlider) {
            const percentage = Math.round(this.volume * 100);
            volumeSlider.value = percentage;
            volumeSlider.style.background = `linear-gradient(to right, #0ea5e9 0%, #0ea5e9 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`;
        }
        
        if (volumeDisplay) {
            volumeDisplay.textContent = `${Math.round(this.volume * 100)}%`;
        }
        
        if (volumeIcon) {
            if (this.volume === 0) {
                volumeIcon.className = 'fas fa-volume-mute text-gray-600 text-sm';
            } else if (this.volume < 0.3) {
                volumeIcon.className = 'fas fa-volume-down text-gray-600 text-sm';
            } else if (this.volume < 0.7) {
                volumeIcon.className = 'fas fa-volume-up text-gray-600 text-sm';
            } else {
                volumeIcon.className = 'fas fa-volume-up text-ocean-blue text-sm';
            }
        }
    }
    
    nextTrack() {
        this.currentTrack = (this.currentTrack + 1) % this.tracks.length;
        const track = this.tracks[this.currentTrack];
        
        this.updateTrackInfo(track);
        
        if (this.isPlaying && this.oceanGenerator) {
            this.oceanGenerator.changeScene(track.scene);
        }
        
        console.log(`切换到: ${track.name}`);
    }
    
    updateTrackInfo(track) {
        const trackName = document.getElementById('track-name');
        const trackDescription = document.getElementById('track-description');
        
        if (trackName) trackName.textContent = track.name;
        if (trackDescription) trackDescription.textContent = track.description;
    }
    
    // 淡入淡出效果由海洋音效生成器处理
    
    hideAudioControls() {
        const controls = document.getElementById('audio-controls');
        const miniControls = document.getElementById('audio-controls-mini');
        
        if (controls) controls.style.display = 'none';
        if (miniControls) miniControls.style.display = 'none';
    }
    
    // 根据页面内容自动调整音乐
    adaptToContent() {
        const currentSection = this.getCurrentSection();
        let newTrack = this.currentTrack;
        
        switch (currentSection) {
            case 'hero':
                newTrack = 0; // 海浪轻语 - calm
                break;
            case 'scenery':
                newTrack = 1; // 晨曦海韵 - sunrise
                break;
            case 'culture':
            case 'food':
                newTrack = 2; // 渔港风暴 - stormy
                break;
            default:
                newTrack = 0;
        }
        
        if (newTrack !== this.currentTrack) {
            this.currentTrack = newTrack;
            const track = this.tracks[this.currentTrack];
            this.updateTrackInfo(track);
            
            if (this.isPlaying && this.oceanGenerator) {
                this.oceanGenerator.changeScene(track.scene);
            }
        }
    }
    
    getCurrentSection() {
        const sections = ['hero', 'scenery', 'culture', 'food', 'travel'];
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        
        for (const sectionId of sections) {
            const section = document.getElementById(sectionId);
            if (section) {
                const rect = section.getBoundingClientRect();
                const sectionTop = rect.top + window.scrollY;
                const sectionBottom = sectionTop + rect.height;
                
                if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
                    return sectionId;
                }
            }
        }
        
        return 'hero';
    }
}

// 全局音频管理器实例
let audioManager = null;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 延迟初始化，避免影响页面加载性能
    setTimeout(() => {
        audioManager = new AudioManager();
        
        // 显示音频提示
        setTimeout(() => {
            showAudioHint();
        }, 3000);
        
        // 监听滚动事件，根据内容调整音乐
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                if (audioManager && audioManager.isPlaying) {
                    audioManager.adaptToContent();
                }
            }, 1000);
        });
        
    }, 2000);
});

// 显示音频提示
function showAudioHint() {
    const hint = document.getElementById('audio-hint');
    const enableBtn = document.getElementById('enable-audio-btn');
    const closeBtn = document.getElementById('close-audio-hint');
    
    if (!hint) return;
    
    // 显示提示
    hint.style.transform = 'translateX(0)';
    
    // 绑定事件
    enableBtn?.addEventListener('click', () => {
        if (audioManager) {
            audioManager.togglePlayPause();
        }
        hideAudioHint();
    });
    
    closeBtn?.addEventListener('click', () => {
        hideAudioHint();
    });
    
    // 5秒后自动隐藏
    setTimeout(() => {
        if (hint.style.transform === 'translateX(0px)') {
            hideAudioHint();
        }
    }, 8000);
}

// 隐藏音频提示
function hideAudioHint() {
    const hint = document.getElementById('audio-hint');
    if (hint) {
        hint.style.transform = 'translateX(100%)';
    }
}

// 导出供其他模块使用
window.AudioManager = AudioManager;