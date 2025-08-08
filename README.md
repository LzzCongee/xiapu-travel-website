# 🌅 霞浦旅游网站

> 探索福建霞浦，中国最美滩涂摄影天堂

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fyour-domain.com)](https://your-domain.com)

## 🎯 项目简介

霞浦旅游网站是一个现代化的旅游推广平台，专门展示福建霞浦的自然美景、人文风情和旅游资源。网站采用响应式设计，为用户提供沉浸式的视觉体验。

## ✨ 功能特性

- 🎨 **响应式设计** - 完美适配桌面、平板、手机等各种设备
- 🖼️ **智能图片管理** - 自动懒加载、错误处理、性能优化
- 🎬 **动态视频背景** - 沉浸式视觉体验
- ⚡ **性能优化** - Service Worker缓存、资源压缩
- 📱 **微信分享** - 支持扫码分享，优化社交传播
- 🔍 **图片搜索** - 集成图片搜索演示功能
- 🌐 **SEO优化** - 完整的meta标签和结构化数据
- 🌤️ **实时天气** - 显示当地天气信息
- 🍽️ **美食推荐** - 展示当地特色美食

## 🚀 快速开始

### 在线访问
- **主站**: [https://your-domain.com](https://your-domain.com)
- **演示**: [https://your-demo.vercel.app](https://your-demo.vercel.app)

### 本地运行
1. 克隆项目
```bash
git clone https://github.com/您的用户名/xiapu-travel-website.git
cd xiapu-travel-website
```

2. 使用本地服务器运行
```bash
# 使用 Python
python -m http.server 8000

# 使用 Node.js
npx serve .

# 使用 PHP
php -S localhost:8000
```

3. 访问 http://localhost:8000

## 📁 项目结构

```
xiapu-travel-website/
├── index.html                 # 主页面
├── main.js                   # 核心JavaScript逻辑
├── image-manager.js          # 图片管理系统
├── hero-video.js            # 视频背景控制
├── video-generator.js       # 视频生成器
├── image-search-demo.js     # 图片搜索演示
├── sw.js                    # Service Worker
├── performance-optimizer.js  # 性能优化
├── video-placeholder.html   # 视频占位页面
├── images/                  # 图片资源目录
│   ├── fallback-*.svg      # 备用SVG图片
│   └── ...                 # 其他图片资源
├── DEPLOYMENT_GUIDE.md      # 部署指南
├── IMAGE_SYSTEM_README.md   # 图片系统说明
├── OPTIMIZATION_REPORT.md   # 优化报告
├── GIT_PUBLISH_GUIDE.md     # Git发布指南
├── .gitignore              # Git忽略文件
└── README.md               # 项目说明
```

## 🛠️ 技术栈

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **样式**: Tailwind CSS
- **图标**: Heroicons, Font Awesome
- **优化**: Service Worker, 图片懒加载
- **部署**: 支持 Vercel, Netlify, GitHub Pages

## 📱 功能模块

### 🏠 首页展示
- 动态视频背景
- 景点介绍轮播
- 美食推荐展示
- 实时天气信息

### 🖼️ 图片管理
- 智能懒加载
- 错误自动恢复
- 性能监控
- 缓存优化

### 🎬 视频系统
- 自适应播放
- 移动端优化
- 加载状态管理
- 错误处理

### 🔍 搜索功能
- 图片搜索演示
- 实时搜索结果
- 响应式布局

## 🚀 部署指南

### 免费部署平台

#### Vercel (推荐)
1. Fork 本仓库
2. 在 [Vercel](https://vercel.com) 导入项目
3. 自动部署完成

#### Netlify
1. 在 [Netlify](https://netlify.com) 连接 GitHub
2. 选择本仓库
3. 点击部署

#### GitHub Pages
1. 在仓库设置中启用 Pages
2. 选择 main 分支
3. 访问生成的链接

详细部署说明请查看 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## 🔧 自定义配置

### 修改网站信息
编辑 `index.html` 中的以下部分：
- 网站标题和描述
- 联系信息
- 社交媒体链接

### 更换图片资源
1. 将新图片放入 `images/` 目录
2. 更新 `main.js` 中的图片路径
3. 运行图片优化脚本

### 自定义样式
- 主要样式使用 Tailwind CSS 类名
- 自定义CSS写在 `<style>` 标签内
- 响应式断点已预配置

## 📊 性能优化

- ⚡ Service Worker 缓存策略
- 🖼️ 图片懒加载和压缩
- 📱 移动端优化
- 🔄 资源预加载
- 📈 性能监控

详细优化报告请查看 [OPTIMIZATION_REPORT.md](./OPTIMIZATION_REPORT.md)

## 🤝 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📝 提交规范

使用以下格式提交代码：

```
<type>(<scope>): <subject>

<body>

<footer>
```

类型说明：
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

示例：
```bash
git commit -m "feat(gallery): 添加图片画廊功能

- 实现图片懒加载
- 添加图片预览功能
- 优化移动端显示效果

Closes #123"
```

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

- 项目链接: [https://github.com/您的用户名/xiapu-travel-website](https://github.com/您的用户名/xiapu-travel-website)
- 问题反馈: [Issues](https://github.com/您的用户名/xiapu-travel-website/issues)

## 🙏 致谢

- [Tailwind CSS](https://tailwindcss.com) - 样式框架
- [Heroicons](https://heroicons.com) - 图标库
- [Unsplash](https://unsplash.com) - 图片资源
- 所有贡献者和支持者

## 📈 项目统计

- 🌟 Star 数量
- 🍴 Fork 数量
- 📊 代码行数: ~3000+
- 📁 文件数量: 15+
- 🎨 组件数量: 10+

---

⭐ 如果这个项目对您有帮助，请给它一个星标！

## 🔄 更新日志

### v1.0.0 (2025-01-08)
- 🎉 初始版本发布
- ✨ 完整的响应式设计
- 🖼️ 智能图片管理系统
- 🎬 动态视频背景
- ⚡ 性能优化和缓存
- 📱 微信分享功能
- 🔍 图片搜索演示

### 计划中的功能
- [ ] 多语言支持
- [ ] 用户评论系统
- [ ] 在线预订功能
- [ ] 更多交互动画
- [ ] PWA 支持
- [ ] 暗色主题
