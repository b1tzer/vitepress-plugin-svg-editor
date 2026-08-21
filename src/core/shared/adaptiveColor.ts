/**
 * SVG 编辑器 — 自适应颜色模块
 *
 * 在 OKLCH（OKLab 感知均匀色彩空间）中做亮度翻转，使未被 28 组
 * `--diagram-*` 语义色板命中的自定义颜色也能在明暗主题切换时
 * 自动获得协调的暗色/亮色，而不是原样保留。
 *
 * 设计要点：
 *   - 零依赖：手写 sRGB ↔ OKLab 转换矩阵（Björn Ottosson 2020）
 *   - 仅对「色域内颜色」自逆：高饱和边界色（如 #FF0000）翻转后会被推出 sRGB
 *     色域，裁剪丢失信息导致往返无法精确恢复。因此本函数只负责「计算一次」，
 *     往返等幂需由调用方（useTheme）配合双向记忆化缓存保证——不要在此依赖自逆。
 *   - 仅处理 hex（6 位 #RRGGBB 或 3 位 #RGB），rgba/transparent/none 原样返回
 *
 * 为什么用 OKLCH 而非 HSL：
 *   - HSL 同 L 值的黄/蓝肉眼亮度差 20%+，调 L 会掉饱和度、色相漂移
 *   - OKLCH 感知均匀，翻转亮度时保持色相与饱和度，过渡自然不发灰发紫
 *   - 2023 年起全浏览器原生支持，Tailwind v4 / shadcn/ui / Figma 均默认采用
 */

/** RGB 三通道（0-255 整数） */
export interface Rgb {
  r: number
  g: number
  b: number
}

/** OKLCH 颜色（L∈[0,1]，C≥0，H 弧度） */
export interface Oklch {
  l: number
  c: number
  h: number
}

/** 6 位 hex 匹配（#RRGGBB，大小写不敏感） */
const HEX_RE = /^#([0-9a-f]{6})$/i
/** 3 位 hex 匹配（#RGB，大小写不敏感），SVG 中常见的短写法 */
const HEX3_RE = /^#([0-9a-f]{3})$/i

/**
 * 判断字符串是否为合法 hex 颜色（6 位 #RRGGBB 或 3 位 #RGB，大小写不敏感）。
 *
 * 供 svgDarkMode / SvgObjectMounter 等「识别裸 hex」的模块复用，
 * 统一 hex 识别口径，避免各处散落不一致的 hex 正则（3 位短写法漏识别）。
 *
 * @param value 待判断的颜色字符串（可为 attribute 值 / style 值）
 */
export function isHexColor(value: string): boolean {
  const v = value.trim()
  return HEX_RE.test(v) || HEX3_RE.test(v)
}

/**
 * hex → RGB
 * @param hex 形如 "#RRGGBB" 或 "#RGB"（3 位短写法自动展开为 6 位）
 * @returns RGB 通道；非法输入返回 null
 */
export function hexToRgb(hex: string): Rgb | null {
  const trimmed = hex.trim()
  const m = HEX_RE.exec(trimmed)
  if (m) {
    const v = parseInt(m[1], 16)
    return { r: (v >> 16) & 0xff, g: (v >> 8) & 0xff, b: v & 0xff }
  }
  const m3 = HEX3_RE.exec(trimmed)
  if (!m3) return null
  // 3 位短写法展开：#RGB → #RRGGBB
  const [r, g, b] = m3[1].split('')
  const v = parseInt(`${r}${r}${g}${g}${b}${b}`, 16)
  return { r: (v >> 16) & 0xff, g: (v >> 8) & 0xff, b: v & 0xff }
}

/**
 * RGB → hex（#RRGGBB 大写）
 * 通道越界时先 clamp 到 [0,255]（hard clipping，保亮度层次、代价是极端饱和色轻微色相偏移）
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const c = (x: number): string =>
    Math.round(Math.min(255, Math.max(0, x)))
      .toString(16)
      .padStart(2, '0')
      .toUpperCase()
  return `#${c(r)}${c(g)}${c(b)}`
}

/** sRGB → 线性 sRGB（gamma 展开） */
function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

/** 线性 sRGB → sRGB（gamma 压缩） */
function linearToSrgb(c: number): number {
  return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055
}

/**
 * RGB → OKLCH
 *
 * 依据 Björn Ottosson《A perceptual color space for image processing》(2020)：
 *   linear RGB → LMS → (立方根) → OKLab(L,a,b) → 极坐标 → OKLCH(L,C,H)
 */
export function rgbToOklch(rgb: Rgb): Oklch {
  const r = srgbToLinear(rgb.r / 255)
  const g = srgbToLinear(rgb.g / 255)
  const b = srgbToLinear(rgb.b / 255)

  // linear RGB → LMS
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b

  // LMS → OKLab（立方根非线性）
  const l_ = Math.cbrt(l)
  const m_ = Math.cbrt(m)
  const s_ = Math.cbrt(s)

  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_
  const bb = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_

  const C = Math.sqrt(a * a + bb * bb)
  const H = Math.atan2(bb, a)
  return { l: L, c: C, h: H }
}

/**
 * OKLCH → RGB
 *
 * OKLab 逆变换 → LMS 立方 → linear RGB → sRGB（通道越界时 hard clamp）
 */
export function oklchToRgb({ l: L, c: C, h: H }: Oklch): Rgb {
  // OKLCH → OKLab
  const a = C * Math.cos(H)
  const b = C * Math.sin(H)

  // OKLab → LMS（立方根）
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.291485548 * b

  const l = l_ * l_ * l_
  const m = m_ * m_ * m_
  const s = s_ * s_ * s_

  // LMS → linear RGB
  const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
  const bb = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s

  return {
    r: linearToSrgb(r) * 255,
    g: linearToSrgb(g) * 255,
    b: linearToSrgb(bb) * 255,
  }
}

/**
 * 自适应亮度翻转：OKLCH 中 L' = 1 - L，保持色相 H 与饱和度 C 不变
 *
 * - 仅对色域内颜色自逆；高饱和边界色会因 sRGB 色域裁剪丢信息，往返等幂需由
 *   调用方（useTheme）配合双向记忆化缓存保证。
 * - 接受 6 位（#RRGGBB）与 3 位（#RGB）hex，其余输入（rgba / transparent / none）
 *   原样返回
 *
 * @param hex 形如 "#RRGGBB" 或 "#RGB"
 * @returns 翻转亮度后的 "#RRGGBB"；非法输入原样返回
 */
export function adaptColorLuminance(hex: string): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex

  const { l, c, h } = rgbToOklch(rgb)
  // 亮度翻转（对色域内颜色自逆），色相与饱和度保持不变
  const flipped = oklchToRgb({ l: 1 - l, c, h })
  const result = rgbToHex(flipped.r, flipped.g, flipped.b)
  // 保持输入大小写风格：Fabric 对 SVG 原始色可能保留小写 hex（如 #1e293b），
  // 若翻转后强行大写会破坏「往返切换颜色完全恢复」的大小写一致性。
  // 用 hex !== hex.toUpperCase() 判断是否含小写字母（纯数字 hex 不受影响）。
  return hex !== hex.toUpperCase() ? result.toLowerCase() : result
}
