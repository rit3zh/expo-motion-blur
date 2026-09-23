//
//  MotionBlurOverlayView.swift
//  Pods
//
//  Created by rit3zh CX on 9/23/26.
//

import Metal
import UIKit

final class MotionBlurOverlayView: UIView {
  override class var layerClass: AnyClass {
    CAMetalLayer.self
  }
  var metalLayer: CAMetalLayer { layer as! CAMetalLayer }
  init(device: MTLDevice) {
    super.init(frame: .zero)
    isUserInteractionEnabled = false
    isOpaque = false
    backgroundColor = .clear
    isHidden = true
    metalLayer.device = device
    metalLayer.pixelFormat = MetalContext.pixelFormat
    metalLayer.colorspace = CGColorSpace(name: CGColorSpace.sRGB)
    metalLayer.framebufferOnly = true
    metalLayer.isOpaque = false
    metalLayer.presentsWithTransaction = true
  }
  @available(*, unavailable)
  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
  func apply(_ canvas: BlurCanvas) {
    frame = canvas.frame
    metalLayer.contentsScale = canvas.scale
    if metalLayer.drawableSize != canvas.drawableSize {
      metalLayer.drawableSize = canvas.drawableSize
    }
  }
}
