//
//  RenderBatch.swift
//  Pods
//
//  Created by rit3zh CX on 9/23/26.
//

import Metal
import QuartzCore

@MainActor
final class RenderBatch {
  private var commandBuffer: MTLCommandBuffer?
  private var drawables: [CAMetalDrawable] = []

  func commandBuffer(from context: MetalContext) -> MTLCommandBuffer? {
    if let commandBuffer {
      return commandBuffer
    }
    let commandBuffer = context.commandQueue.makeCommandBuffer()
    commandBuffer?.label = "Motion blur frame"
    self.commandBuffer = commandBuffer
    return commandBuffer
  }

  func present(_ drawable: CAMetalDrawable) {
    drawables.append(drawable)
  }

  func commit() {
    guard let commandBuffer else {
      return
    }
    self.commandBuffer = nil
    commandBuffer.commit()
    commandBuffer.waitUntilScheduled()
    for drawable in drawables {
      drawable.present()
    }
    drawables.removeAll(keepingCapacity: true)
  }
}
