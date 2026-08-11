# Contributing to vitepress-plugin-svg-editor

感谢你对这个项目的兴趣！以下指南将帮助你快速上手贡献。

## 开发环境搭建

```bash
# 1. 克隆并安装依赖
git clone <repo-url>
cd vitepress-plugin-svg-editor
pnpm install

# 2. 启动插件开发模式（watch 构建）
pnpm dev

# 3. 在测试 VitePress 项目中验证
cd ../java-world
pnpm docs:dev
# 访问 http://localhost:5174 查看效果
```

## 项目结构

```
src/
├── core/           # 内核层：EventBus, CanvasManager, HistoryManager, PluginSystem
├── plugins/        # 编辑器插件：align, layer, text-format, distribute, gradient, shadow
├── adapters/       # 适配器：StorageAdapter, ThemeAdapter, RenderAdapter 接口+实现
├── components/     # Vue 组件：SvgDiagram, SvgEditor, EditorToolbar, EditorCanvas
│   └── sub/        # 子组件
├── node/           # VitePress 插件入口：Vite 插件 + Markdown-it 插件
├── styles/         # 样式文件
tests/
├── unit/           # 单元测试（Vitest）
├── e2e/            # E2E 测试（Playwright）
│   └── fixtures/   # 测试用 SVG 文件
docs/               # 用户文档（Diátaxis 四层）
design/             # 设计文档和决策记录
```

## 代码风格

- TypeScript 严格模式，所有公开 API 有类型标注
- 注释使用中文（但保持代码标识符为英文）
- 缩进使用 2 空格
- 使用 `// @ts-nocheck` 仅在 postprocessor.ts 等特殊场景

## 提交规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/)：

```
feat(core): 添加 EventBus.once() 方法
fix(editor): 修复暗色主题下文字颜色不切换
docs(api): 补充 StorageAdapter 接口文档
test(unit): 添加 HistoryManager undo/redo 测试
```

## 提交流程

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feat/my-feature`
3. 确保测试通过：`pnpm test:unit && pnpm typecheck`
4. 提交代码：`git commit -m "feat: 描述"`
5. 推送分支：`git push origin feat/my-feature`
6. 提交 Pull Request

## 运行测试

```bash
# 单元测试
pnpm test:unit

# 带覆盖率
pnpm test:unit -- --coverage

# E2E 测试（需要先启动 VitePress dev server）
pnpm test

# TypeScript 类型检查
pnpm typecheck
```

## 发布流程

```bash
# 1. 确保所有测试通过
pnpm typecheck && pnpm test:unit && pnpm test

# 2. 更新 CHANGELOG.md

# 3. 构建
pnpm build

# 4. 发布
pnpm publish --access public
```
