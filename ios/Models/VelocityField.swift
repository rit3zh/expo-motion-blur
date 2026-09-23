//
//  VelocityField.swift
//  Pods
//
//  Created by rit3zh CX on 9/23/26.
//

import CoreGraphics

struct VelocityField: Equatable {
  static let zero = VelocityField(map: .zero)
  var map: AffineMap
  func maxSpeed(in rect: CGRect) -> CGFloat {
    map.maxMagnitude(over: rect)
  }
  func interpolated(to target: VelocityField, amount: CGFloat) -> VelocityField {
    VelocityField(map: map.interpolated(to: target.map, amount: amount))
  }
}
