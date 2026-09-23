//
//  MotionBlurUniforms.swift
//  Pods
//
//  Created by rit3zh CX on 9/23/26.
//

import CoreGraphics
import simd

struct MotionBlurUniforms {
  var displacementColumnX: SIMD2<Float>
  var displacementColumnY: SIMD2<Float>
  var displacementOffset: SIMD2<Float>
  var maxDisplacement: Float
  var tapScale: Float
  var tapCount: Int32
  var feathered: Int32
}

extension MotionBlurUniforms {
  static let tapSpacing: CGFloat = 1.0

  init(
    velocity: VelocityField,
    canvas: BlurCanvas,
    configuration: MotionBlurConfiguration,
    pass: MotionBlurPass,
    tapCount: Int
  ) {
    let exposure = configuration.exposure
    let scale = canvas.scale
    let field = velocity.map

    let origin = canvas.frame.origin
    let offsetX = scale * exposure * (field.a * origin.x + field.c * origin.y + field.tx)
    let offsetY = scale * exposure * (field.b * origin.x + field.d * origin.y + field.ty)

    self.init(
      displacementColumnX: SIMD2(Float(field.a * exposure), Float(field.b * exposure)),
      displacementColumnY: SIMD2(Float(field.c * exposure), Float(field.d * exposure)),
      displacementOffset: SIMD2(Float(offsetX), Float(offsetY)),
      maxDisplacement: Float(max(configuration.intensity * scale, 1)),
      tapScale: pass == .fine ? 1 / Float(tapCount) : 1,
      tapCount: Int32(tapCount),
      feathered: pass == .fine ? 0 : 1
    )
  }

  static func tapCount(halfStreakPixels: CGFloat, maxSampleCount: Int) -> Int {
    let needed = Int(ceil(sqrt(2 * halfStreakPixels / tapSpacing)))
    return min(max(needed, 2), max(maxSampleCount / 2, 2))
  }
}

enum MotionBlurPass {
  case fine
  case coarse
}
