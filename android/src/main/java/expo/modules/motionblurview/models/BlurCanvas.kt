package expo.modules.motionblurview.models

import kotlin.math.ceil
import kotlin.math.max
import kotlin.math.roundToInt

internal data class BlurCanvas(val bounds: Bounds, val frame: Bounds, val scale: Double) {
  val contentOriginX: Int
    get() = ((bounds.left - frame.left) * scale).roundToInt()

  val contentOriginY: Int
    get() = ((bounds.top - frame.top) * scale).roundToInt()

  val pixelWidth: Int
    get() = (frame.width * scale).roundToInt()

  val pixelHeight: Int
    get() = (frame.height * scale).roundToInt()

  val isRenderable: Boolean
    get() = bounds.width > 0 && bounds.height > 0 &&
      pixelWidth <= MAX_PIXEL_DIMENSION && pixelHeight <= MAX_PIXEL_DIMENSION

  companion object {
    const val MAX_PIXEL_DIMENSION = 8192

    fun make(bounds: Bounds, inkRect: Bounds, intensity: Double, scale: Double, streakReach: Double): BlurCanvas {
      val streakRoom = ceil(max(intensity, 0.0) * scale * streakReach) + 2
      fun margin(ink: Double): Double = (ceil(max(ink, 0.0) * scale) + streakRoom) / scale

      val left = margin(bounds.left - inkRect.left)
      val top = margin(bounds.top - inkRect.top)
      val right = margin(inkRect.right - bounds.right)
      val bottom = margin(inkRect.bottom - bounds.bottom)
      return BlurCanvas(
        bounds = bounds,
        frame = Bounds(bounds.left - left, bounds.top - top, bounds.right + right, bounds.bottom + bottom),
        scale = scale
      )
    }
  }
}
