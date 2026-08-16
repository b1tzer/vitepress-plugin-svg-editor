/**
 * Pipeline 基类单元测试
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Pipeline } from '../../src/core/serialization/pipeline/Pipeline'

describe('Pipeline', () => {
  let pipeline: Pipeline<string>

  beforeEach(() => {
    pipeline = new Pipeline<string>()
  })

  it('初始管道步骤数为 0', () => {
    expect(pipeline.size()).toBe(0)
    expect(pipeline.names()).toEqual([])
  })

  it('use 应添加步骤并返回 this（链式调用）', () => {
    const result = pipeline.use({ name: 'step1', process: (s) => s })
    expect(result).toBe(pipeline)
    expect(pipeline.size()).toBe(1)
  })

  it('run 应按顺序执行所有步骤', () => {
    pipeline
      .use({ name: 'trim', process: (s) => s.trim() })
      .use({ name: 'upper', process: (s) => s.toUpperCase() })
    expect(pipeline.run('  hello  ')).toBe('HELLO')
  })

  it('空管道 run 应返回原值', () => {
    expect(pipeline.run('input')).toBe('input')
  })

  it('remove 应移除指定步骤', () => {
    pipeline.use({ name: 'step1', process: (s) => s + 'A' })
    expect(pipeline.remove('step1')).toBe(true)
    expect(pipeline.size()).toBe(0)
  })

  it('remove 不存在的步骤应返回 false', () => {
    expect(pipeline.remove('nope')).toBe(false)
  })

  it('names 应返回所有步骤名', () => {
    pipeline
      .use({ name: 'a', process: (s) => s })
      .use({ name: 'b', process: (s) => s })
    expect(pipeline.names()).toEqual(['a', 'b'])
  })

  it('clear 应清空所有步骤', () => {
    pipeline
      .use({ name: 'a', process: (s) => s })
      .use({ name: 'b', process: (s) => s })
    pipeline.clear()
    expect(pipeline.size()).toBe(0)
    expect(pipeline.run('input')).toBe('input')
  })

  it('run 应正确传递中间结果', () => {
    const spy = vi.fn((s: string) => s + 'B')
    pipeline
      .use({ name: 'stepA', process: (s) => s + 'A' })
      .use({ name: 'stepB', process: spy })
    pipeline.run('X')
    expect(spy).toHaveBeenCalledWith('XA')
  })

  it('支持泛型非字符串类型', () => {
    const p = new Pipeline<number>()
      .use({ name: 'double', process: (n) => n * 2 })
      .use({ name: 'addOne', process: (n) => n + 1 })
    expect(p.run(3)).toBe(7) // (3*2)+1
  })
})