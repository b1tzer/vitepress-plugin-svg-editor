/**
 * 存储适配器单元测试
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { LocalStorageAdapter } from '../storage/LocalStorageAdapter'

describe('LocalStorageAdapter', () => {
  let adapter: LocalStorageAdapter

  beforeEach(() => {
    localStorage.clear()
    adapter = new LocalStorageAdapter()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('保存 SVG 返回成功结果', async () => {
    const result = await adapter.save('<svg></svg>', '/test/diagram.svg')
    expect(result.success).toBe(true)
    expect(result.path).toBe('/test/diagram.svg')
  })

  it('保存后可通过 load 读取', async () => {
    await adapter.save('<svg xmlns="http://www.w3.org/2000/svg"></svg>', '/diagrams/arch.svg')
    const loaded = await adapter.load('/diagrams/arch.svg')
    expect(loaded).toContain('<svg')
    expect(loaded).toContain('xmlns')
  })

  it('load 不存在的键抛出异常', async () => {
    await expect(adapter.load('/nonexistent.svg')).rejects.toThrow('未找到 SVG')
  })

  it('多个文件互相隔离', async () => {
    await adapter.save('file1', '/a.svg')
    await adapter.save('file2', '/b.svg')
    const a = await adapter.load('/a.svg')
    const b = await adapter.load('/b.svg')
    expect(a).toBe('file1')
    expect(b).toBe('file2')
  })
})
