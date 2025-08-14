// 霞浦主题视频生成器
class XiapuVideoGenerator {
    constructor(canvas, width = 1280, height = 720) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = width;
        this.height = height;
        this.canvas.width = width;
        this.canvas.height = height;
        
        this.frame = 0;
        this.isPlaying = false;
        this.animationId = null;
    }
    
    // 绘制滩涂日出场景
    drawSunriseScene() {
        const ctx = this.ctx;
        const time = this.frame * 0.02;
        
        // 清空画布
        ctx.clearRect(0, 0, this.width, this.height);
        
        // 绘制天空渐变
        const skyGradient = ctx.createLinearGradient(0, 0, 0, this.height * 0.6);
        const sunProgress = Math.sin(time * 0.5) * 0.5 + 0.5;
        
        if (sunProgress < 0.3) {
            // 黎明前
            skyGradient.addColorStop(0, '#1a1a2e');
            skyGradient.addColorStop(1, '#16213e');
        } else if (sunProgress < 0.7) {
            // 日出时分
            skyGradient.addColorStop(0, '#ff6b6b');
            skyGradient.addColorStop(0.5, '#ffa726');
            skyGradient.addColorStop(1, '#42a5f5');
        } else {
            // 日出后
            skyGradient.addColorStop(0, '#87ceeb');
            skyGradient.addColorStop(1, '#98d8e8');
        }
        
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, this.width, this.height * 0.6);
        
        // 绘制太阳
        const sunX = this.width * 0.8;
        const sunY = this.height * 0.3 + Math.sin(time * 0.3) * 50;
        const sunRadius = 40 + Math.sin(time * 0.8) * 5;
        
        const sunGradient = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius);
        sunGradient.addColorStop(0, '#ffeb3b');
        sunGradient.addColorStop(0.7, '#ff9800');
        sunGradient.addColorStop(1, 'rgba(255, 152, 0, 0)');
        
        ctx.fillStyle = sunGradient;
        ctx.beginPath();
        ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制滩涂
        const mudflatsY = this.height * 0.6;
        const mudflatsGradient = ctx.createLinearGradient(0, mudflatsY, 0, this.height);
        mudflatsGradient.addColorStop(0, '#8d6e63');
        mudflatsGradient.addColorStop(0.5, '#5d4037');
        mudflatsGradient.addColorStop(1, '#3e2723');
        
        ctx.fillStyle = mudflatsGradient;
        ctx.fillRect(0, mudflatsY, this.width, this.height - mudflatsY);
        
        // 绘制水面反射
        for (let i = 0; i < 5; i++) {
            const waveY = mudflatsY + 20 + i * 30;
            const waveOffset = Math.sin(time + i * 0.5) * 10;
            
            ctx.strokeStyle = `rgba(135, 206, 235, ${0.3 - i * 0.05})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            for (let x = 0; x < this.width; x += 10) {
                const y = waveY + Math.sin((x + waveOffset) * 0.01) * 5;
                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
        }
        
        // 绘制渔船剪影
        const boatX = 200 + Math.sin(time * 0.2) * 50;
        const boatY = mudflatsY + 40;
        
        ctx.fillStyle = '#2c3e50';
        ctx.beginPath();
        ctx.ellipse(boatX, boatY, 60, 15, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 船桅
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(boatX, boatY - 15);
        ctx.lineTo(boatX, boatY - 60);
        ctx.stroke();
        
        // 绘制标题文字
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('霞浦滩涂日出', this.width / 2, this.height * 0.15);
        
        ctx.font = '24px Arial';
        ctx.fillText('中国最美滩涂摄影天堂', this.width / 2, this.height * 0.2);
        
        this.frame++;
    }
    
    // 绘制渔民劳作场景
    drawFishingScene() {
        const ctx = this.ctx;
        const time = this.frame * 0.03;
        
        ctx.clearRect(0, 0, this.width, this.height);
        
        // 绘制海洋背景
        const oceanGradient = ctx.createLinearGradient(0, 0, 0, this.height);
        oceanGradient.addColorStop(0, '#87ceeb');
        oceanGradient.addColorStop(0.5, '#4682b4');
        oceanGradient.addColorStop(1, '#2e8b57');
        
        ctx.fillStyle = oceanGradient;
        ctx.fillRect(0, 0, this.width, this.height);
        
        // 绘制养殖架
        for (let i = 0; i < 8; i++) {
            const x = 100 + i * 150;
            const y = 200 + Math.sin(time + i * 0.5) * 20;
            
            // 垂直支柱
            ctx.strokeStyle = '#8b4513';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, this.height);
            ctx.stroke();
            
            // 横向绳索
            ctx.strokeStyle = '#654321';
            ctx.lineWidth = 2;
            for (let j = 0; j < 5; j++) {
                const ropeY = y + 50 + j * 80;
                ctx.beginPath();
                ctx.moveTo(x - 50, ropeY);
                ctx.lineTo(x + 50, ropeY + Math.sin(time + j) * 5);
                ctx.stroke();
            }
        }
        
        // 绘制渔船
        const boatX = 400 + Math.sin(time * 0.5) * 100;
        const boatY = 300 + Math.sin(time * 0.8) * 15;
        
        ctx.fillStyle = '#d32f2f';
        ctx.beginPath();
        ctx.ellipse(boatX, boatY, 80, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 渔民剪影
        ctx.fillStyle = '#2c3e50';
        ctx.beginPath();
        ctx.ellipse(boatX - 20, boatY - 25, 15, 25, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制海鸥
        for (let i = 0; i < 3; i++) {
            const birdX = 200 + i * 300 + Math.sin(time + i) * 50;
            const birdY = 100 + Math.sin(time * 2 + i) * 30;
            
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(birdX - 10, birdY);
            ctx.lineTo(birdX, birdY - 5);
            ctx.lineTo(birdX + 10, birdY);
            ctx.stroke();
        }
        
        // 标题
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('海上牧场', this.width / 2, 80);
        
        ctx.font = '24px Arial';
        ctx.fillText('渔民的勤劳与智慧', this.width / 2, 120);
        
        this.frame++;
    }
    
    // 绘制摄影主题场景
    drawPhotographyScene() {
        const ctx = this.ctx;
        const time = this.frame * 0.025;
        
        ctx.clearRect(0, 0, this.width, this.height);
        
        // 绘制黄昏天空
        const skyGradient = ctx.createLinearGradient(0, 0, 0, this.height);
        skyGradient.addColorStop(0, '#ff7043');
        skyGradient.addColorStop(0.3, '#ff9800');
        skyGradient.addColorStop(0.7, '#ffc107');
        skyGradient.addColorStop(1, '#ffeb3b');
        
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, this.width, this.height);
        
        // 绘制摄影师剪影
        const photographerX = this.width * 0.3;
        const photographerY = this.height * 0.7;
        
        ctx.fillStyle = '#2c3e50';
        // 身体
        ctx.fillRect(photographerX - 10, photographerY - 60, 20, 60);
        // 头部
        ctx.beginPath();
        ctx.arc(photographerX, photographerY - 70, 15, 0, Math.PI * 2);
        ctx.fill();
        // 相机
        ctx.fillRect(photographerX - 15, photographerY - 50, 30, 15);
        // 镜头
        ctx.beginPath();
        ctx.arc(photographerX + 20, photographerY - 42, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制三脚架
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(photographerX - 30, photographerY);
        ctx.lineTo(photographerX - 10, photographerY - 40);
        ctx.moveTo(photographerX + 30, photographerY);
        ctx.lineTo(photographerX + 10, photographerY - 40);
        ctx.moveTo(photographerX, photographerY);
        ctx.lineTo(photographerX, photographerY - 40);
        ctx.stroke();
        
        // 绘制光线效果
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3 + time;
            const startX = this.width * 0.8;
            const startY = this.height * 0.2;
            const endX = startX + Math.cos(angle) * 200;
            const endY = startY + Math.sin(angle) * 200;
            
            const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
            gradient.addColorStop(0, 'rgba(255, 235, 59, 0.8)');
            gradient.addColorStop(1, 'rgba(255, 235, 59, 0)');
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }
        
        // 标题
        ctx.fillStyle = 'rgba(44, 62, 80, 0.9)';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('摄影天堂', this.width / 2, this.height * 0.15);
        
        ctx.font = '24px Arial';
        ctx.fillText('捕捉霞浦的每一个美丽瞬间', this.width / 2, this.height * 0.2);
        
        this.frame++;
    }
    
    // 开始播放动画
    play(sceneType = 'sunrise') {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        this.frame = 0;
        
        const animate = () => {
            if (!this.isPlaying) return;
            
            switch (sceneType) {
                case 'sunrise':
                    this.drawSunriseScene();
                    break;
                case 'fishing':
                    this.drawFishingScene();
                    break;
                case 'photography':
                    this.drawPhotographyScene();
                    break;
            }
            
            this.animationId = requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    // 停止播放
    stop() {
        this.isPlaying = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
    
    // 重置
    reset() {
        this.stop();
        this.frame = 0;
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = XiapuVideoGenerator;
} else {
    window.XiapuVideoGenerator = XiapuVideoGenerator;
}