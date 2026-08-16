# CLS（累积布局偏移）预防编码规范

> **目标：确保代码变更永远不会引入画布跳动、组件高度突变等布局偏移问题。**

---

## 一、为什么 CLS 比功能 Bug 更严重

| 维度         | 功能 Bug          | CLS 问题                     |
| ------------ | ----------------- | ---------------------------- |
| **用户感知** | 点击无效 / 报错   | 页面跳动、误点击、视觉眩晕   |
| **发现时机** | 单测 / E2E 可覆盖 | 肉眼才察觉，容易上线后才发现 |
| **谷歌评分** | 不影响            | CLS 占 Lighthouse 25% 权重   |
| **修复成本** | 定位到函数        | 需重构 DOM 结构              |

> Google Core Web Vitals 标准：CLS ≤ 0.05 为优秀，≤ 0.1 为需改善，> 0.1 为差。

---

## 二、铁律：禁止模式

### ❌ 禁止 1：用 `v-if` 控制**影响外部布局**的区块

```vue
<!-- ❌ 错误：toolbar-context 消失后下方画布上跳 -->
<template>
  <div class="toolbar">
    <div class="top">...</div>
    <div v-if="hasSelection" class="context">
      <!-- v-if 导致高度塌陷 -->
      ...
    </div>
    <div class="canvas">...</div>
    <!-- 画布上移 -->
  </div>
</template>
```

### ❌ 禁止 2：为媒体元素省略尺寸属性

```html
<!-- ❌ 错误：图片加载后撑开布局 -->
<img src="banner.png" alt="banner" />

<!-- ❌ 错误：iframe/embed/视频 无预留空间 -->
<iframe src="https://..." />
```

### ❌ 禁止 3：动态注入内容前不预留空间

```js
// ❌ 错误：直接 innerHTML，无高度占位
container.innerHTML = '<div>新内容...</div>'
```

### ❌ 禁止 4：用 CSS 属性触发动画（而非 transform/opacity）

```css
/* ❌ 错误：动画修改 height 必触发布局重排 */
.element {
  transition: height 0.3s;
}
.element.open {
  height: 200px;
}

/* ❌ 错误：动画修改 margin/padding */
.element {
  transition: margin-top 0.3s;
}
```

---

## 三、铁律：必须模式

### ✅ 必须 1：用固定容器 + 内部 `v-if` / `v-show` 代替根级 `v-if`

```vue
<!-- ✅ 正确：容器始终占位，仅内部内容切换 -->
<template>
  <aside class="context-panel" style="width: 220px; flex-shrink: 0">
    <div v-if="!hasSelection" class="empty">属性面板</div>
    <div v-else class="content">
      <!-- 属性控件 -->
    </div>
  </aside>
</template>
```

### ✅ 必须 2：为所有媒体元素显式声明尺寸

```html
<!-- ✅ 正确 -->
<img src="banner.png" width="800" height="400" alt="banner" />
<div style="aspect-ratio: 16/9">
  <iframe src="..." width="100%" height="100%" />
</div>
```

### ✅ 必须 3：动态内容用骨架屏/skeleton 占位

```vue
<!-- ✅ 正确：骨架屏与真实内容等高 -->
<template>
  <div v-if="loading" class="skeleton" style="min-height: 200px" />
  <div v-else class="real-content">
    <!-- 真实内容 -->
  </div>
</template>
```

### ✅ 必须 4：动画仅用 `transform` 和 `opacity`

```css
/* ✅ 正确：GPU 合成，不触发 Layout */
.element {
  transition:
    transform 0.3s,
    opacity 0.3s;
}
.element.open {
  transform: translateY(-10px);
  opacity: 1;
}
```

---

## 四、本项目检测工具链

### 开发阶段（实时）

| 工具                | 位置                             | 触发方式                    |
| ------------------- | -------------------------------- | --------------------------- |
| **cls-monitor.ts**  | `src/utils/cls-monitor.ts`       | dev 模式下自动 console.warn |
| **Chrome DevTools** | Rendering → Layout Shift Regions | 手动勾选                    |

在 `App.vue` 的 `onMounted` 中加入：

```ts
import { initClsMonitor } from './utils/cls-monitor'
onMounted(() => {
  if (import.meta.env.DEV) {
    initClsMonitor()
  }
})
```

### PR 阶段（自动）

| 工具                       | 配置文件                                       | 门禁                     |
| -------------------------- | ---------------------------------------------- | ------------------------ |
| **单元测试（布局稳定性）** | `tests/components/EditorToolbar.test.ts`       | vitest 自动运行          |
| **Playwright 视觉回归**    | `tests/visual/editor-layout-stability.spec.ts` | `pnpm test:visual`       |
| **Lighthouse CI**          | `.lighthouserc.json`                           | CLS > 0.05 → ❌ 阻止合并 |

### CLS 监控工具 API

```ts
import { initClsMonitor, getClsScore, getClsRating } from './utils/cls-monitor'

// 启动监控
const stop = initClsMonitor(
  (entry) => {
    // entry.value: 本次偏移分数
    // entry.cumulative: 累计 CLS
    // entry.sources: 触发偏移的 DOM 节点列表
  },
  0.005 // 阈值，低于此值的偏移忽略
)

// 查询累计分数
console.log(getClsScore()) // 0.023
console.log(getClsRating()) // 'good'
```

---

## 五、Code Review 检查清单

提交 PR 时，审查者必须逐项确认：

- [ ] 新增的 `v-if` 是否放在固定尺寸容器内部？不会被移除？
- [ ] 新增的 `<img>` / `<video>` / `<iframe>` 是否声明了 `width` 和 `height`？
- [ ] 是否有 JS 在用户无交互的情况下动态 `insertBefore` / `prepend` DOM 元素？
- [ ] 动画是否只用 `transform` / `opacity`？
- [ ] 是否有 `font-display` 相关的改动可能影响字体加载布局？
- [ ] `vitest` 单元测试中是否包含「布局稳定性」断言？
- [ ] Playwright 视觉回归测试是否通过？

---

## 六、常见错误模式速查

| 代码模式                                | 风险                 | 修复方式                            |
| --------------------------------------- | -------------------- | ----------------------------------- |
| `<div v-if="x">` 作为 flex 子元素       | 高 — 兄弟元素位移    | 改为固定容器 + 内部 v-if            |
| `<img src="...">` 无宽高                | 高 — 加载后撑开      | 加 width/height                     |
| `el.style.height = 'auto'`              | 高 — 强制 reflow     | 用 CSS transition + transform       |
| `element.innerHTML = ...`               | 中 — 内容高度不可控  | 先 min-height 占位，再替换          |
| `@font-face { font-display: swap }`     | 中 — 字体切换跳变    | 添加 size-adjust 对齐 fallback 字体 |
| `el.offsetHeight` 后立即 `el.style.xxx` | 中 — 强制同步 layout | 先读后写分离                        |

---

## 七、参考资源

- [Google - Optimize Cumulative Layout Shift](https://web.dev/optimize-cls/)
- [web.dev - Avoid large layout shifts](https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing)
- [Figma Engineering - Progressive Disclosure in Toolbars](https://www.figma.com/blog/)
- [@mizdra/eslint-plugin-layout-shift](https://github.com/docccdev/eslint-plugin-layout-shift)
