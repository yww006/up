# 贡献指南

感谢你考虑为 UP 贡献工具！🎉

## 📋 贡献类型

- ✨ **添加新工具** - 推荐好用的在线静态工具
- 🐛 **修复问题** - 报告或修复页面 bug
- 📝 **改进文档** - 完善 README、注释等
- 🎨 **优化体验** - UI/UX 改进、性能优化
- 🌐 **翻译本地化** - 多语言支持

## 🔧 添加新工具流程

### 1. 确认工具符合标准

- [ ] 纯静态/前端工具（无需后端、数据库、登录）
- [ ] 免费使用（或有慷慨免费额度）
- [ ] 无广告、无追踪、尊重隐私
- [ ] 维护活跃，近半年有更新
- [ ] 界面友好，移动端可用
- [ ] 非商业推广、非钓鱼网站

### 2. 选择合适分类

现有分类：
- `设计` - 配色、字体、渐变、阴影、图标、白板
- `开发` - 格式化、测试、编码、调试、Mock、文档
- `网络` - HTTP、DNS、SSL、IP、重定向、测速
- `安全` - 哈希、加密、密码、证书、漏洞扫描
- `数据` - 转换、查询、建模、可视化、Schema
- `写作` - Markdown、图表、文档、简历、Changelog
- `运维` - Docker、K8s、Cron、CI/CD、监控
- `性能` - Web Vitals、打包分析、Lighthouse
- `工具` - 二维码、编码、时间、单位、生成器
- `SEO` - Meta、Sitemap、robots、结构化数据
- `法律` - 隐私政策、条款、Cookie、合规
- `趣味` - ASCII、Emoji、白板、游戏

如需新分类，请先在 Issue 中讨论。

### 3. 编辑 tools.json

在 `tools.json` 的 `tools` 数组中添加新对象，**按字母序插入**：

```json
{
  "id": "tool-unique-id",
  "name": "工具显示名称",
  "description": "一句简短描述核心功能，50-100字，避免营销话术",
  "category": "分类名（必须与现有分类完全一致）",
  "tags": ["标签1", "标签2", "标签3", "标签4"],
  "url": "https://tool-website.com",
  "icon": "🔧",
  "featured": false
}
```

**字段规范：**

| 字段 | 必填 | 规则 |
|------|------|------|
| `id` | ✅ | kebab-case，唯一，如 `json-formatter` |
| `name` | ✅ | 官方名称，中文优先 |
| `description` | ✅ | 客观描述功能，不含"最好"、"最快"等主观词 |
| `category` | ✅ | 必须是现有分类之一 |
| `tags` | ✅ | 3-6 个，小写英文或中文，用于搜索 |
| `url` | ✅ | 直接可用的工具页面，HTTPS 优先 |
| `icon` | ✅ | 单个 Emoji，视觉识别度高 |
| `featured` | ❌ | 仅极少数核心工具设为 `true` |

### 4. 本地验证

```bash
# 安装依赖
npm install

# 生成所有页面
npm run generate:all

# 本地预览
npm run dev
# 打开 http://localhost:3000 检查：
# - 首页今日工具显示正常
# - 搜索/筛选/分类正常
# - 归档页新工具出现
# - RSS 包含新工具
# - 无控制台报错
```

### 5. 提交 PR

- 标题：`feat: add [工具名] - [分类]`
- 描述：简述工具用途、推荐理由、测试情况
- 关联 Issue（如有）

## 🐛 报告 Bug

使用 [Bug Report 模板](.github/ISSUE_TEMPLATE/bug_report.md)，包含：

- 复现步骤
- 预期行为 vs 实际行为
- 浏览器/设备/系统版本
- 截图/录屏（如适用）
- 控制台错误信息

## 💡 功能建议

使用 [Feature Request 模板](.github/ISSUE_TEMPLATE/feature_request.md)，说明：

- 解决什么问题
- 目标用户
- 替代方案对比
- 实现复杂度预估

## 🎨 代码规范

- **HTML**: 语义化标签、无障碍属性、移动端优先
- **CSS**: 使用 CSS 变量、BEM 命名、避免 `!important`
- **JS**: ES6+ 模块化、JSDoc 注释、无全局污染
- **提交信息**: [Conventional Commits](https://www.conventionalcommits.org/)
  - `feat:` 新功能
  - `fix:` 修复
  - `docs:` 文档
  - `style:` 格式
  - `refactor:` 重构
  - `perf:` 性能
  - `test:` 测试
  - `chore:` 构建/工具

## 📞 联系方式

- GitHub Issues: [yww006/up/issues](https://github.com/yww006/up/issues)
- Discussions: [yww006/up/discussions](https://github.com/yww006/up/discussions)

---

再次感谢你的贡献！🙏