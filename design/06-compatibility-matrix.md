# 06 — 兼容性矩阵

## 6.1 VitePress 版本

| VitePress 版本 | 支持状态 | 备注 |
|---------------|---------|------|
| 1.0.x | ✅ 支持（CI 测试） | 当前 LTS baseline |
| 1.3.x | ✅ 支持（CI 测试） | 主要目标版本 |
| 1.5.x | ✅ 支持（CI 测试） | |
| 1.6.x | ✅ 支持（CI 测试） | 最新稳定版 |
| 0.x | ❌ 不支持 | 太旧，API 差异大 |
| 2.x（未来） | ⚠️ 待评估 | 发布后跟进 |

## 6.2 Node.js 版本

| Node.js 版本 | 支持状态 | 备注 |
|-------------|---------|------|
| 18 LTS | ✅ 支持 | 最低支持版本 |
| 20 LTS | ✅ 支持 | 推荐版本 |
| 22 LTS | ✅ 支持 | 当前活跃 LTS |
| 25+ | ⚠️ 尽力支持 | 非 LTS，不做硬性保证 |

## 6.3 浏览器兼容

| 浏览器 | 最低版本 | 备注 |
|--------|---------|------|
| Chrome | 90+ | 开发首选，Canvas/Fabric.js 性能最佳 |
| Firefox | 90+ | Fabric.js 性能较差（约 Chrome 的 20%），但不影响基本功能 |
| Safari | 15+ | macOS/iOS 支持 |
| Edge | 90+ | 基于 Chromium，同 Chrome |
| 移动端 | Chrome Mobile / Safari Mobile | ⚠️ 部分支持，Fabric.js 移动端体验已知不佳 |

## 6.4 SSR 兼容性

### 策略：完全客户端渲染

VitePress 在构建时会 SSR 所有页面。编辑器和画布组件**绝对不能**在 SSR 阶段渲染。

```ts
// ❌ 错误：直接在组件中初始化 Fabric.js
import { fabric } from 'fabric'
const canvas = new fabric.Canvas('my-canvas')  // SSR 时 window 不存在

// ✅ 正确：defineClientComponent 延迟加载
import { defineClientComponent } from 'vitepress'
const SvgEditor = defineClientComponent(() => import('./SvgEditor.vue'))

// ✅ 正确：enhanceApp 守卫
async enhanceApp({ app }) {
  if (!import.meta.env.SSR) {
    const mod = await import('vitepress-plugin-svg-editor/client')
    mod.enhanceApp({ app })
  }
}
```

### 检查清单

```
[ ] 所有 import 'fabric' 的代码都在 defineClientComponent 内或 !import.meta.env.SSR 守卫后
[ ] 所有访问 DOM API（document.querySelector, window.addEventListener）的代码仅在 onMounted 中执行
[ ] 本地存储访问（localStorage）有 try-catch 包裹
[ ] 无全局 window.__xxx 变量（纯 ESM import 替代）
```

## 6.5 pnpm / yarn / npm 兼容

| 包管理器 | 支持状态 | 备注 |
|---------|---------|------|
| pnpm | ✅ 完全支持 | 默认在 `optimizeDeps.include` 中声明所有内部依赖 |
| yarn | ✅ 支持 | |
| npm | ✅ 支持 | |

## 6.6 Fabric.js 版本

| Fabric 版本 | 支持状态 | 备注 |
|------------|---------|------|
| 6.x | ✅ 主支持 | peerDependency 默认版本范围 |
| 5.x | ⚠️ 最低支持 | peerDependency `>=5.0.0`，但推荐升级到 6.x |
| 4.x | ❌ 不支持 | API 差异大 |

## 6.7 Vue 版本

| Vue 版本 | 支持状态 |
|---------|---------|
| 3.2+ | ✅ 支持（peerDependency `>=3.2.0 <4.0.0`） |
| 2.x | ❌ 不支持 |
