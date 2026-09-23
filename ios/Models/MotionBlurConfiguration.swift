//
//  MotionBlurConfiguration.swift
//  Pods
//
//  Created by rit3zh CX on 9/23/26.
//

import CoreGraphics

struct MotionBlurConfiguration: Equatable {
  static let `default` = MotionBlurConfiguration()
  static let sampleCountRange = 4...64
  var intensity: CGFloat = 40
  var speedForMaxBlur: CGFloat = 1500
  var maxSampleCount = 32
  var isEnabled = true
  var isLive = false
  var exposure: CGFloat {
    speedForMaxBlur > 0 ? intensity / speedForMaxBlur : 0
  }
}
