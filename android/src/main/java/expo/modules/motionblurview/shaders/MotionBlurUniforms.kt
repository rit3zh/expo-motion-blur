package expo.modules.motionblurview.shaders

import android.graphics.RuntimeShader
import android.os.Build
import androidx.annotation.RequiresApi
import expo.modules.motionblurview.models.BlurCanvas
import expo.modules.motionblurview.models.MotionBlurConfiguration
import expo.modules.motionblurview.models.Point
import expo.modules.motionblurview.models.VelocityField
import kotlin.math.ceil
import kotlin.math.max
import kotlin.math.min
import kotlin.math.sqrt
import kotlin.math.tanh

internal enum class MotionBlurPass {
  FINE,
  COARSE
}

internal class MotionBlurUniforms(
  val displacementColumnX: Point,
  val displacementColumnY: Point,
  val displacementOffset: Point,
  val maxDisplacement: Double,
  val tapScale: Double,
  val tapCount: Int,
  val feathered: Boolean
) {
  fun halfStreak(pixel: Point): Point {
    val x = displacementColumnX.x * pixel.x + displacementColumnY.x * pixel.y + displacementOffset.x
    val y = displacementColumnX.y * pixel.x + displacementColumnY.y * pixel.y + displacementOffset.y
    val magnitude = Point(x, y).length
    if (magnitude < 1e-4) {
      return Point.ZERO
    }
    val ratio = magnitude / maxDisplacement
    val eased = if (ratio <= KNEE) ratio else KNEE + (1 - KNEE) * tanh((ratio - KNEE) / (1 - KNEE))
    val factor = eased * maxDisplacement / magnitude
    return Point(x * factor, y * factor)
  }

  @RequiresApi(Build.VERSION_CODES.TIRAMISU)
  fun applyTo(shader: RuntimeShader) {
    shader.setFloatUniform(MotionBlurShader.DISPLACEMENT_COLUMN_X, displacementColumnX.x.toFloat(), displacementColumnX.y.toFloat())
    shader.setFloatUniform(MotionBlurShader.DISPLACEMENT_COLUMN_Y, displacementColumnY.x.toFloat(), displacementColumnY.y.toFloat())
    shader.setFloatUniform(MotionBlurShader.DISPLACEMENT_OFFSET, displacementOffset.x.toFloat(), displacementOffset.y.toFloat())
    shader.setFloatUniform(MotionBlurShader.MAX_DISPLACEMENT, maxDisplacement.toFloat())
    shader.setFloatUniform(MotionBlurShader.TAP_SCALE, tapScale.toFloat())
    shader.setFloatUniform(MotionBlurShader.TAP_COUNT, tapCount.toFloat())
    shader.setFloatUniform(MotionBlurShader.FEATHERED, if (feathered) 1f else 0f)
  }

  companion object {
    private const val TAP_SPACING = 1.0
    private const val KNEE = 0.6

    fun make(
      velocity: VelocityField,
      canvas: BlurCanvas,
      configuration: MotionBlurConfiguration,
      pass: MotionBlurPass,
      tapCount: Int
    ): MotionBlurUniforms {
      val exposure = configuration.exposure
      val scale = canvas.scale
      val field = velocity.map
      val originX = canvas.frame.left
      val originY = canvas.frame.top

      return MotionBlurUniforms(
        displacementColumnX = Point(field.a * exposure, field.b * exposure),
        displacementColumnY = Point(field.c * exposure, field.d * exposure),
        displacementOffset = Point(
          scale * exposure * (field.a * originX + field.c * originY + field.tx),
          scale * exposure * (field.b * originX + field.d * originY + field.ty)
        ),
        maxDisplacement = max(configuration.intensity * scale, 1.0),
        tapScale = if (pass == MotionBlurPass.FINE) 1.0 / tapCount else 1.0,
        tapCount = tapCount,
        feathered = pass == MotionBlurPass.COARSE
      )
    }

    fun tapCount(halfStreakPixels: Double, maxSampleCount: Int): Int {
      val needed = ceil(sqrt(2 * halfStreakPixels / TAP_SPACING)).toInt()
      val limit = min(max(maxSampleCount / 2, 2), MotionBlurShader.MAX_TAP_COUNT)
      return min(max(needed, 2), limit)
    }
  }
}
