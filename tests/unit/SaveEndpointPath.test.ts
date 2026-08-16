import { describe, it, expect } from 'vitest'
import { resolveSafeSvgPath } from '../../src/node/index'
import path from 'path'

describe('resolveSafeSvgPath', () => {
  const publicDir = path.resolve('/project', 'docs/public')

  it('应允许 publicDir 内的合法 .svg 路径', () => {
    const result = resolveSafeSvgPath(publicDir, '/diagrams/arch.svg')
    expect(result).toBe(path.resolve(publicDir, 'diagrams/arch.svg'))
  })

  it('应去掉开头多余的 /', () => {
    const result = resolveSafeSvgPath(publicDir, '///a/b.svg')
    expect(result).toBe(path.resolve(publicDir, 'a/b.svg'))
  })

  it('应拒绝路径遍历（../ 逃逸）', () => {
    expect(resolveSafeSvgPath(publicDir, '../../etc/passwd.svg')).toBeNull()
    expect(resolveSafeSvgPath(publicDir, '../secret.svg')).toBeNull()
  })

  it('应拒绝非 .svg 后缀', () => {
    expect(resolveSafeSvgPath(publicDir, '/diagrams/arch.txt')).toBeNull()
    expect(resolveSafeSvgPath(publicDir, '/diagrams/arch')).toBeNull()
  })

  it('应拒绝以 // 前缀 + ../ 的路径逃逸', () => {
    expect(resolveSafeSvgPath(publicDir, '//../etc/passwd.svg')).toBeNull()
    expect(resolveSafeSvgPath(publicDir, '////../../evil.svg')).toBeNull()
  })
})
