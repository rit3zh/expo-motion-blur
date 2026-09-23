//
//  LayerTreeRenderer.swift
//  Pods
//
//  Created by rit3zh CX on 9/23/26.
//

import CoreGraphics
import QuartzCore

enum LayerTreeRenderer {
  static func render(_ layer: CALayer, in context: CGContext) {
    var shadowedLayers = Set<ObjectIdentifier>()
    guard collectShadowedLayers(layer, into: &shadowedLayers) else {
      layer.render(in: context)
      return
    }
    draw(layer, in: context, shadowedLayers: shadowedLayers)
  }

  static func hasVisibleShadow(_ layer: CALayer) -> Bool {
    layer.shadowOpacity > 0 && (layer.shadowColor?.alpha ?? 0) > 0
  }

  @discardableResult
  private static func collectShadowedLayers(_ layer: CALayer, into shadowedLayers: inout Set<ObjectIdentifier>) -> Bool {
    guard !layer.isHidden, layer.opacity > 0 else {
      return false
    }
    var containsShadow = hasVisibleShadow(layer)
    for sublayer in layer.sublayers ?? [] where collectShadowedLayers(sublayer, into: &shadowedLayers) {
      containsShadow = true
    }
    if containsShadow {
      shadowedLayers.insert(ObjectIdentifier(layer))
    }
    return containsShadow
  }

  private static func draw(_ layer: CALayer, in context: CGContext, shadowedLayers: Set<ObjectIdentifier>) {
    guard !layer.isHidden, layer.opacity > 0 else {
      return
    }
    guard shadowedLayers.contains(ObjectIdentifier(layer)) else {
      layer.render(in: context)
      return
    }

    let ownShadow = hasVisibleShadow(layer)
    let sublayersHaveShadows = (layer.sublayers ?? []).contains { shadowedLayers.contains(ObjectIdentifier($0)) }

    context.saveGState()
    defer { context.restoreGState() }

    if ownShadow, let shadowPath = layer.shadowPath {
      context.saveGState()
      clip(to: layer.mask, in: context)
      drawShadow(of: shadowPath, castBy: layer, opacity: CGFloat(layer.opacity), in: context)
      context.restoreGState()
    }
    if ownShadow, layer.shadowPath == nil {
      setShadow(castBy: layer, in: context)
    }

    guard sublayersHaveShadows else {
      context.beginTransparencyLayer(auxiliaryInfo: nil)
      layer.render(in: context)
      context.endTransparencyLayer()
      return
    }

    clip(to: layer.mask, in: context)
    context.setAlpha(CGFloat(layer.opacity))
    context.beginTransparencyLayer(auxiliaryInfo: nil)

    drawOwnContent(of: layer, border: false, in: context)
    context.saveGState()
    if layer.masksToBounds {
      context.addPath(roundedPath(for: layer))
      context.clip()
    }
    for sublayer in sortedSublayers(of: layer) {
      context.saveGState()
      concatenateGeometry(of: sublayer, in: context)
      draw(sublayer, in: context, shadowedLayers: shadowedLayers)
      context.restoreGState()
    }
    context.restoreGState()
    drawOwnContent(of: layer, border: true, in: context)

    context.endTransparencyLayer()
  }

  private static func drawOwnContent(of layer: CALayer, border: Bool, in context: CGContext) {
    let proxy = CALayer()
    proxy.bounds = layer.bounds
    proxy.cornerRadius = layer.cornerRadius
    proxy.maskedCorners = layer.maskedCorners
    proxy.cornerCurve = layer.cornerCurve
    if border {
      guard layer.borderWidth > 0, layer.borderColor != nil else {
        return
      }
      proxy.borderWidth = layer.borderWidth
      proxy.borderColor = layer.borderColor
    } else {
      guard layer.backgroundColor != nil || layer.contents != nil else {
        return
      }
      proxy.backgroundColor = layer.backgroundColor
      proxy.contents = layer.contents
      proxy.contentsRect = layer.contentsRect
      proxy.contentsCenter = layer.contentsCenter
      proxy.contentsGravity = layer.contentsGravity
      proxy.contentsScale = layer.contentsScale
      proxy.masksToBounds = layer.masksToBounds
    }
    proxy.render(in: context)
  }

  private static func setShadow(castBy layer: CALayer, in context: CGContext) {
    guard let color = layer.shadowColor else {
      return
    }
    let ctm = context.ctm
    context.setShadow(
      offset: deviceOffset(layer.shadowOffset, ctm: ctm),
      blur: deviceBlur(layer.shadowRadius, ctm: ctm),
      color: color.copy(alpha: color.alpha * CGFloat(layer.shadowOpacity)) ?? color
    )
  }

