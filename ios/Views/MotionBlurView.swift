//
//  MotionBlurView.swift
//  Pods
//
//  Created by rit3zh CX on 9/23/26.
//

import ExpoModulesCore
import UIKit

final class MotionBlurView: ExpoView, FrameDriverClient {
  private static let showThreshold: CGFloat = 1.0
  private static let hideThreshold: CGFloat = 0.5
  private static let resourceIdleTimeout: CFTimeInterval = 1.5
  private static let maxInkOverflow: CGFloat = 96
  // A spring that bounces stops for a moment at each peak. Motion that resumes within this window
  // reuses the snapshot instead of capturing the content again mid-animation.
  private static let snapshotReuseWindow: CFTimeInterval = 0.3

  var configuration = MotionBlurConfiguration() {
    didSet {
      configurationDidChange(from: oldValue)
    }
  }

  private let contentView = MotionBlurContentView()
  private let tracker = MotionTracker()
  private var overlayView: MotionBlurOverlayView?
  private var renderer: MotionBlurRenderer?
  private var canvas: BlurCanvas?
  private var isBlurVisible = false
  private var needsSnapshot = true
  private var isRegistered = false
  private var lastActiveTimestamp: CFTimeInterval = 0
  private var blurHiddenTimestamp: CFTimeInterval = -.infinity
  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    clipsToBounds = false
    contentView.frame = bounds
    contentView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
    addSubview(contentView)
  }

  @objc var effectiveContentView: UIView {
    contentView
  }

  override var bounds: CGRect {
    didSet {
      if bounds != oldValue {
        contentView.frame = bounds
      }
    }
  }

  override func mountChildComponentView(_ childComponentView: UIView, index: Int) {
    super.mountChildComponentView(childComponentView, index: index)
    needsSnapshot = true
  }

  override func unmountChildComponentView(_ childComponentView: UIView, index: Int) {
    super.unmountChildComponentView(childComponentView, index: index)
    needsSnapshot = true
  }

  func propsDidUpdate() {
    needsSnapshot = true
    updateCanvas()
    updateShadowPath()
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    contentView.frame = bounds
    updateCanvas()
    updateShadowPath()
  }

  override func didMoveToWindow() {
    super.didMoveToWindow()
    updateCanvas()
    updateRegistration()
  }

  func frameDriver(_ driver: FrameDriver, didTickAt timestamp: CFTimeInterval, batch: RenderBatch) -> Bool {
    guard let window, let frame = currentWindowFrame(in: window) else {
      tracker.reset()
      setBlurVisible(false)
      return false
    }
    tracker.update(frame: frame, bounds: bounds, timestamp: timestamp)

    let halfStreak = min(tracker.velocity.maxSpeed(in: bounds) * configuration.exposure, configuration.intensity)
    let halfStreakPixels = halfStreak * (canvas?.scale ?? 1)
    let threshold = isBlurVisible ? Self.hideThreshold : Self.showThreshold
    let wantsBlur = halfStreakPixels > threshold && isOnScreen(frame, in: window)
    setBlurVisible(wantsBlur && drawBlur(halfStreakPixels: halfStreakPixels, into: batch))

    let isActive = tracker.isMoving || isBlurVisible
    if isActive {
      lastActiveTimestamp = timestamp
    } else if timestamp - lastActiveTimestamp > Self.resourceIdleTimeout {
      releaseGPUResources()
    }
    return isActive
  }

  func frameDriverDidReceiveMemoryWarning(_ driver: FrameDriver) {
    releaseGPUResources()
  }

  private func drawBlur(halfStreakPixels: CGFloat, into batch: RenderBatch) -> Bool {
    guard !isHidden, alpha > 0.01, let metal = MetalContext.shared, metal.pipelineState != nil else {
      return false
    }
    let renderer = renderer ?? MotionBlurRenderer(metal: metal)
    self.renderer = renderer
    let isResumingMotion = !isBlurVisible && CACurrentMediaTime() - blurHiddenTimestamp < Self.snapshotReuseWindow
    let needsCapture = needsSnapshot || configuration.isLive || (!isBlurVisible && !isResumingMotion)
    if needsCapture {
      updateCanvas()
    }
    guard let canvas, canvas.isRenderable else {
      return false
    }
    let overlay = overlayView ?? makeOverlay(device: metal.device, canvas: canvas)

    if needsCapture || !renderer.hasSnapshot(for: canvas) {
      guard captureContent(with: renderer, canvas: canvas) else {
        return false
      }
      needsSnapshot = false
    }
    return renderer.draw(
      velocity: tracker.velocity,
      halfStreakPixels: halfStreakPixels,
      configuration: configuration,
      canvas: canvas,
      into: overlay.metalLayer,
      batch: batch
    )
  }

  private func captureContent(with renderer: MotionBlurRenderer, canvas: BlurCanvas) -> Bool {
    let isContentHidden = contentView.alpha < 1
    // Glass and blur effects only show up in an on-screen snapshot, which needs the content visible.
    let drawsHierarchy = !isContentHidden && Self.containsVisualEffect(contentView)
    if isContentHidden {
      contentView.alpha = 1
    }
    defer {
      if isContentHidden {
        contentView.alpha = 0
      }
    }
    return renderer.captureSnapshot(of: contentView, canvas: canvas, drawsHierarchy: drawsHierarchy)
  }

  private static func containsVisualEffect(_ view: UIView) -> Bool {
    if view is UIVisualEffectView {
      return true
    }
    return view.subviews.contains { !$0.isHidden && containsVisualEffect($0) }
  }

  private func setBlurVisible(_ visible: Bool) {
    guard visible != isBlurVisible else {
      return
    }
    isBlurVisible = visible
    if !visible {
      blurHiddenTimestamp = CACurrentMediaTime()
    }
    contentView.alpha = visible ? 0 : 1
    overlayView?.isHidden = !visible
    updateShadowPath()
  }

  private func makeOverlay(device: MTLDevice, canvas: BlurCanvas) -> MotionBlurOverlayView {
    let overlay = MotionBlurOverlayView(device: device)
    overlay.apply(canvas)
    addSubview(overlay)
    overlayView = overlay
    return overlay
  }

  private func releaseGPUResources() {
    guard !isBlurVisible else {
      return
    }
    renderer = nil
    overlayView?.removeFromSuperview()
    overlayView = nil
    needsSnapshot = true
  }

  private func updateShadowPath() {
    let contentLayer = contentView.layer
    guard
      layer.shadowOpacity > 0, !isBlurVisible,
      let backgroundColor = contentLayer.backgroundColor, backgroundColor.alpha > 0.999,
      bounds.width > 0, bounds.height > 0
    else {
      layer.shadowPath = nil
      return
    }
    let radius = min(contentLayer.cornerRadius, bounds.width / 2, bounds.height / 2)
    layer.shadowPath = CGPath(roundedRect: bounds, cornerWidth: radius, cornerHeight: radius, transform: nil)
  }

  private func currentWindowFrame(in window: UIWindow) -> AffineMap? {
    let source: CALayer
    let destination: CALayer
    if let presentedLayer = layer.presentation(), let presentedWindowLayer = window.layer.presentation() {
      source = presentedLayer
      destination = presentedWindowLayer
    } else {
      source = layer
      destination = window.layer
    }
    let rect = source.bounds
    return AffineMap(
      mapping: rect,
      topLeft: source.convert(CGPoint(x: rect.minX, y: rect.minY), to: destination),
      topRight: source.convert(CGPoint(x: rect.maxX, y: rect.minY), to: destination),
      bottomLeft: source.convert(CGPoint(x: rect.minX, y: rect.maxY), to: destination)
    )
  }

  private func isOnScreen(_ frame: AffineMap, in window: UIWindow) -> Bool {
    guard let canvas else {
      return false
    }
    let rect = canvas.frame
    let corners = [
      frame.apply(to: CGPoint(x: rect.minX, y: rect.minY)),
      frame.apply(to: CGPoint(x: rect.maxX, y: rect.minY)),
      frame.apply(to: CGPoint(x: rect.minX, y: rect.maxY)),
      frame.apply(to: CGPoint(x: rect.maxX, y: rect.maxY)),
    ]
    let xs = corners.map(\.x)
    let ys = corners.map(\.y)
    let boundingBox = CGRect(
      x: xs.min() ?? 0,
      y: ys.min() ?? 0,
      width: (xs.max() ?? 0) - (xs.min() ?? 0),
      height: (ys.max() ?? 0) - (ys.min() ?? 0)
    )
    return boundingBox.intersects(window.bounds)
  }

  private func contentInkRect() -> CGRect {
    let contentLayer = contentView.layer
    var ink = contentView.bounds
    for sublayer in contentLayer.sublayers ?? [] where !sublayer.isHidden && sublayer.opacity > 0 {
      ink = ink.union(sublayer.frame)
      if LayerTreeRenderer.hasVisibleShadow(sublayer) {
        let caster = sublayer.shadowPath?.boundingBoxOfPath ?? sublayer.bounds
        let spread = sublayer.shadowRadius * 3
        let shadow = sublayer.convert(caster, to: contentLayer)
          .offsetBy(dx: sublayer.shadowOffset.width, dy: sublayer.shadowOffset.height)
          .insetBy(dx: -spread, dy: -spread)
        ink = ink.union(shadow)
      }
    }
    let inkInHost = ink.offsetBy(dx: bounds.minX, dy: bounds.minY)
    return inkInHost.intersection(bounds.insetBy(dx: -Self.maxInkOverflow, dy: -Self.maxInkOverflow))
  }

  private func updateCanvas() {
    guard let window else {
      return
    }
    let newCanvas = BlurCanvas(
      bounds: bounds,
      inkRect: contentInkRect(),
      intensity: configuration.intensity,
      scale: window.screen.scale
    )
    guard newCanvas != canvas else {
      return
    }
    canvas = newCanvas
    needsSnapshot = true
    overlayView?.apply(newCanvas)
  }

  private func configurationDidChange(from oldValue: MotionBlurConfiguration) {
    if configuration.intensity != oldValue.intensity {
      updateCanvas()
    }
    if configuration.isEnabled != oldValue.isEnabled {
      updateRegistration()
    }
  }

  private func updateRegistration() {
    let shouldRun = window != nil && configuration.isEnabled && MetalContext.shared != nil
    guard shouldRun != isRegistered else {
      return
    }
    isRegistered = shouldRun

    if shouldRun {
      MetalContext.shared?.prepare()
      FrameDriver.shared.add(self)
    } else {
      FrameDriver.shared.remove(self)
      tracker.reset()
      setBlurVisible(false)
      releaseGPUResources()
    }
  }
}
