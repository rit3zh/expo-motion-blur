//
//  MetalContext.swift
//  Pods
//
//  Created by rit3zh CX on 9/23/26.
//

import Foundation
import Metal

@MainActor
final class MetalContext {
  static let shared: MetalContext? = MetalContext()

  nonisolated static let pixelFormat: MTLPixelFormat = .bgra8Unorm

  nonisolated private static let shaderFileName = "MotionBlur"
  nonisolated private static let vertexFunctionName = "motionBlurVertex"
  nonisolated private static let fragmentFunctionName = "motionBlurFragment"

  let device: MTLDevice
  let commandQueue: MTLCommandQueue

  private(set) var pipelineState: MTLRenderPipelineState?

  private var isPreparing = false
  private var didFailToPrepare = false

  private init?() {
    guard let device = MTLCreateSystemDefaultDevice(), let commandQueue = device.makeCommandQueue() else {
      return nil
    }
    commandQueue.label = "expo-motion-blur"
    self.device = device
    self.commandQueue = commandQueue
  }

  func prepare() {
    guard pipelineState == nil, !isPreparing, !didFailToPrepare else {
      return
    }
    isPreparing = true
    let device = device

    DispatchQueue.global(qos: .userInitiated).async {
      let pipelineState = Self.makePipelineState(device: device)

      DispatchQueue.main.async {
        guard let context = MetalContext.shared else {
          return
        }
        context.isPreparing = false
        context.pipelineState = pipelineState
        context.didFailToPrepare = pipelineState == nil
      }
    }
  }

  nonisolated private static func makePipelineState(device: MTLDevice) -> MTLRenderPipelineState? {
    do {
      let library = try makeShaderLibrary(device: device)
      let descriptor = MTLRenderPipelineDescriptor()
      descriptor.label = "Motion blur"
      descriptor.vertexFunction = library.makeFunction(name: vertexFunctionName)
      descriptor.fragmentFunction = library.makeFunction(name: fragmentFunctionName)
      descriptor.colorAttachments[0].pixelFormat = pixelFormat
      return try device.makeRenderPipelineState(descriptor: descriptor)
    } catch {
      NSLog("[expo-motion-blur] Failed to build the motion blur pipeline: %@", String(describing: error))
      return nil
    }
  }

  /// Compiles `Shaders/MotionBlur.metal`, which CocoaPods copies into the app bundle as a resource.
  nonisolated private static func makeShaderLibrary(device: MTLDevice) throws -> MTLLibrary {
    let bundles = [Bundle(for: BundleToken.self), Bundle.main]
    guard let url = bundles.lazy.compactMap({ $0.url(forResource: shaderFileName, withExtension: "metal") }).first else {
      throw ShaderError.missingSource
    }
    return try device.makeLibrary(source: String(contentsOf: url, encoding: .utf8), options: nil)
  }

  private enum ShaderError: Error {
    case missingSource
  }
}

private final class BundleToken {}
