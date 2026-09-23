//
//  BlurCanvas.swift
//  Pods
//
//  Created by rit3zh CX on 9/23/26.
//

import CoreGraphics

struct BlurCanvas: Equatable {
  static let maxPixelDimension = 8192
  let bounds: CGRect
  let frame: CGRect
  let scale: CGFloat
  init(bounds: CGRect, inkRect: CGRect, intensity: CGFloat, scale: CGFloat) {
    self.bounds = bounds
    self.scale = scale
    let streakRoom = ceil(max(intensity, 0) * scale) + 2
    func margin(_ ink: CGFloat) -> CGFloat {
      (ceil(max(ink, 0) * scale) + streakRoom) / scale
    }
    let left = margin(bounds.minX - inkRect.minX)
    let top = margin(bounds.minY - inkRect.minY)
    let right = margin(inkRect.maxX - bounds.maxX)
    let bottom = margin(inkRect.maxY - bounds.maxY)
    frame = CGRect(
      x: bounds.minX - left,
      y: bounds.minY - top,
      width: bounds.width + left + right,
      height: bounds.height + top + bottom
    )
  }
  var contentOrigin: CGPoint {
    CGPoint(x: bounds.minX - frame.minX, y: bounds.minY - frame.minY)
  }
  var pixelWidth: Int {
    Int((frame.width * scale).rounded())
  }
  var pixelHeight: Int {
    Int((frame.height * scale).rounded())
  }
  var drawableSize: CGSize {
    CGSize(width: pixelWidth, height: pixelHeight)
  }
  var isRenderable: Bool {
    bounds.width > 0 && bounds.height > 0
      && pixelWidth <= Self.maxPixelDimension && pixelHeight <= Self.maxPixelDimension
  }
}
