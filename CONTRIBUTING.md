# 贡献指南

感谢您对霞浦旅游网站项目的关注！我们欢迎所有形式的贡献，包括但不限于：

- 🐛 报告 Bug
- 💡 提出新功能建议
- 📝 改进文档
- 🔧 提交代码修复
- ✨ 添加新功能

## 🚀 快速开始

### 1. Fork 项目

点击项目页面右上角的 "Fork" 按钮，将项目 fork 到您的 GitHub 账户。

### 2. 克隆项目

```bash
git clone https://github.com/您的用户名/xiapu-travel-website.git
cd xiapu-travel-website
```

### 3. 创建分支

```bash
git checkout -b feature/your-feature-name
```

### 4. 本地开发

使用任意本地服务器运行项目：

```bash
# 使用 Python
python -m http.server 8000

# 使用 Node.js
npx serve .

# 使用 PHP
php -S localhost:8000
```

访问 http://localhost:8000 查看效果。

## 📝 代码规范

### HTML 规范
- 使用语义化标签
- 保持良好的缩进（2个空格）
- 添加必要的注释
- 确保可访问性（添加 alt 属性等）

```html
<!-- 好的示例 -->
<section class="hero-section">
  <h1 class="hero-title">霞浦旅游</h1>
  <img src="image.jpg" alt="霞浦美景" class="hero-image">
</section>
```

### CSS 规范
- 优先使用 Tailwind CSS 类名
- 自定义 CSS 写在 `<style>` 标签内
- 使用有意义的类名
- 保持响应式设计

```css
/* 好的示例 */
.custom-component {
  @apply bg-blue-500 text-white p-4 rounded-lg;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .custom-component {
    @apply p-2 text-sm;
  }
}
```

### JavaScript 规范
- 使用 ES6+ 语法
- 使用模块化开发
- 添加错误处理
- 编写清晰的注释

```javascript
// 好的示例
export class ImageManager {
  constructor(options = {}) {
    this.options = {
      lazyLoad: true,
      errorRetry: 3,
      ...options
    };
  }

  /**
   * 加载图片
   * @param {string} src - 图片地址
   * @returns {Promise<HTMLImageElement>}
   */
  async loadImage(src) {
    try {
      const img = new Image();
      img.src = src;
      await this.waitForLoad(img);
      return img;
    } catch (error) {
      console.error('图片加载失败:', error);
      throw error;
    }
  }
}
```

## 📋 提交规范

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

### 提交格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 类型说明

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整（不影响功能）
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

### 示例

```bash
# 新功能
git commit -m "feat(gallery): 添加图片画廊功能

- 实现图片懒加载
- 添加图片预览功能
- 优化移动端显示效果

Closes #123"

# 修复 bug
git commit -m "fix(video): 修复移动端视频播放问题

修复了在 iOS Safari 中视频无法自动播放的问题

Fixes #456"

# 文档更新
git commit -m "docs: 更新 README 安装说明"
```

## 🔍 代码审查

### 提交 Pull Request 前的检查清单

- [ ] 代码符合项目规范
- [ ] 添加了必要的注释
- [ ] 测试了所有功能
- [ ] 确保响应式设计正常
- [ ] 检查了浏览器兼容性
- [ ] 更新了相关文档

### Pull Request 模板

```markdown
## 📝 变更说明

简要描述这次变更的内容和目的。

## 🔧 变更类型

- [ ] Bug 修复
- [ ] 新功能
- [ ] 文档更新
- [ ] 性能优化
- [ ] 代码重构

## 📋 测试清单

- [ ] 桌面端测试
- [ ] 移动端测试
- [ ] 不同浏览器测试
- [ ] 功能测试
- [ ] 性能测试

## 📷 截图

如果有 UI 变更，请提供截图。

## 📚 相关 Issue

Closes #issue_number
```

## 🐛 报告 Bug

### Bug 报告模板

```markdown
## 🐛 Bug 描述

清晰简洁地描述 bug。

## 🔄 重现步骤

1. 访问 '...'
2. 点击 '....'
3. 滚动到 '....'
4. 看到错误

## 🎯 期望行为

描述您期望发生的行为。

## 📷 截图

如果适用，添加截图来帮助解释您的问题。

## 🖥️ 环境信息

- 操作系统: [例如 iOS]
- 浏览器: [例如 chrome, safari]
- 版本: [例如 22]

## 📝 附加信息

添加任何其他关于问题的信息。
```

## 💡 功能建议

### 功能建议模板

```markdown
## 🚀 功能描述

清晰简洁地描述您想要的功能。

## 🎯 解决的问题

这个功能解决了什么问题？

## 💭 解决方案

描述您希望如何实现这个功能。

## 🔄 替代方案

描述您考虑过的任何替代解决方案或功能。

## 📝 附加信息

添加任何其他关于功能请求的信息或截图。
```

## 🎨 设计指南

### 颜色规范

```css
/* 主色调 */
--primary-blue: #3B82F6;
--primary-blue-dark: #1D4ED8;

/* 辅助色 */
--secondary-orange: #F59E0B;
--accent-green: #10B981;

/* 中性色 */
--gray-50: #F9FAFB;
--gray-900: #111827;
```

### 字体规范

- 标题：使用 `font-bold` 或 `font-semibold`
- 正文：使用 `font-normal`
- 小字：使用 `text-sm` 或 `text-xs`

### 间距规范

- 使用 Tailwind 的间距系统
- 组件间距：`mb-8` 或 `mb-12`
- 元素间距：`mb-4` 或 `mb-6`
- 内边距：`p-4` 或 `p-6`

## 🧪 测试指南

### 浏览器兼容性

测试以下浏览器：

- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)
- 移动端 Safari
- 移动端 Chrome

### 设备测试

- 桌面端 (1920x1080)
- 平板端 (768x1024)
- 手机端 (375x667)

### 功能测试

- 图片懒加载
- 视频播放
- 响应式布局
- 搜索功能
- 分享功能

## 📚 资源链接

- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [MDN Web 文档](https://developer.mozilla.org/)
- [Web 可访问性指南](https://www.w3.org/WAI/WCAG21/quickref/)
- [JavaScript 最佳实践](https://github.com/ryanmcdermott/clean-code-javascript)

## 🤝 社区

- 在 [Issues](https://github.com/您的用户名/xiapu-travel-website/issues) 中讨论问题
- 在 [Discussions](https://github.com/您的用户名/xiapu-travel-website/discussions) 中分享想法
- 关注项目更新

## 📞 联系方式

如果您有任何问题，可以通过以下方式联系我们：

- 创建 Issue
- 发送邮件到 your-email@example.com
- 在 Discussions 中提问

---

再次感谢您的贡献！🎉