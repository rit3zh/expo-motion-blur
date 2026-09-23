//
//  MotionBlurRenderer.swift
//  Pods
//
//  Created by rit3zh CX on 9/23/26.
//

import Metal
import QuartzCore
import UIKit

@MainActor
final class MotionBlurRenderer {
  private let metal: MetalContext
  private var snapshot: ContentSnapshot?
  private var intermediateTexture: MTLTexture?

  init(metal: MetalContext) {
    self.metal = metal
  }

  func hasSnapshot(for canvas: BlurCanvas) -> Bool {
    snapshot?.canvas == canvas
  }

  func captureSnapshot(of view: UIView, canvas: BlurCanvas, drawsHierarchy: Bool) -> Bool {
    if snapshot?.canvas != canvas {
      snapshot = ContentSnapshot(device: metal.device, canvas: canvas)
    }
    guard let snapshot else {
      return false
    }
    return snapshot.capture(view, drawsHierarchy: drawsHierarchy)
  }

  func draw(
    velocity: VelocityField,
    halfStreakPixels: CGFloat,
    configuration: MotionBlurConfiguration,
    canvas: BlurCanvas,
    into overlay: CAMetalLayer,
    batch: RenderBatch
  ) -> Bool {
    guard
      let pipelineState = metal.pipelineState,
      let snapshot, snapshot.canvas == canvas,
      overlay.drawableSize == canvas.drawableSize,
      let intermediateTexture = intermediateTexture(for: canvas),
      let commandBuffer = batch.commandBuffer(from: metal)
    else {
      return false
    }

    snapshot.encodeUploadIfNeeded(into: commandBuffer)

    let tapCount = MotionBlurUniforms.tapCount(
      halfStreakPixels: halfStreakPixels,
      maxSampleCount: configuration.maxSampleCount
    )
    func uniforms(for pass: MotionBlurPass) -> MotionBlurUniforms {
      MotionBlurUniforms(velocity: velocity, canvas: canvas, configuration: configuration, pass: pass, tapCount: tapCount)
    }

    guard
      encodePass(uniforms(for: .fine), from: snapshot.texture, to: intermediateTexture, pipelineState: pipelineState, commandBuffer: commandBuffer),
      let drawable = overlay.nextDrawable(),
      encodePass(uniforms(for: .coarse), from: intermediateTexture, to: drawable.texture, pipelineState: pipelineState, commandBuffer: commandBuffer)
    else {
      return false
    }

    batch.present(drawable)
    return true
  }

  private func encodePass(
    _ uniforms: MotionBlurUniforms,
    from source: MTLTexture,
    to target: MTLTexture,
    pipelineState: MTLRenderPipelineState,
    commandBuffer: MTLCommandBuffer
  ) -> Bool {
    let passDescriptor = MTLRenderPassDescriptor()
    passDescriptor.colorAttachments[0].texture = target
    passDescriptor.colorAttachments[0].loadAction = .dontCare
    passDescriptor.colorAttachments[0].storeAction = .store

    guard let encoder = commandBuffer.makeRenderCommandEncoder(descriptor: passDescriptor) else {
      return false
    }
    var uniforms = uniforms
    encoder.label = "Motion blur"
    encoder.setRenderPipelineState(pipelineState)
    encoder.setFragmentBytes(&uniforms, length: MemoryLayout<MotionBlurUniforms>.stride, index: 0)
    encoder.setFragmentTexture(source, index: 0)
    encoder.drawPrimitives(type: .triangle, vertexStart: 0, vertexCount: 3)
    encoder.endEncoding()
    return true
  }

  private func intermediateTexture(for canvas: BlurCanvas) -> MTLTexture? {
    if let intermediateTexture,
       intermediateTexture.width == canvas.pixelWidth,
       intermediateTexture.height == canvas.pixelHeight {
      return intermediateTexture
    }
    let descriptor = MTLTextureDescriptor.texture2DDescriptor(
      pixelFormat: MetalContext.pixelFormat,
      width: canvas.pixelWidth,
      height: canvas.pixelHeight,
      mipmapped: false
    )
    descriptor.usage = [.renderTarget, .shaderRead]
    descriptor.storageMode = .private
    intermediateTexture = metal.device.makeTexture(descriptor: descriptor)
    intermediateTexture?.label = "Motion blur intermediate"
    return intermediateTexture
  }
}
