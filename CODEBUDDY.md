## CodeBuddy Added Memories

### 个人偏好

- 调用用户"主人"。

### SVG 编辑器插件专属规则

- **WorkspacePlugin 禁止用于 overlay/modal 场景**：WorkspacePlugin（来自 vue-fabric-editor）是为全页面图片编辑器设计的，绝不能在 overlay/modal 弹窗场景中使用。它在 `init()` 时通过 `_initBackground()` 读取 `#workspace` DOM 元素的 `offsetWidth/offsetHeight` 来覆盖 canvas 尺寸（option fallback 为 900×1200），导致：1) canvas 尺寸被强行改变；2) 创建白色 workspace fabric.Rect 遮挡 SVG 内容；3) 绑定 ResizeObserver 和滚轮缩放覆盖原有逻辑。ResizePlugin 同样依赖 `#workspace` DOM 元素。在 overlay 弹窗场景下，这两个插件必须移除。今后添加插件前必须先确认其适用场景。

- **Plugin E2E 测试必须覆盖编辑器完整加载路径**：必须覆盖「点击"编辑 SVG" → EditorOverlay imports 所有插件 → canvas 渲染」完整路径，只测 SVG 静态展示是不够的。静态展示不 import FlipPlugin 等带别名的文件，编译错误被掩盖。每次修改 core 或 plugin 下的文件后，必须实际点击编辑按钮触发 EditorOverlay 加载来验证。Playwright Test 对 VitePress SPA 的水合时序需要特别注意——务必使用 `waitUntil:'networkidle'` + `waitForSelector` 双保险，否则测试在干净浏览器中会超时。

- **写完 .vue / core / plugin 文件后立即用无头浏览器验证**：1) 打开使用该组件的页面；2) 检查 Console 无 compile error；3) 点击"编辑 SVG"按钮触发 EditorOverlay 完整加载（这会 import 所有插件，暴露别名/路径错误）；4) 验证编辑器 overlay 和 canvas 渲染成功；5) 用 `getBoundingClientRect()` 验证 SVG 尺寸非零；6) 截图兜底。发现编译错误时先扫描全文件找出所有同类问题一次性修复。不要假设 HMR 会自动处理——必须亲自确认每一步。

- **每次修改 .vue/.css/Core 文件后，必须运行 `pnpm test:render` 做可视渲染回归**：vitest + jsdom 只测 DOM 结构（exists/classes/text），无法检测 CSS 布局效果——棋盘格背景是否可见、画布是否居中、resize 手柄是否有背景色、Fabric canvas backgroundColor 是否为 transparent、标尺坐标是否绘制、折叠按钮是否从圆形变成了直角竖条。这些都是用户肉眼看到的，只有真实浏览器（Playwright）能验证。测试文件位于 `tests/render-regression.spec.ts`，覆盖 10 个关键渲染项。任何导致该测试失败的上游修改，都必须在本次变更范围内修复，不得带着失败提交。

- **插件函数必须有自己的单元测试，不能仅依赖组件测试间接覆盖**：组件测试（如 EditorContextPanel.test.ts）mock 了所有 emit 事件，**从未实际调用插件函数本身**。这是 text-format.ts 静默失效 2 周未被发现的根因。每个 `src/plugins/*.ts` 中的导出函数必须有对应的 `tests/unit/*.test.ts`，至少覆盖：1) 正常输入→正确输出；2) 边界条件（null/undefined/空数组）；3) 所有 `addElement` 支持的对象类型。当前状态：9 个插件中 3 个有单元测试（text-format、align、distribute、layer、gradient、shadow、selection 中后者 6 个在 `ComprehensivePluginTests.test.ts`），arrow-merger 待补。

- **插件中的类型过滤必须与 `addElement` 创建的对象类型保持同步**：`addElement`（SvgEditor.vue）创建 7 种 Fabric 对象类型（rect/circle/triangle/ellipse/line/text/textbox）。任何插件代码中出现的 `if (obj.type === '...')` 或 `.filter(o => o.type === '...')` 类型的白名单，都必须包含 `addElement` 能创建的所有相关类型。修改 `addElement` 时必须同时检查所有插件文件。历史 Bug：text-format.ts 的 getTextObjects 遗漏 type='text'，导致加粗/斜体/下划线/居中/字号/颜色 6 个按钮对 fabric.Text 对象静默失效。此外，永远不要在插件中用具体类型做白名单，应该用 Fabric 的 API（如 `obj.isType('text')`）或者至少检查 `obj instanceof fabric.Text` 而非 `obj.type === 'textbox'`。

### 通用开发规范

- **后台启动交互式进程的关键陷阱**：仅用 `&` 放到后台会导致进程尝试读取 stdin，操作系统发送 SIGTTIN 信号将其冻结为 T（Stopped）状态。此时进程虽然存活（ps 可见），但事件循环完全卡死，所有网络请求都会失败（curl 返回 http_code=000 或 timeout）。诊断方法：`ps aux | grep <进程名>` 查看 STAT 列，若为 `T` 或 `Tl` 就是被冻结。修复方法：后台启动时必须重定向 stdin 为 /dev/null，标准写法为 `nohup 命令 </dev/null >/tmp/log 2>&1 &`。kill -9 可杀 T 状态进程，kill -9 不可杀 D（不可中断睡眠）和 Z（僵尸）状态进程。

