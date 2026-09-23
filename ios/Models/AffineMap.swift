//
//  AffineMap.swift
//  Pods
//
//  Created by rit3zh CX on 9/23/26.
//

import CoreGraphics

struct AffineMap: Equatable {
  var a: CGFloat
  var b: CGFloat
  var c: CGFloat
  var d: CGFloat
  var tx: CGFloat
  var ty: CGFloat

  static let zero = AffineMap(a: 0, b: 0, c: 0, d: 0, tx: 0, ty: 0)

  init(a: CGFloat, b: CGFloat, c: CGFloat, d: CGFloat, tx: CGFloat, ty: CGFloat) {
    self.a = a
    self.b = b
    self.c = c
    self.d = d
    self.tx = tx
    self.ty = ty
  }

  init?(mapping rect: CGRect, topLeft: CGPoint, topRight: CGPoint, bottomLeft: CGPoint) {
    guard rect.width > 0, rect.height > 0 else {
      return nil
    }
    a = (topRight.x - topLeft.x) / rect.width
    b = (topRight.y - topLeft.y) / rect.width
    c = (bottomLeft.x - topLeft.x) / rect.height
    d = (bottomLeft.y - topLeft.y) / rect.height
    tx = topLeft.x - a * rect.minX - c * rect.minY
    ty = topLeft.y - b * rect.minX - d * rect.minY
  }

  var determinant: CGFloat {
    a * d - b * c
  }

  func apply(to point: CGPoint) -> CGPoint {
    CGPoint(x: a * point.x + c * point.y + tx, y: b * point.x + d * point.y + ty)
  }

  func linearInverse() -> AffineMap? {
    let determinant = determinant
    guard abs(determinant) > 1e-9 else {
      return nil
    }
    return AffineMap(a: d / determinant, b: -b / determinant, c: -c / determinant, d: a / determinant, tx: 0, ty: 0)
  }

  func linearlyTransforming(_ other: AffineMap) -> AffineMap {
    AffineMap(
      a: a * other.a + c * other.b,
      b: b * other.a + d * other.b,
      c: a * other.c + c * other.d,
      d: b * other.c + d * other.d,
      tx: a * other.tx + c * other.ty,
      ty: b * other.tx + d * other.ty
    )
  }

  func maxMagnitude(over rect: CGRect) -> CGFloat {
    func magnitude(_ x: CGFloat, _ y: CGFloat) -> CGFloat {
      let vector = apply(to: CGPoint(x: x, y: y))
      return hypot(vector.x, vector.y)
    }
    return max(
      max(magnitude(rect.minX, rect.minY), magnitude(rect.maxX, rect.minY)),
      max(magnitude(rect.minX, rect.maxY), magnitude(rect.maxX, rect.maxY))
    )
  }
  func interpolated(to target: AffineMap, amount: CGFloat) -> AffineMap {
    self + (target - self) * amount
  }
  static func + (lhs: AffineMap, rhs: AffineMap) -> AffineMap {
    AffineMap(a: lhs.a + rhs.a, b: lhs.b + rhs.b, c: lhs.c + rhs.c, d: lhs.d + rhs.d, tx: lhs.tx + rhs.tx, ty: lhs.ty + rhs.ty)
  }
  static func - (lhs: AffineMap, rhs: AffineMap) -> AffineMap {
    AffineMap(a: lhs.a - rhs.a, b: lhs.b - rhs.b, c: lhs.c - rhs.c, d: lhs.d - rhs.d, tx: lhs.tx - rhs.tx, ty: lhs.ty - rhs.ty)
  }
  static func * (lhs: AffineMap, scalar: CGFloat) -> AffineMap {
    AffineMap(a: lhs.a * scalar, b: lhs.b * scalar, c: lhs.c * scalar, d: lhs.d * scalar, tx: lhs.tx * scalar, ty: lhs.ty * scalar)
  }
}
