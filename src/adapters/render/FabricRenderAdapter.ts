// @ts-nocheck — fabric@5.5.2 无官方类型声明，使用 window.fabric 全局对象
/**
 * Fabric.js 渲染适配器
 *
 * 实现 RenderAdapter 接口，委托 CanvasManager 和 SvgLoader/SvgSerializer
 * 完成实际的 Fabric.js Canvas 渲染操作。
 */

import type { Canvas } from 'fabric'
import type { SvgLoadResult } from '../../core/types'
import type { RenderAdapter } from './RenderAdapter'
import { CanvasManager } from '../../core/CanvasManager'

export class FabricRenderAdapter implements RenderAdapter {
  private canvasMgr: CanvasManager

  constructor(canvasMgr: CanvasManager) {
    this.canvasMgr = canvasMgr
  }

  init(canvasEl: HTMLCanvasElement, width: number, height: number): Canvas {
    return this.canvasMgr.init(canvasEl, width, height)
  }

  async loadSvg(canvas: Canvas, svgResult: SvgLoadResult): Promise<void> {
    return new Promise((resolve, reject) => {
      window.fabric.loadSVGFromString(svgResult.svg, (objects: fabric.Object[], options: any) => {
        try {
          canvas.clear()
          const group = new window.fabric.Group(objects, {
            selectable: true,
            evented: true,
          })
          canvas.add(group)
          canvas.requestRenderAll()
          resolve()
        } catch (e) {
          reject(e)
        }
      })
    })
  }

  serialize(canvas: Canvas, originalViewBox?: string): string {
    // 委托给 SvgSerializer 的静态方法
    const { SvgSerializer } = require('../../core/SvgSerializer')
    const serializer = new SvgSerializer()
    return serializer.serialize(canvas, { originalViewBox })
  }

  dispose(canvas: Canvas): void {
    this.canvasMgr.dispose()
  }
}
