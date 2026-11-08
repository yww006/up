# UP - 每日一个静态工具

[![Deploy to GitHub Pages](https://github.com/yww006/up/actions/workflows/daily-update.yml/badge.svg)](https://github.com/yww006/up/actions/workflows/daily-update.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Tools Count](https://img.shields.io/badge/Tools-100+-blue.svg)](tools.json)
[![RSS Feed](https://img.shields.io/badge/RSS-Subscribe-orange.svg)](feed.xml)

> 每天推荐一个实用的在线静态工具，涵盖开发、设计、网络、数据、性能、法律等分类，配合精美背景图，提升工作效率。

## ✨ 特性

- 🎯 **每日一工** - 自动轮换推荐，无需人工干预
- 🎨 **精美背景** - 每个分类配配专属高质量背景图
- 🌙 **深色模式** - 支持系统跟随与手动切换
- 🔍 **全文搜索** - 实时搜索工具名称、描述、标签
- 📱 **响应式设计** - 完美适配桌面端与移动端
- 📡 **RSS 订阅** - 支持 RSS/Atom 订阅每日推荐
- 📚 **历史归档** - 浏览过往所有每日推荐工具
- ⚡ **零依赖运行** - 纯静态 HTML/CSS/JS，部署简单
- 🤖 **全自动化** - GitHub Actions 定时更新，零维护成本

## 🚀 在线体验

- **主站**: https://yww006.github.io/up
- **历史归档**: https://yww006.github.io/up/archive.html
- **RSS 订阅**: https://yww006.github.io/up/feed.xml

## 📦 工具分类

| 分类 | 图标 | 示例工具 |
|------|------|----------|
| 设计 | 🎨 | 配色生成器、CSS 渐变、字体搭配、Glassmorphism |
| 开发 | 💻 | JSON 格式化、正则测试、JWT 解码、API 测试器 |
| 网络 | 🌐 | HTTP 状态码、DNS 查询、SSL 检查、重定向链 |
| 安全 | 🔒 | 哈希生成、密码生成器、SSL 证书检查 |
| 数据 | 📊 | CSV↔JSON、Excel 公式、JSON Schema、数据库 ER 图 |
| 写作 | ✍️ | Markdown 编辑器、Mermaid 图表、README 生成器 |
| 运维 | ⚙️ | Cron 表达式、Docker 命令、K8s YAML 生成器 |
| 性能 | 🚀 | Web Vitals、打包分析、Lighthouse CI |
| 工具 | 🔧 | 二维码、Base64、时间戳、单位换算 |
| SEO | 📈 | Meta 标签、robots.txt、站点地图生成器 |
| 法律 | ⚖️ | 隐私政策、服务条款、Cookie 同意横幅生成器 |
| 趣味 | 🎮 | ASCII 艺术、Emoji 选择器、手绘白板 |

## 🛠 本地开发

```bash
# 克隆仓库
git clone https://github.com/yww006/up.git
cd up

# 安装依赖（仅用于生成脚本）
npm install

# 启动本地服务器
npm run dev
# 或直接用任意静态服务器
npx serve .
# python3 -m http.server 8000
```

## 📁 项目结构

```
up/
├── index.html              # 主页面
├── archive.html            # 历史归档页（自动生成）
├── feed.xml                # RSS 订阅源（自动生成）
├── sitemap.xml             # 站点地图（自动生成）
├── daily-tool.json         # 今日工具数据（自动生成）
├── tools.json              # 工具数据库（核心数据源）
├── robots.txt              # 爬虫规则
├── CNAME                   # 自定义域名（可选）
├── assets/
│   ├── css/
│   │   └── style.css       # 样式文件
│   └── js/
│       ├── main.js         # 入口文件
│       ├── tools.js        # 工具渲染逻辑
│       ├── theme.js        # 主题切换
│       └── search.js       # 搜索功能
├── scripts/
│   ├── generate-daily.js   # 生成每日工具
│   ├── generate-archive.js # 生成归档页
│   ├── generate-rss.js     # 生成 RSS
│   └── generate-sitemap.js # 生成站点地图
├── .github/
│   └── workflows/
│       └── daily-update.yml # GitHub Actions 工作流
└── package.json
```

## ⚙️ 自动化部署

项目使用 GitHub Actions 实现全自动化：

1. **每日更新** (00:00 UTC / 08:00 北京时间)
   - 计算当日应推荐工具
   - 生成 `daily-tool.json`
   - 重新生成 `archive.html`、`feed.xml`、`sitemap.xml`
   - 自动提交并推送到 `main` 分支

2. **GitHub Pages 部署**
   - 触发 Pages 部署工作流
   - 通常 1-2 分钟内完成

3. **手动触发**
   - 在 Actions 页面点击 "Run workflow"

## 📝 添加新工具

编辑 `tools.json`，按照现有格式添加新工具对象：

```json
{
  "id": "tool-unique-id",
  "name": "工具名称",
  "description": "工具描述，简明扼要说明功能",
  "category": "分类名",
  "tags": ["标签1", "标签2", "标签3"],
  "url": "https://example.com/tool",
  "icon": "🔧",
  "featured": false
}
```

字段说明：
- `id`: 唯一标识符，建议 kebab-case
- `name`: 显示名称
- `description`: 简短描述（建议 50-100 字）
- `category`: 必须是现有分类之一
- `tags`: 3-6 个相关标签，用于搜索和筛选
- `url`: 工具在线地址（支持外部链接）
- `icon`: Emoji 图标
- `featured`: 是否为推荐工具（显示在首页优先位置）

## 🎨 自定义主题

修改 `assets/css/style.css` 中的 CSS 变量：

```css
:root {
  --color-primary: #0ea5e9;      // 主品牌色
  --color-accent: #f59e0b;       // 强调色
  --color-bg: #fafafa;           // 背景色
  --color-text: #1a1a2e;         // 文字色
  /* ... 更多变量 */
}

[data-theme="dark"] {
  --color-bg: #0f172a;
  --color-text: #f1f5f9;
  /* ... 暗色模式变量 */
}
```

## 📊 数据来源

- 工具数据：`tools.json`（手动维护）
- 背景图片：Unsplash API（免费高质量图片）
- 部署平台：GitHub Pages

## 🤝 贡献指南

欢迎提交 Issue 或 PR！

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feat/new-tool`
3. 添加工具到 `tools.json`
4. 运行 `npm run generate:all` 验证生成无误
5. 提交 PR

详见 [CONTRIBUTING.md](CONTRIBUTING.md)

## 📄 许可证

MIT License © 2025 [yww006](https://github.com/yww006)

---

<div align="center">
  <sub>Built with ❤️ using GitHub Pages + Actions</sub>
  <br>
  <sub>如果觉得有用，请给个 ⭐ Star 支持一下！</sub>
</div>