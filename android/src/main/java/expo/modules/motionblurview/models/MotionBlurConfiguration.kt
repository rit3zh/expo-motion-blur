package expo.modules.motionblurview.models

internal data class MotionBlurConfiguration(
  val intensity: Double = 40.0,
  val speedForMaxBlur: Double = 1500.0,
  val maxSampleCount: Int = 32,
  val isEnabled: Boolean = true
) {
  val exposure: Double
    get() = if (speedForMaxBlur > 0) intensity / speedForMaxBlur else 0.0

  companion object {
    val DEFAULT = MotionBlurConfiguration()
    val SAMPLE_COUNT_RANGE = 4..64
  }
}
