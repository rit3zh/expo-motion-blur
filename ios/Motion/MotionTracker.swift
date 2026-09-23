//
//  MotionTracker.swift
//  Pods
//
//  Created by rit3zh CX on 9/23/26.
//

import QuartzCore

@MainActor
final class MotionTracker {
  private static let fitWindow: CFTimeInterval = 1.0 / 30.0
  private static let attackTimeConstant: CFTimeInterval = 0.012
  private static let releaseTimeConstant: CFTimeInterval = 0.05
  private static let maxSampleGap: CFTimeInterval = 0.1
  private static let jumpTolerance: CGFloat = 32
  private static let jumpSpeedFactor: CGFloat = 3
  private static let restingSpeed: CGFloat = 2
  private(set) var velocity: VelocityField = .zero
  private(set) var isMoving = false
  private var samples: [MotionSample] = []

  private var windowSpeed: CGFloat = 0

  func reset() {
    samples.removeAll(keepingCapacity: true)
    velocity = .zero
    windowSpeed = 0
    isMoving = false
  }

  func update(frame: AffineMap, bounds: CGRect, timestamp: CFTimeInterval) {
    let sample = MotionSample(timestamp: timestamp, frame: frame)

    guard let previous = samples.last else {
      samples.append(sample)
      return
    }
    let elapsed = timestamp - previous.timestamp
    guard elapsed > 0 else {
      return
    }
    guard elapsed <= Self.maxSampleGap else {
      restart(from: sample)
      return
    }
    let jump = (frame - previous.frame).maxMagnitude(over: bounds)
    if jump > Self.jumpTolerance + Self.jumpSpeedFactor * windowSpeed * CGFloat(elapsed) {
      restart(from: sample)
      isMoving = true
      return
    }
    samples.append(sample)
    trimHistory(before: timestamp)
    let frameVelocity = fittedFrameVelocity()
    windowSpeed = frameVelocity.maxMagnitude(over: bounds)
    guard let inverse = frame.linearInverse() else {
      velocity = .zero
      isMoving = false
      return
    }
    let rawVelocity = VelocityField(map: inverse.linearlyTransforming(frameVelocity))
    let isSpeedingUp = rawVelocity.maxSpeed(in: bounds) > velocity.maxSpeed(in: bounds)
    let timeConstant = isSpeedingUp ? Self.attackTimeConstant : Self.releaseTimeConstant
    velocity = velocity.interpolated(to: rawVelocity, amount: CGFloat(1 - exp(-elapsed / timeConstant)))
    isMoving = windowSpeed > Self.restingSpeed || velocity.maxSpeed(in: bounds) > Self.restingSpeed
  }
  private func restart(from sample: MotionSample) {
    reset()
    samples.append(sample)
  }
  private func trimHistory(before timestamp: CFTimeInterval) {
    while samples.count > 2, timestamp - samples[0].timestamp > Self.fitWindow + 0.001 {
      samples.removeFirst()
    }
  }
  private func fittedFrameVelocity() -> AffineMap {
    let origin = samples[samples.count - 1].timestamp
    let count = CGFloat(samples.count)
    var meanTime: CGFloat = 0
    var meanFrame = AffineMap.zero
    for sample in samples {
      meanTime += CGFloat(sample.timestamp - origin)
      meanFrame = meanFrame + sample.frame
    }
    meanTime /= count
    meanFrame = meanFrame * (1 / count)
    var covariance = AffineMap.zero
    var variance: CGFloat = 0
    for sample in samples {
      let offset = CGFloat(sample.timestamp - origin) - meanTime
      covariance = covariance + (sample.frame - meanFrame) * offset
      variance += offset * offset
    }
    return variance > 0 ? covariance * (1 / variance) : .zero
  }
}
