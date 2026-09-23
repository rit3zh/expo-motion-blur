//
//  ContentSnapshot.swift
//  Pods
//
//  Created by rit3zh CX on 9/23/26.
//

import CoreGraphics
import Metal
import QuartzCore
import UIKit

@MainActor
final class ContentSnapshot {
  let canvas: BlurCanvas
  let texture: MTLTexture
  private let stagingBuffer: MTLBuffer
  private let bytesPerRow: Int
  private let context: CGContext
  private var needsUpload = false
  private var pendingUpload: MTLCommandBuffer?

  init?(device: MTLDevice, canvas: BlurCanvas) {
    let width = canvas.pixelWidth
    let height = canvas.pixelHeight
    guard canvas.isRenderable, width > 0, height > 0 else {
      return nil
    }
    let bytesPerRow = (width * 4 + 63) & ~63
    let descriptor = MTLTextureDescriptor.texture2DDescriptor(
      pixelFormat: MetalContext.pixelFormat,
      width: width,
      height: height,
      mipmapped: false
    )
    descriptor.usage = .shaderRead
    descriptor.storageMode = .private

    guard
      let stagingBuffer = device.makeBuffer(length: bytesPerRow * height, options: .storageModeShared),
      let texture = device.makeTexture(descriptor: descriptor),
      let colorSpace = CGColorSpace(name: CGColorSpace.sRGB),
      let context = CGContext(
        data: stagingBuffer.contents(),
        width: width,
        height: height,
        bitsPerComponent: 8,
        bytesPerRow: bytesPerRow,
        space: colorSpace,
        bitmapInfo: CGImageAlphaInfo.premultipliedFirst.rawValue | CGBitmapInfo.byteOrder32Little.rawValue
      )
    else {
      return nil
    }
    stagingBuffer.label = "Motion blur snapshot staging"
    texture.label = "Motion blur snapshot"
    self.canvas = canvas
    self.texture = texture
    self.stagingBuffer = stagingBuffer
    self.bytesPerRow = bytesPerRow
    self.context = context
  }
  /// Draws `view` into the staging buffer. `drawsHierarchy` renders it the way it currently looks on
  /// screen, which is the only way to capture effects that `CALayer.render(in:)` skips, such as
  /// `UIVisualEffectView` blur and Liquid Glass. Returns `false` when nothing could be captured.
  func capture(_ view: UIView, drawsHierarchy: Bool) -> Bool {
    pendingUpload?.waitUntilCompleted()
    pendingUpload = nil
    context.clear(CGRect(x: 0, y: 0, width: canvas.pixelWidth, height: canvas.pixelHeight))
    context.saveGState()
    context.translateBy(x: 0, y: CGFloat(canvas.pixelHeight))
    context.scaleBy(x: canvas.scale, y: -canvas.scale)
    context.translateBy(x: canvas.contentOrigin.x, y: canvas.contentOrigin.y)
    var didDraw = false
    if drawsHierarchy {
      UIGraphicsPushContext(context)
      didDraw = view.drawHierarchy(in: CGRect(origin: .zero, size: view.bounds.size), afterScreenUpdates: false)
      UIGraphicsPopContext()
    }
    if !didDraw {
      LayerTreeRenderer.render(view.layer, in: context)
    }
    context.restoreGState()
    needsUpload = true
    return true
  }
  func encodeUploadIfNeeded(into commandBuffer: MTLCommandBuffer) {
    guard needsUpload, let blitEncoder = commandBuffer.makeBlitCommandEncoder() else {
      return
    }
    blitEncoder.copy(
      from: stagingBuffer,
      sourceOffset: 0,
      sourceBytesPerRow: bytesPerRow,
      sourceBytesPerImage: bytesPerRow * canvas.pixelHeight,
      sourceSize: MTLSize(width: canvas.pixelWidth, height: canvas.pixelHeight, depth: 1),
      to: texture,
      destinationSlice: 0,
      destinationLevel: 0,
      destinationOrigin: MTLOrigin(x: 0, y: 0, z: 0)
    )
    blitEncoder.endEncoding()
    needsUpload = false
    pendingUpload = commandBuffer
  }
}
