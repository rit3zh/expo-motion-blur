package expo.modules.motionblurview.rendering

import android.graphics.Canvas
import android.graphics.RecordingCanvas
import android.graphics.RenderNode
import android.os.Build
import androidx.annotation.RequiresApi
import expo.modules.motionblurview.models.BlurCanvas
import expo.modules.motionblurview.models.MotionBlurConfiguration
import expo.modules.motionblurview.models.VelocityField

@RequiresApi(Build.VERSION_CODES.S)
internal interface MotionBlurRenderer {
  fun draw(
    target: RecordingCanvas,
    canvas: BlurCanvas,
    velocity: VelocityField,
    halfStreakPixels: Double,
    configuration: MotionBlurConfiguration,
    drawContent: (Canvas) -> Unit
  ): Boolean

  fun release()

  companion object {
    val isSupported: Boolean
      get() = Build.VERSION.SDK_INT >= Build.VERSION_CODES.S

    val streakReach: Double
      get() = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) 1.0 else DirectionalMotionBlurRenderer.STREAK_REACH

    fun create(): MotionBlurRenderer? =
      when {
        Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU -> ShaderMotionBlurRenderer()
        Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> DirectionalMotionBlurRenderer()
        else -> null
      }
  }
}

@RequiresApi(Build.VERSION_CODES.S)
internal fun RenderNode.recordContent(canvas: BlurCanvas, drawContent: (Canvas) -> Unit) {
  setPosition(0, 0, canvas.pixelWidth, canvas.pixelHeight)
  val recording = beginRecording(canvas.pixelWidth, canvas.pixelHeight)
  try {
    recording.translate(canvas.contentOriginX.toFloat(), canvas.contentOriginY.toFloat())
    drawContent(recording)
  } finally {
    endRecording()
  }
}

@RequiresApi(Build.VERSION_CODES.S)
internal fun RecordingCanvas.drawCanvasNode(node: RenderNode, canvas: BlurCanvas) {
  val checkpoint = save()
  translate(-canvas.contentOriginX.toFloat(), -canvas.contentOriginY.toFloat())
  drawRenderNode(node)
  restoreToCount(checkpoint)
}
