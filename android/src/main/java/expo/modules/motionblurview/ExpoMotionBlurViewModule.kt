package expo.modules.motionblurview

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.motionblurview.models.MotionBlurConfiguration
import expo.modules.motionblurview.views.MotionBlurView
import kotlin.math.max

class ExpoMotionBlurViewModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoMotionBlurView")

    View(MotionBlurView::class) {
      val defaults = MotionBlurConfiguration.DEFAULT

      Prop("intensity") { view: MotionBlurView, value: Double? ->
        view.configuration = view.configuration.copy(intensity = max(0.0, value ?: defaults.intensity))
      }

      Prop("speedForMaxBlur") { view: MotionBlurView, value: Double? ->
        view.configuration = view.configuration.copy(speedForMaxBlur = max(1.0, value ?: defaults.speedForMaxBlur))
      }

      Prop("samples") { view: MotionBlurView, value: Int? ->
        val samples = (value ?: defaults.maxSampleCount).coerceIn(MotionBlurConfiguration.SAMPLE_COUNT_RANGE)
        view.configuration = view.configuration.copy(maxSampleCount = samples)
      }

      Prop("enabled") { view: MotionBlurView, value: Boolean? ->
        view.configuration = view.configuration.copy(isEnabled = value ?: defaults.isEnabled)
      }

      Prop("live") { _: MotionBlurView, _: Boolean? -> }

      OnViewDidUpdateProps { view: MotionBlurView ->
        view.propsDidUpdate()
      }
    }
  }
}
