# 霞浦旅游网站 Git 发布指南

## 📋 项目概述

这是一个现代化的霞浦旅游网站，包含以下特性：
- 🎨 响应式设计，支持多设备访问
- 🖼️ 智能图片管理和懒加载
- 🎬 动态视频背景
- ⚡ Service Worker 缓存优化
- 📱 微信扫码分享功能
- 🔍 图片搜索演示功能

## 🚀 快速发布到 Git 仓库

### 步骤 1: 准备 Git 仓库

#### 方法一：在 GitHub 上创建新仓库
1. 登录 [GitHub](https://github.com)
2. 点击右上角的 "+" 按钮，选择 "New repository"
3. 填写仓库信息：
   - Repository name: `xiapu-travel-website`
   - Description: `霞浦旅游网站 - 中国最美滩涂摄影天堂`
   - 选择 Public（公开）或 Private（私有）
   - 不要勾选 "Initialize this repository with a README"
4. 点击 "Create repository"

#### 方法二：使用其他 Git 平台
- **Gitee（码云）**: https://gitee.com - 国内访问速度快
- **GitLab**: https://gitlab.com - 功能丰富
- **Coding**: https://coding.net - 腾讯旗下平台

### 步骤 2: 初始化本地 Git 仓库

在项目根目录执行以下命令：

```bash
# 初始化 Git 仓库
git init

# 添加所有文件到暂存区
git add .

# 创建首次提交
git commit -m "🎉 初始化霞浦旅游网站项目

✨ 功能特性:
- 响应式设计支持多设备
- 智能图片管理和懒加载
- 动态视频背景效果
- Service Worker 缓存优化
- 微信扫码分享功能
- 图片搜索演示功能

📁 项目结构:
- index.html - 主页面
- main.js - 核心JavaScript逻辑
- image-manager.js - 图片管理系统
- hero-video.js - 视频背景控制
- sw.js - Service Worker缓存
- performance-optimizer.js - 性能优化"

# 添加远程仓库地址（替换为您的仓库地址）
git remote add origin https://github.com/您的用户名/xiapu-travel-website.git

# 推送到远程仓库
git push -u origin main
```

### 步骤 3: 创建 .gitignore 文件

```bash
# 创建 .gitignore 文件
cat > .gitignore << EOF
# 系统文件
.DS_Store
Thumbs.db

# 编辑器文件
.vscode/
.idea/
*.swp
*.swo

# 日志文件
*.log
logs/

# 临时文件
tmp/
temp/

# 缓存文件
.cache/
node_modules/

# 环境变量文件
.env
.env.local
.env.production

# 构建输出
dist/
build/
EOF
```

### 步骤 4: 创建项目 README

```bash
cat > README.md << EOF
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

## 🚀 快速开始

### 在线访问
- **主站**: [https://your-domain.com](https://your-domain.com)
- **演示**: [https://your-demo.vercel.app](https://your-demo.vercel.app)

### 本地运行
1. 克隆项目
\`\`\`bash
git clone https://github.com/您的用户名/xiapu-travel-website.git
cd xiapu-travel-website
\`\`\`

2. 使用本地服务器运行
\`\`\`bash
# 使用 Python
python -m http.server 8000

# 使用 Node.js
npx serve .

# 使用 PHP
php -S localhost:8000
\`\`\`

3. 访问 http://localhost:8000

## 📁 项目结构

\`\`\`
xiapu-travel-website/
├── index.html                 # 主页面
├── main.js                   # 核心JavaScript逻辑
├── image-manager.js          # 图片管理系统
├── hero-video.js            # 视频背景控制
├── video-generator.js       # 视频生成器
├── sw.js                    # Service Worker
├── performance-optimizer.js  # 性能优化
├── images/                  # 图片资源目录
├── DEPLOYMENT_GUIDE.md      # 部署指南
├── OPTIMIZATION_REPORT.md   # 优化报告
└── README.md               # 项目说明
\`\`\`

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
编辑 \`index.html\` 中的以下部分：
- 网站标题和描述
- 联系信息
- 社交媒体链接

### 更换图片资源
1. 将新图片放入 \`images/\` 目录
2. 更新 \`main.js\` 中的图片路径
3. 运行图片优化脚本

### 自定义样式
- 主要样式使用 Tailwind CSS 类名
- 自定义CSS写在 \`<style>\` 标签内
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
2. 创建功能分支 (\`git checkout -b feature/AmazingFeature\`)
3. 提交更改 (\`git commit -m 'Add some AmazingFeature'\`)
4. 推送到分支 (\`git push origin feature/AmazingFeature\`)
5. 创建 Pull Request

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

---

⭐ 如果这个项目对您有帮助，请给它一个星标！
EOF
```

## 🔄 持续更新和维护

### 日常更新流程

```bash
# 拉取最新代码
git pull origin main

# 查看文件状态
git status

# 添加修改的文件
git add .

# 提交更改
git commit -m "✨ 添加新功能: 描述您的更改"

# 推送到远程仓库
git push origin main
```

### 版本管理

```bash
# 创建版本标签
git tag -a v1.0.0 -m "🎉 发布 v1.0.0 版本"

# 推送标签
git push origin v1.0.0

# 查看所有标签
git tag -l
```

### 分支管理

```bash
# 创建开发分支
git checkout -b develop

# 创建功能分支
git checkout -b feature/new-gallery

# 合并分支
git checkout main
git merge feature/new-gallery

# 删除已合并的分支
git branch -d feature/new-gallery
```

## 🌐 自动部署设置

### GitHub Actions (推荐)

创建 `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./
```

### Vercel 自动部署

1. 连接 GitHub 仓库到 Vercel
2. 每次推送代码自动触发部署
3. 获得预览链接和生产链接

## 📈 SEO 和推广

### 搜索引擎优化
- ✅ 已配置完整的 meta 标签
- ✅ 已添加 Open Graph 标签
- ✅ 已设置结构化数据
- 🔄 建议添加 sitemap.xml

### 社交媒体分享
- ✅ 微信扫码分享已优化
- ✅ 社交媒体预览图已配置
- 🔄 可添加更多社交平台支持

## 🛡️ 安全和备份

### 定期备份
```bash
# 创建备份分支
git checkout -b backup-$(date +%Y%m%d)
git push origin backup-$(date +%Y%m%d)
```

### 安全检查
- 定期更新依赖
- 检查敏感信息泄露
- 监控网站安全状态

---

🎉 **恭喜！** 您的霞浦旅游网站现在已经可以发布到 Git 仓库了！

按照以上步骤操作后，您的网站将：
- ✅ 托管在 Git 仓库中
- ✅ 支持版本控制和协作
- ✅ 可以自动部署到多个平台
- ✅ 具备完整的项目文档
- ✅ 支持持续集成和部署

如需帮助，请查看项目中的 `DEPLOYMENT_GUIDE.md` 文件获取更详细的部署说明。