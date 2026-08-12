/**
 * 通用处理管道 — 责任链模式
 *
 * 职责：
 *   - 按顺序执行注册的处理步骤
 *   - 支持动态添加和移除步骤
 *   - 类型安全的输入/输出转换（默认 T = string）
 *
 * 使用方式：
 *   const pipeline = new Pipeline<string>()
 *     .use({ name: 'step1', process: (s) => s.toUpperCase() })
 *     .use({ name: 'step2', process: (s) => s.trim() })
 *   const result = pipeline.run('  hello  ') // → 'HELLO'
 */

export interface IPipelineStep<T = string> {
  /** 步骤唯一标识名 */
  name: string
  /** 处理函数：接收输入，返回处理后的输出 */
  process(input: T): T
}

export class Pipeline<T = string> {
  private _steps: IPipelineStep<T>[] = []

  /** 添加处理步骤（链式调用） */
  use(step: IPipelineStep<T>): this {
    this._steps.push(step)
    return this
  }

  /** 按名称移除步骤，返回是否移除成功 */
  remove(name: string): boolean {
    const idx = this._steps.findIndex((s) => s.name === name)
    if (idx === -1) return false
    this._steps.splice(idx, 1)
    return true
  }

  /** 获取所有步骤名称 */
  names(): string[] {
    return this._steps.map((s) => s.name)
  }

  /** 获取步骤数量 */
  size(): number {
    return this._steps.length
  }

  /** 执行管道：按顺序将输入传递给每个步骤 */
  run(input: T): T {
    return this._steps.reduce((acc, step) => step.process(acc), input)
  }

  /** 清空所有步骤 */
  clear(): void {
    this._steps = []
  }
}