package expo.modules.motionblurview.rendering

import android.graphics.Canvas
import android.graphics.RecordingCanvas
import android.graphics.RenderEffect
import android.graphics.RenderNode
import android.graphics.Shader
import android.os.Build
import androidx.annotation.RequiresApi
import expo.modules.motionblurview.models.BlurCanvas
import expo.modules.motionblurview.models.MotionBlurConfiguration
import expo.modules.motionblurview.models.Point
import expo.modules.motionblurview.models.VelocityField
import expo.modules.motionblurview.shaders.MotionBlurPass
import expo.modules.motionblurview.shaders.MotionBlurUniforms
import kotlin.math.abs
import kotlin.math.atan2
import kotlin.math.ceil
import kotlin.math.cos
import kotlin.math.max
import kotlin.math.sin

@RequiresApi(Build.VERSION_CODES.S)
internal class DirectionalMotionBlurRenderer : MotionBlurRenderer {
  private val content = RenderNode("MotionBlurContent")
  private val streak = RenderNode("MotionBlurStreak")

  override fun draw(
    target: RecordingCanvas,
    canvas: BlurCanvas,
    velocity: VelocityField,
    halfStreakPixels: Double,
    configuration: MotionBlurConfiguration,
    drawContent: (Canvas) -> Unit
  ): Boolean {
    val uniforms = MotionBlurUniforms.make(velocity, canvas, configuration, MotionBlurPass.COARSE, 1)
    val center = Point(
      canvas.contentOriginX + canvas.bounds.width * canvas.scale / 2,
      canvas.contentOriginY + canvas.bounds.height * canvas.scale / 2
    )
    val reach = uniforms.halfStreak(center)
    val radius = blurRadius(reach.length)
    val degrees = Math.toDegrees(atan2(reach.y, reach.x)).mod(180.0)
    val axisDistance = minOf(degrees, abs(degrees - 90), 180 - degrees)

    if (radius < MIN_RADIUS) {
      content.recordContent(canvas, drawContent)
      content.setRenderEffect(null)
      target.drawCanvasNode(content, canvas)
      return true
    }
    if (axisDistance < AXIS_SNAP_DEGREES) {
      val isHorizontal = abs(degrees - 90) > 45
      content.recordContent(canvas, drawContent)
      content.setRenderEffect(
        if (isHorizontal) blurEffect(radius, 0f) else blurEffect(0f, radius)
      )
      target.drawCanvasNode(content, canvas)
      return true
    }

    val width = canvas.pixelWidth.toFloat()
    val height = canvas.pixelHeight.toFloat()
    val angle = Math.toRadians(degrees)
    val rotatedWidth = ceil(width * abs(cos(angle)) + height * abs(sin(angle))).toInt()
    val rotatedHeight = ceil(width * abs(sin(angle)) + height * abs(cos(angle))).toInt()
    if (rotatedWidth > BlurCanvas.MAX_PIXEL_DIMENSION || rotatedHeight > BlurCanvas.MAX_PIXEL_DIMENSION) {
      return false
    }

    content.recordContent(canvas, drawContent)
    content.setRenderEffect(null)

    streak.setPosition(0, 0, rotatedWidth, rotatedHeight)
    val recording = streak.beginRecording(rotatedWidth, rotatedHeight)
    try {
      recording.translate(rotatedWidth / 2f, rotatedHeight / 2f)
      recording.rotate(-degrees.toFloat())
      recording.translate(-width / 2, -height / 2)
      recording.drawRenderNode(content)
    } finally {
      streak.endRecording()
    }
    streak.setRenderEffect(blurEffect(radius, 0f))

    val checkpoint = target.save()
    target.translate(width / 2 - canvas.contentOriginX, height / 2 - canvas.contentOriginY)
    target.rotate(degrees.toFloat())
    target.translate(-rotatedWidth / 2f, -rotatedHeight / 2f)
    target.drawRenderNode(streak)
    target.restoreToCount(checkpoint)
    return true
  }

  override fun release() {
    content.setRenderEffect(null)
    content.discardDisplayList()
    streak.setRenderEffect(null)
    streak.discardDisplayList()
  }

  private fun blurEffect(radiusX: Float, radiusY: Float): RenderEffect =
    RenderEffect.createBlurEffect(radiusX, radiusY, Shader.TileMode.DECAL)

  companion object {
    private const val SHUTTER_SIGMA = 0.416

    const val STREAK_REACH = 3 * SHUTTER_SIGMA

    private const val MIN_RADIUS = 0.5f
    private const val AXIS_SNAP_DEGREES = 0.5

    private fun blurRadius(halfStreak: Double): Float {
      val sigma = SHUTTER_SIGMA * halfStreak
      return max((sigma - 0.5) / 0.57735, 0.0).toFloat()
    }
  }
}
