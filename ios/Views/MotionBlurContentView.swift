//
//  MotionBlurContentView.swift
//  Pods
//
//  Created by rit3zh CX on 9/23/26.
//

import UIKit

final class MotionBlurContentView: UIView {
  override func hitTest(_ point: CGPoint, with event: UIEvent?) -> UIView? {
    guard isUserInteractionEnabled, !isHidden else {
      return nil
    }
    for subview in subviews.reversed() {
      if let hitView = subview.hitTest(subview.convert(point, from: self), with: event) {
        return hitView
      }
    }
    return nil
  }
}
