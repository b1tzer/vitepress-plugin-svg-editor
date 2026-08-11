/**
 * Fabric.js 渲染适配器
 *
 * 实现 RenderAdapter 接口，委托 CanvasManager 和 SvgLoader/SvgSerializer
 * 完成实际的 Fabric.js Canvas 渲染操作。
 */

import * as fabric from 'fabric'
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
    // Fabric 6: loadSVGFromString 返回 Promise，不再使用 callback
    const result = await fabric.loadSVGFromString(svgResult.svg)
    canvas.clear()
    const group = new fabric.Group(result.objects.filter(Boolean) as fabric.FabricObject[], {
      selectable: true,
      evented: true,
    })
    canvas.add(group)
    canvas.requestRenderAll()
  }

  serialize(canvas: Canvas, originalViewBox?: string): string {
    // 委托给 SvgSerializer 的静态方法
    const { SvgSerializer } = require('../../core/SvgSerializer')
    const serializer = new SvgSerializer()
    return serializer.serialize(canvas, { originalViewBox })
  }

  dispose(_canvas: Canvas): void {
    this.canvasMgr.dispose()
  }
}
