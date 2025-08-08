// 英雄区域视频背景生成器
class HeroVideoBackground {
    constructor(container) {
        this.container = container;
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        this.frame = 0;
        this.isPlaying = false;
        
        this.init();
    }
    
    init() {
        // 创建Canvas元素
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'absolute inset-0 w-full h-full object-cover';
        this.canvas.style.zIndex = '1';
        this.ctx = this.canvas.getContext('2d');
        
        // 设置Canvas尺寸
        this.updateCanvasSize();
        
        // 插入到容器中
        this.container.insertBefore(this.canvas, this.container.firstChild);
        
        // 监听窗口大小变化
        window.addEventListener('resize', () => this.updateCanvasSize());
        
        // 开始播放
        this.play();
    }
    
    updateCanvasSize() {
        const rect = this.container.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    drawBackground() {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        const time = this.frame * 0.01;
        
        // 清空画布
        ctx.clearRect(0, 0, width, height);
        
        // 绘制动态渐变背景
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        
        // 根据时间变化调整颜色
        const hue1 = (200 + Math.sin(time * 0.5) * 30) % 360;
        const hue2 = (30 + Math.cos(time * 0.3) * 20) % 360;
        
        gradient.addColorStop(0, `hsla(${hue1}, 70%, 60%, 0.8)`);
        gradient.addColorStop(0.5, `hsla(${(hue1 + hue2) / 2}, 65%, 55%, 0.7)`);
        gradient.addColorStop(1, `hsla(${hue2}, 75%, 65%, 0.8)`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // 绘制动态波浪
        this.drawWaves(ctx, width, height, time);
        
        // 绘制漂浮的光点
        this.drawFloatingLights(ctx, width, height, time);
        
        // 绘制远山剪影
        this.drawMountainSilhouette(ctx, width, height, time);
        
        this.frame++;
    }
    
    drawWaves(ctx, width, height, time) {
        const waveCount = 4;
        
        for (let i = 0; i < waveCount; i++) {
            const waveHeight = height * 0.1;
            const waveY = height * 0.7 + i * 30;
            const opacity = 0.3 - i * 0.05;
            const speed = 0.5 + i * 0.2;
            
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            for (let x = 0; x <= width; x += 5) {
                const y = waveY + Math.sin((x * 0.01) + (time * speed)) * waveHeight;
                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            ctx.stroke();
        }
    }
    
    drawFloatingLights(ctx, width, height, time) {
        const lightCount = 20;
        
        for (let i = 0; i < lightCount; i++) {
            const x = (width * 0.1) + (i * width * 0.8 / lightCount) + Math.sin(time + i) * 50;
            const y = (height * 0.2) + Math.sin(time * 0.7 + i * 0.5) * (height * 0.4);
            const radius = 2 + Math.sin(time * 2 + i) * 1;
            const opacity = 0.3 + Math.sin(time * 1.5 + i) * 0.2;
            
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 3);
            gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, radius * 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    drawMountainSilhouette(ctx, width, height, time) {
        const mountainHeight = height * 0.3;
        const mountainY = height * 0.6;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.moveTo(0, height);
        
        // 绘制山峰轮廓
        for (let x = 0; x <= width; x += 20) {
            const baseHeight = mountainHeight * (0.5 + 0.3 * Math.sin(x * 0.005));
            const variation = Math.sin(x * 0.01 + time * 0.1) * 20;
            const y = mountainY - baseHeight + variation;
            ctx.lineTo(x, y);
        }
        
        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fill();
        
        // 绘制第二层山峰（更远的）
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.beginPath();
        ctx.moveTo(0, height);
        
        for (let x = 0; x <= width; x += 25) {
            const baseHeight = mountainHeight * 0.7 * (0.6 + 0.2 * Math.sin(x * 0.003));
            const variation = Math.sin(x * 0.008 + time * 0.05) * 15;
            const y = mountainY - baseHeight + variation;
            ctx.lineTo(x, y);
        }
        
        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fill();
    }
    
    play() {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        
        const animate = () => {
            if (!this.isPlaying) return;
            
            this.drawBackground();
            this.animationId = requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    stop() {
        this.isPlaying = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
    
    destroy() {
        this.stop();
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        window.removeEventListener('resize', () => this.updateCanvasSize());
    }
}

// 自动初始化英雄区域背景
document.addEventListener('DOMContentLoaded', function() {
    const heroSection = document.querySelector('#hero');
    if (heroSection) {
        // 延迟初始化，确保页面完全加载
        setTimeout(() => {
            new HeroVideoBackground(heroSection);
        }, 1000);
    }
});

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HeroVideoBackground;
} else {
    window.HeroVideoBackground = HeroVideoBackground;
}