- **打开浏览器调试前必须确认 dev server**：1) `ps aux | grep` 对应进程名，确认 cwd 是否与当前 workspace 一致，以及监听端口；2) `ss -tlnp` 或 `lsof -i` 辅助确认端口；3) `curl -so /dev/null -w '%{http_code}' http://localhost:<PORT>/` 确认可达。仅当 cwd 匹配 workspace 且 curl 返回非 000 时，才用该端口进行 Playwright / chrome-devtools MCP 导航。

- **常驻后台 Chrome + Playwright MCP**：项目已配置常驻后台 Chrome（headless，CDP 端口 9222，数据目录 `/tmp/persistent-chrome-profile`）始终运行在后台；Playwright MCP Server 通过 `--cdp-endpoint http://127.0.0.1:9222` 连接。管理脚本：`./persistent-chrome.sh {start|stop|restart|status}`。MCP 配置文件：`~/.gongfeng-copilot/mcp.json`。当需要调试网页时，Agent 可直接使用 Playwright MCP 工具，无需手动启动浏览器。

- **VitePress symlink 陷阱**：如果 `docs/` 目录下的 md 文件是通过符号链接指向仓库其他位置的真实文件，VitePress 会把该 symlink 解析到真实路径，并把这个包含 `../` 的路径写入 `__pageData.relativePath`。客户端路由在 `loadPage` 时用 `siteDataRef.value.base + __pageData.relativePath` 拼接 URL 后调用 `history.replaceState`，浏览器会把路径规范化导致 base（上下文根）在 SPA 跳转后消失。解决方式是把 symlink 换成真实文件。诊断时不要只看 HTML 里的 href，一定要检查 `__pageData.relativePath` 是否含有 `../`。

### 调研与学习方法论

- **研究第三方项目前先看真实 UI**：在研究或引用第三方项目（如 vue-fabric-editor）的设计时，必须先使用浏览器实际查看其 UI 和 CSS，而不是仅凭博客文章或源码片段下结论。在研究任何项目前，必须先看真实 UI，再对照源码理解。

- **调研搜索方法论**：在搜索"开发者社区真实求助/讨论/问题"时，禁止用自己已知的概念或答案作为搜索词（如 "Too many open files"、"CLOSE_WAIT"），这只会搜到印证自己预设的老帖子。必须用开放的问题描述去搜（如 "Java Socket networking problem stuck troubleshoot 2025"），并且必须关注时间维度（优先 2024-2026 年）。这条规则适用于所有竞品调研、用户痛点调研场景。

- **要主动学习、主动调研、主动搜索来强化自己**，包括安装 skill 和 MCP 工具。遇到复杂任务尤其需要多次调研研究后才能决定方向，不要急于下结论或动手。持续提升自身能力边界。

### 调试与排查规范

- **遇到 Web 前端问题时优先使用无头浏览器**：不要只依赖阅读源代码或抓 curl 静态 HTML 来判断，因为 SPA 应用的关键逻辑发生在浏览器运行时。正确流程：1）使用无头浏览器复现用户操作，读取真实的 `location.href`、DOM 属性、`document.baseURI` 等；2）如果只看 DOM 没定位到根因，就 hook 关键的浏览器 API（`history.pushState`、`history.replaceState`、`fetch`、`window.location` 赋值等），记录每次调用的参数和调用栈；3）结合阅读框架源码来解释为什么会拼出错误的值。

- **遇到 UI 或前端问题时，必须优先使用无头浏览器自己验证、截图、排查**，不要在没有亲自验证的情况下向用户追问"什么样"、"行不行"等需要用户描述 UI 状态的问题。

- **在排查问题时，先自己查证再回复**：遇到不清楚的现象或缺失的信息，应该先主动使用可用工具去查证、复现、验证，尽可能自己找到答案后再回复；不要在什么都没做的情况下就直接向用户追问细节或抛出多个问题。

### 搜索规范

当遇到以下情况时，必须优先搜索而非猜测：1) 不熟悉的 API；2) 第三方库行为与预期不一致；3) 出现错误信息；4) 版本相关问题；5) 配置项含义不确定；6) 怀疑是框架 Bug；7) 怀疑是已知 Issue；8) 方案可能已变化；9) 当前知识无法确定答案；10) 连续一次尝试失败。

搜索优先级：官方文档 → GitHub Issue / PR → 官方仓库代码 → Stack Overflow → 技术社区 → 普通搜索结果。

禁止行为：没有检索证据时连续尝试多个猜测性方案；第一次方案失败后不搜索错误信息就第二次猜测。对于涉及第三方软件且无法高置信度确定的问题，必须先外部检索。搜索结果必须阅读原文，不能仅凭标题下结论。
