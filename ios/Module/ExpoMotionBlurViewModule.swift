//
//  ExpoMotionBlurViewModule.swift
//  Pods
//
//  Created by rit3zh CX on 9/23/26.
//

import ExpoModulesCore

public class ExpoMotionBlurViewModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoMotionBlurView")

    OnCreate {
      DispatchQueue.main.async {
        MetalContext.shared?.prepare()
      }
    }

    View(MotionBlurView.self) {
      let defaults = MotionBlurConfiguration.default

      Prop("intensity", Double(defaults.intensity)) { (view: MotionBlurView, value: Double) in
        view.configuration.intensity = max(0, CGFloat(value))
      }

      Prop("speedForMaxBlur", Double(defaults.speedForMaxBlur)) { (view: MotionBlurView, value: Double) in
        view.configuration.speedForMaxBlur = max(1, CGFloat(value))
      }

      Prop("samples", defaults.maxSampleCount) { (view: MotionBlurView, value: Int) in
        view.configuration.maxSampleCount = min(max(value, MotionBlurConfiguration.sampleCountRange.lowerBound), MotionBlurConfiguration.sampleCountRange.upperBound)
      }

      Prop("enabled", defaults.isEnabled) { (view: MotionBlurView, value: Bool) in
        view.configuration.isEnabled = value
      }

      Prop("live", defaults.isLive) { (view: MotionBlurView, value: Bool) in
        view.configuration.isLive = value
      }

      OnViewDidUpdateProps { (view: MotionBlurView) in
        view.propsDidUpdate()
      }
    }
  }
}
