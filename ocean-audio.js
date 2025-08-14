/**
 * 海洋音效生成器 - 使用Web Audio API生成真实的海洋环境音效
 * 为霞浦旅游网站提供沉浸式的海洋背景音乐体验
 */

class OceanAudioGenerator {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.isPlaying = false;
        this.sources = [];
        this.effects = {
            waves: null,
            seagulls: null,
            wind: null,
            bubbles: null
        };
        this.volume = 0.3;
        this.currentScene = 'calm'; // calm, sunrise, stormy
        this.isInitialized = false;
    }
    
    async init() {
        try {
            // 检查Web Audio API支持
            if (!window.AudioContext && !window.webkitAudioContext) {
                console.warn('Web Audio API 不支持');
                return false;
            }
            
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // 检查音频上下文状态
            if (this.audioContext.state === 'suspended') {
                console.log('音频上下文已暂停，等待用户交互激活');
            }
            
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = this.volume;
            this.masterGain.connect(this.audioContext.destination);
            
            this.isInitialized = true;
            console.log('✅ 海洋音效生成器初始化成功');
            return true;
        } catch (error) {
            console.warn('❌ Web Audio API 初始化失败:', error);
            return false;
        }
    }
    
    // 确保音频上下文已激活
    async ensureAudioContextActive() {
        if (!this.audioContext) {
            return false;
        }
        
        if (this.audioContext.state === 'suspended') {
            try {
                await this.audioContext.resume();
                console.log('音频上下文已激活');
            } catch (error) {
                console.warn('激活音频上下文失败:', error);
                return false;
            }
        }
        
        return true;
    }
    
    // 生成海浪声
    createWaveSound() {
        const bufferSize = this.audioContext.sampleRate * 4; // 4秒循环
        const buffer = this.audioContext.createBuffer(2, bufferSize, this.audioContext.sampleRate);
        
        for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
            const channelData = buffer.getChannelData(channel);
            
            for (let i = 0; i < bufferSize; i++) {
                const time = i / this.audioContext.sampleRate;
                
                // 主要海浪频率 (0.1-0.3 Hz)
                const mainWave = Math.sin(2 * Math.PI * 0.2 * time) * 0.4;
                
                // 次要海浪频率 (0.05-0.15 Hz)
                const secondWave = Math.sin(2 * Math.PI * 0.1 * time) * 0.3;
                
                // 高频泡沫声 (200-800 Hz)
                const foam = (Math.random() - 0.5) * 0.1 * 
                    Math.sin(2 * Math.PI * (200 + Math.random() * 600) * time);
                
                // 低频隆隆声 (20-60 Hz)
                const rumble = Math.sin(2 * Math.PI * (20 + Math.random() * 40) * time) * 0.2;
                
                // 组合所有声音
                let sample = mainWave + secondWave + foam + rumble;
                
                // 添加自然的音量变化
                const envelope = 0.5 + 0.5 * Math.sin(2 * Math.PI * 0.05 * time);
                sample *= envelope;
                
                // 限制音量
                channelData[i] = Math.tanh(sample * 0.7);
            }
        }
        
        return buffer;
    }
    
    // 生成海鸥声
    createSeagullSound() {
        const bufferSize = this.audioContext.sampleRate * 2;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const channelData = buffer.getChannelData(0);
        
        // 生成海鸥叫声的频率模式
        for (let i = 0; i < bufferSize; i++) {
            const time = i / this.audioContext.sampleRate;
            
            if (Math.random() < 0.001) { // 随机触发海鸥叫声
                const frequency = 800 + Math.random() * 400; // 800-1200 Hz
                const duration = 0.3 + Math.random() * 0.4; // 0.3-0.7秒
                
                if (time % 8 < duration) { // 每8秒可能出现一次
                    const envelope = Math.exp(-time % 8 * 3); // 衰减包络
                    const vibrato = 1 + 0.1 * Math.sin(2 * Math.PI * 5 * time); // 颤音
                    channelData[i] = Math.sin(2 * Math.PI * frequency * vibrato * time) * envelope * 0.3;
                }
            }
        }
        
        return buffer;
    }
    
    // 生成海风声
    createWindSound() {
        const bufferSize = this.audioContext.sampleRate * 6;
        const buffer = this.audioContext.createBuffer(2, bufferSize, this.audioContext.sampleRate);
        
        for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
            const channelData = buffer.getChannelData(channel);
            
            for (let i = 0; i < bufferSize; i++) {
                const time = i / this.audioContext.sampleRate;
                
                // 低频风声 (50-200 Hz)
                const lowWind = (Math.random() - 0.5) * 0.3 * 
                    Math.sin(2 * Math.PI * (50 + Math.random() * 150) * time);
                
                // 中频风声 (200-800 Hz)
                const midWind = (Math.random() - 0.5) * 0.2 * 
                    Math.sin(2 * Math.PI * (200 + Math.random() * 600) * time);
                
                // 高频风声 (800-2000 Hz)
                const highWind = (Math.random() - 0.5) * 0.1 * 
                    Math.sin(2 * Math.PI * (800 + Math.random() * 1200) * time);
                
                // 风的强度变化
                const windIntensity = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(2 * Math.PI * 0.03 * time));
                
                channelData[i] = (lowWind + midWind + highWind) * windIntensity;
            }
        }
        
        return buffer;
    }
    
    // 生成气泡声
    createBubbleSound() {
        const bufferSize = this.audioContext.sampleRate * 3;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const channelData = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            const time = i / this.audioContext.sampleRate;
            
            if (Math.random() < 0.002) { // 随机气泡
                const frequency = 1000 + Math.random() * 2000; // 1-3 kHz
                const decay = Math.exp(-time % 1 * 10);
                channelData[i] = Math.sin(2 * Math.PI * frequency * time) * decay * 0.1;
            }
        }
        
        return buffer;
    }
    
    // 播放特定音效
    playEffect(effectName, buffer, volume = 1, loop = true) {
        if (!this.audioContext || !buffer) return null;
        
        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();
        
        source.buffer = buffer;
        source.loop = loop;
        
        gainNode.gain.value = volume;
        
        source.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        source.start();
        
        this.sources.push({ source, gainNode, effectName });
        
        return { source, gainNode };
    }
    
    // 开始播放海洋环境音
    async startOceanAmbient(scene = 'calm') {
        if (!this.audioContext) {
            const initialized = await this.init();
            if (!initialized) return false;
        }
        
        // 恢复音频上下文
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
        
        this.currentScene = scene;
        this.stopAll();
        
        // 根据场景调整音效组合
        switch (scene) {
            case 'calm':
                this.effects.waves = this.playEffect('waves', this.createWaveSound(), 0.8);
                this.effects.wind = this.playEffect('wind', this.createWindSound(), 0.3);
                this.effects.seagulls = this.playEffect('seagulls', this.createSeagullSound(), 0.4);
                break;
                
            case 'sunrise':
                this.effects.waves = this.playEffect('waves', this.createWaveSound(), 0.6);
                this.effects.wind = this.playEffect('wind', this.createWindSound(), 0.2);
                this.effects.seagulls = this.playEffect('seagulls', this.createSeagullSound(), 0.6);
                this.effects.bubbles = this.playEffect('bubbles', this.createBubbleSound(), 0.3);
                break;
                
            case 'stormy':
                this.effects.waves = this.playEffect('waves', this.createWaveSound(), 1.0);
                this.effects.wind = this.playEffect('wind', this.createWindSound(), 0.8);
                this.effects.seagulls = this.playEffect('seagulls', this.createSeagullSound(), 0.2);
                break;
        }
        
        this.isPlaying = true;
        return true;
    }
    
    // 停止所有音效
    stopAll() {
        this.sources.forEach(({ source }) => {
            try {
                source.stop();
            } catch (e) {
                // 忽略已经停止的音源
            }
        });
        this.sources = [];
        this.effects = { waves: null, seagulls: null, wind: null, bubbles: null };
        this.isPlaying = false;
    }
    
    // 停止播放并清理资源
    stop() {
        if (!this.isInitialized) return;
        
        this.isPlaying = false;
        
        // 停止所有音频源
        this.sources.forEach(source => {
            try {
                if (source.stop) {
                    source.stop();
                }
                if (source.disconnect) {
                    source.disconnect();
                }
            } catch (error) {
                console.warn('停止音频源时出错:', error);
            }
        });
        this.sources = [];
        
        // 清理效果
        Object.keys(this.effects).forEach(key => {
            if (this.effects[key] && this.effects[key].disconnect) {
                try {
                    this.effects[key].disconnect();
                } catch (error) {
                    console.warn('断开音频效果时出错:', error);
                }
            }
            this.effects[key] = null;
        });
        
        console.log('海洋音效已停止并清理资源');
    }
    
    // 清理资源
    cleanup() {
        this.stop();
        
        if (this.masterGain) {
            try {
                this.masterGain.disconnect();
            } catch (error) {
                console.warn('断开主增益节点时出错:', error);
            }
            this.masterGain = null;
        }
        
        if (this.audioContext && this.audioContext.state !== 'closed') {
            try {
                this.audioContext.close();
            } catch (error) {
                console.warn('关闭音频上下文时出错:', error);
            }
        }
        
        this.audioContext = null;
        this.isInitialized = false;
        console.log('海洋音效生成器资源已清理');
    }
    
    // 设置音量
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        if (this.masterGain) {
            this.masterGain.gain.setTargetAtTime(this.volume, this.audioContext.currentTime, 0.1);
        }
    }
    
    // 淡入效果
    fadeIn(duration = 2) {
        if (!this.masterGain) return;
        
        this.masterGain.gain.setValueAtTime(0, this.audioContext.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(this.volume, this.audioContext.currentTime + duration);
    }
    
    // 淡出效果
    fadeOut(duration = 2) {
        if (!this.masterGain) return;
        
        this.masterGain.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration);
        
        setTimeout(() => {
            this.stopAll();
        }, duration * 1000);
    }
    
    // 切换场景
    changeScene(newScene) {
        if (newScene === this.currentScene) return;
        
        const wasPlaying = this.isPlaying;
        
        if (wasPlaying) {
            this.fadeOut(1);
            setTimeout(() => {
                this.startOceanAmbient(newScene);
                this.fadeIn(1);
            }, 1000);
        } else {
            this.currentScene = newScene;
        }
    }
    
    // 获取当前状态
    getStatus() {
        return {
            isPlaying: this.isPlaying,
            volume: this.volume,
            scene: this.currentScene,
            contextState: this.audioContext ? this.audioContext.state : 'not-initialized'
        };
    }
}

// 导出供其他模块使用
window.OceanAudioGenerator = OceanAudioGenerator;