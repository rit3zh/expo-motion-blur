package expo.modules.motionblurview.models

import kotlin.math.hypot

internal data class Point(val x: Double, val y: Double) {
  val length: Double
    get() = hypot(x, y)

  companion object {
    val ZERO = Point(0.0, 0.0)
  }
}
