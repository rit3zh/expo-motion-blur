//
//  FrameDriver.swift
//  Pods
//
//  Created by rit3zh CX on 9/23/26.
//

import UIKit

@MainActor
protocol FrameDriverClient: AnyObject {
  func frameDriver(_ driver: FrameDriver, didTickAt timestamp: CFTimeInterval, batch: RenderBatch) -> Bool

  func frameDriverDidReceiveMemoryWarning(_ driver: FrameDriver)
}

@MainActor
final class FrameDriver: NSObject {
  static let shared = FrameDriver()
  private static let fullFrameRate = CAFrameRateRange(minimum: 30, maximum: 120, preferred: 120)
  private static let idleFrameRate = CAFrameRateRange(minimum: 10, maximum: 30, preferred: 30)
  private let clients = NSHashTable<AnyObject>.weakObjects()
  private let batch = RenderBatch()
  private var displayLink: CADisplayLink?
  private var isRunningAtFullRate = false

  private override init() {
    super.init()
    let center = NotificationCenter.default
    center.addObserver(self, selector: #selector(applicationDidEnterBackground), name: UIApplication.didEnterBackgroundNotification, object: nil)
    center.addObserver(self, selector: #selector(applicationWillEnterForeground), name: UIApplication.willEnterForegroundNotification, object: nil)
    center.addObserver(self, selector: #selector(applicationDidReceiveMemoryWarning), name: UIApplication.didReceiveMemoryWarningNotification, object: nil)
  }

  func add(_ client: FrameDriverClient) {
    clients.add(client)
    startIfNeeded()
  }

  func remove(_ client: FrameDriverClient) {
    clients.remove(client)
    if clients.allObjects.isEmpty {
      stop()
    }
  }

  private func startIfNeeded() {
    guard displayLink == nil else {
      return
    }
    let link = CADisplayLink(target: self, selector: #selector(tick(_:)))
    link.preferredFrameRateRange = Self.idleFrameRate
    link.isPaused = UIApplication.shared.applicationState == .background
    link.add(to: .main, forMode: .common)
    displayLink = link
    isRunningAtFullRate = false
  }
  private func stop() {
    displayLink?.invalidate()
    displayLink = nil
  }
  @objc private func tick(_ link: CADisplayLink) {
    let activeClients = clients.allObjects
    guard !activeClients.isEmpty else {
      stop()
      return
    }
    var needsFullFrameRate = false
    for case let client as FrameDriverClient in activeClients {
      if client.frameDriver(self, didTickAt: link.targetTimestamp, batch: batch) {
        needsFullFrameRate = true
      }
    }
    batch.commit()
    if needsFullFrameRate != isRunningAtFullRate {
      isRunningAtFullRate = needsFullFrameRate
      link.preferredFrameRateRange = needsFullFrameRate ? Self.fullFrameRate : Self.idleFrameRate
    }
  }
  @objc private func applicationDidEnterBackground() {
    displayLink?.isPaused = true
  }
  @objc private func applicationWillEnterForeground() {
    displayLink?.isPaused = false
  }
  @objc private func applicationDidReceiveMemoryWarning() {
    for case let client as FrameDriverClient in clients.allObjects {
      client.frameDriverDidReceiveMemoryWarning(self)
    }
  }
}
