package expo.modules.motionblurview.rendering

import android.graphics.Canvas
import android.graphics.RecordingCanvas
import android.graphics.RenderEffect
import android.graphics.RenderNode
import android.os.Build
import androidx.annotation.RequiresApi
import expo.modules.motionblurview.models.BlurCanvas
import expo.modules.motionblurview.models.MotionBlurConfiguration
import expo.modules.motionblurview.models.VelocityField
import expo.modules.motionblurview.shaders.MotionBlurPass
import expo.modules.motionblurview.shaders.MotionBlurShader
import expo.modules.motionblurview.shaders.MotionBlurUniforms

@RequiresApi(Build.VERSION_CODES.TIRAMISU)
internal class ShaderMotionBlurRenderer : MotionBlurRenderer {
  private val content = RenderNode("MotionBlurContent")

  init {
    MotionBlurShader.finePass
    MotionBlurShader.coarsePass
  }

  override fun draw(
    target: RecordingCanvas,
    canvas: BlurCanvas,
    velocity: VelocityField,
    halfStreakPixels: Double,
    configuration: MotionBlurConfiguration,
    drawContent: (Canvas) -> Unit
  ): Boolean {
    content.recordContent(canvas, drawContent)

    val tapCount = MotionBlurUniforms.tapCount(halfStreakPixels, configuration.maxSampleCount)
    fun effect(pass: MotionBlurPass): RenderEffect {
      val shader = if (pass == MotionBlurPass.FINE) MotionBlurShader.finePass else MotionBlurShader.coarsePass
      MotionBlurUniforms.make(velocity, canvas, configuration, pass, tapCount).applyTo(shader)
      return RenderEffect.createRuntimeShaderEffect(shader, MotionBlurShader.CONTENT)
    }
    content.setRenderEffect(RenderEffect.createChainEffect(effect(MotionBlurPass.COARSE), effect(MotionBlurPass.FINE)))
    target.drawCanvasNode(content, canvas)
    return true
  }

  override fun release() {
    content.setRenderEffect(null)
    content.discardDisplayList()
  }
}
