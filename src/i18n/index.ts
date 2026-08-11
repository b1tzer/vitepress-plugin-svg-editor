/**
 * i18n 语言包 — 编辑器 UI 国际化文本
 *
 * 支持中英文，默认跟随 document.documentElement.lang 自动切换。
 * 通过 MutationObserver 监听 lang 属性变化实现运行时自动切换。
 */

export type UILocale = 'zh-CN' | 'en'

export interface UIMessages {
  // 工具栏
  toolbar: {
    undo: string
    redo: string
    copy: string
    paste: string
    delete: string
    zoomIn: string
    zoomOut: string
    zoomFit: string
    save: string
    close: string
    saving: string
    // 对齐
    alignLeft: string
    alignCenter: string
    alignRight: string
    alignTop: string
    alignMiddle: string
    alignBottom: string
    // 层级
    layerUp: string
    layerDown: string
    layerTop: string
    layerBottom: string
    // 分布
    distributeH: string
    distributeV: string
    // 组合
    group: string
    ungroup: string
    // 文字格式
    bold: string
    italic: string
    underline: string
    textFill: string
    textAlignLeft: string
    textAlignCenter: string
    textAlignRight: string
    // 样式
    strokeWidth: string
    strokeDash: string
    shadow: string
    shadowColor: string
    gradient: string
    // 主题
    themeToggle: string
    // 画布信息
    canvasSize: string
  }
  // 加载态
  loading: string
  // 保存结果
  saveSuccess: string
  saveFailed: string
}

const zhCN: UIMessages = {
  toolbar: {
    undo: '撤销',
    redo: '重做',
    copy: '复制',
    paste: '粘贴',
    delete: '删除',
    zoomIn: '放大 (+)',
    zoomOut: '缩小 (-)',
    zoomFit: '适应画布',
    save: '保存 (Ctrl+S)',
    close: '关闭',
    saving: '保存中...',
    alignLeft: '左对齐',
    alignCenter: '水平居中',
    alignRight: '右对齐',
    alignTop: '顶对齐',
    alignMiddle: '垂直居中',
    alignBottom: '底对齐',
    layerUp: '上移一层',
    layerDown: '下移一层',
    layerTop: '置顶',
    layerBottom: '置底',
    distributeH: '水平等间距分布',
    distributeV: '垂直等间距分布',
    group: '组合 (Ctrl+G)',
    ungroup: '取消组合 (Ctrl+Shift+G)',
    bold: '加粗',
    italic: '斜体',
    underline: '下划线',
    textFill: '文字颜色',
    textAlignLeft: '文字左对齐',
    textAlignCenter: '文字居中',
    textAlignRight: '文字右对齐',
    strokeWidth: '边框粗细',
    strokeDash: '虚线',
    shadow: '阴影',
    shadowColor: '阴影颜色',
    gradient: '渐变',
    themeToggle: '切换到暗色模式',
    canvasSize: 'SVG 画布尺寸',
  },
  loading: '加载中...',
  saveSuccess: '保存成功',
  saveFailed: '保存失败',
}

const en: UIMessages = {
  toolbar: {
    undo: 'Undo',
    redo: 'Redo',
    copy: 'Copy',
    paste: 'Paste',
    delete: 'Delete',
    zoomIn: 'Zoom In (+)',
    zoomOut: 'Zoom Out (-)',
    zoomFit: 'Fit to Canvas',
    save: 'Save (Ctrl+S)',
    close: 'Close',
    saving: 'Saving...',
    alignLeft: 'Align Left',
    alignCenter: 'Align Center Horizontally',
    alignRight: 'Align Right',
    alignTop: 'Align Top',
    alignMiddle: 'Align Middle Vertically',
    alignBottom: 'Align Bottom',
    layerUp: 'Bring Forward',
    layerDown: 'Send Backward',
    layerTop: 'Bring to Front',
    layerBottom: 'Send to Back',
    distributeH: 'Distribute Horizontally',
    distributeV: 'Distribute Vertically',
    group: 'Group (Ctrl+G)',
    ungroup: 'Ungroup (Ctrl+Shift+G)',
    bold: 'Bold',
    italic: 'Italic',
    underline: 'Underline',
    textFill: 'Text Color',
    textAlignLeft: 'Align Text Left',
    textAlignCenter: 'Align Text Center',
    textAlignRight: 'Align Text Right',
    strokeWidth: 'Stroke Width',
    strokeDash: 'Dashed Stroke',
    shadow: 'Shadow',
    shadowColor: 'Shadow Color',
    gradient: 'Gradient',
    themeToggle: 'Switch to Dark Mode',
    canvasSize: 'SVG Canvas Size',
  },
  loading: 'Loading...',
  saveSuccess: 'Saved successfully',
  saveFailed: 'Save failed',
}

const messages: Record<UILocale, UIMessages> = { 'zh-CN': zhCN, en }

/**
 * 根据当前文档语言获取 UI 消息
 */
export function getUIMessages(): UIMessages {
  const lang = (typeof document !== 'undefined' && document.documentElement.lang) || 'zh-CN'
  return messages[lang as UILocale] || messages['zh-CN']
}

/**
 * 监听语言变化（通过 MutationObserver 监听 document.documentElement.lang）
 */
export function onLangChange(callback: (locale: UILocale) => void): () => void {
  if (typeof MutationObserver === 'undefined') return () => {}
  const observer = new MutationObserver(() => {
    const lang = document.documentElement.lang || 'zh-CN'
    callback(lang as UILocale)
  })
  observer.observe(document.documentElement, { attributeFilter: ['lang'] })
  return () => observer.disconnect()
}