  private static func drawShadow(of path: CGPath, castBy layer: CALayer, opacity: CGFloat, in context: CGContext) {
    guard let color = layer.shadowColor else {
      return
    }
    let ctm = context.ctm
    let farAway: CGFloat = 20_000
    let offset = deviceOffset(layer.shadowOffset, ctm: ctm)
    let displacement = CGPoint(x: farAway, y: 0).applying(ctm.inverted().withoutTranslation)

    context.saveGState()
    context.setShadow(
      offset: CGSize(width: offset.width - farAway, height: offset.height),
      blur: deviceBlur(layer.shadowRadius, ctm: ctm),
      color: color.copy(alpha: color.alpha * CGFloat(layer.shadowOpacity) * opacity) ?? color
    )
    context.translateBy(x: displacement.x, y: displacement.y)
    context.addPath(path)
    context.setFillColor(CGColor(gray: 0, alpha: 1))
    context.fillPath()
    context.restoreGState()
  }

  private static func deviceOffset(_ offset: CGSize, ctm: CGAffineTransform) -> CGSize {
    CGSize(
      width: ctm.a * offset.width + ctm.c * offset.height,
      height: ctm.b * offset.width + ctm.d * offset.height
    )
  }

  private static func deviceBlur(_ radius: CGFloat, ctm: CGAffineTransform) -> CGFloat {
    radius * 2 * sqrt(abs(ctm.a * ctm.d - ctm.b * ctm.c))
  }

  private static func concatenateGeometry(of layer: CALayer, in context: CGContext) {
    let bounds = layer.bounds
    context.translateBy(x: layer.position.x, y: layer.position.y)
    if !CATransform3DIsIdentity(layer.transform) {
      context.concatenate(CATransform3DGetAffineTransform(layer.transform))
    }
    context.translateBy(
      x: -bounds.minX - layer.anchorPoint.x * bounds.width,
      y: -bounds.minY - layer.anchorPoint.y * bounds.height
    )
  }

  private static func sortedSublayers(of layer: CALayer) -> [CALayer] {
    (layer.sublayers ?? []).enumerated()
      .sorted { $0.element.zPosition != $1.element.zPosition ? $0.element.zPosition < $1.element.zPosition : $0.offset < $1.offset }
      .map(\.element)
  }

  private static func clip(to mask: CALayer?, in context: CGContext) {
    guard let mask = mask as? CAShapeLayer, let path = mask.path else {
      return
    }
    context.saveGState()
    concatenateGeometry(of: mask, in: context)
    let transform = context.ctm
    context.restoreGState()
    var toCurrentSpace = transform.concatenating(context.ctm.inverted())
    guard let maskPath = path.copy(using: &toCurrentSpace) else {
      return
    }
    context.addPath(maskPath)
    context.clip(using: mask.fillRule == .evenOdd ? .evenOdd : .winding)
  }

  private static func roundedPath(for layer: CALayer) -> CGPath {
    let rect = layer.bounds
    let radius = min(layer.cornerRadius, rect.width / 2, rect.height / 2)
    guard radius > 0 else {
      return CGPath(rect: rect, transform: nil)
    }
    let corners = layer.maskedCorners
    func cornerRadius(_ corner: CACornerMask) -> CGFloat {
      corners.contains(corner) ? radius : 0
    }
    let topLeft = cornerRadius(.layerMinXMinYCorner)
    let topRight = cornerRadius(.layerMaxXMinYCorner)
    let bottomRight = cornerRadius(.layerMaxXMaxYCorner)
    let bottomLeft = cornerRadius(.layerMinXMaxYCorner)

    let path = CGMutablePath()
    path.move(to: CGPoint(x: rect.minX + topLeft, y: rect.minY))
    path.addArc(tangent1End: CGPoint(x: rect.maxX, y: rect.minY), tangent2End: CGPoint(x: rect.maxX, y: rect.maxY), radius: topRight)
    path.addArc(tangent1End: CGPoint(x: rect.maxX, y: rect.maxY), tangent2End: CGPoint(x: rect.minX, y: rect.maxY), radius: bottomRight)
    path.addArc(tangent1End: CGPoint(x: rect.minX, y: rect.maxY), tangent2End: CGPoint(x: rect.minX, y: rect.minY), radius: bottomLeft)
    path.addArc(tangent1End: CGPoint(x: rect.minX, y: rect.minY), tangent2End: CGPoint(x: rect.maxX, y: rect.minY), radius: topLeft)
    path.closeSubpath()
    return path
  }
}

private extension CGAffineTransform {
  var withoutTranslation: CGAffineTransform {
    CGAffineTransform(a: a, b: b, c: c, d: d, tx: 0, ty: 0)
  }
}
