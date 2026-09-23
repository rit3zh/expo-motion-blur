package expo.modules.motionblurview.motion

import expo.modules.motionblurview.models.AffineMap
import expo.modules.motionblurview.models.Bounds
import expo.modules.motionblurview.models.MotionSample
import expo.modules.motionblurview.models.VelocityField
import kotlin.math.exp

internal class MotionTracker {
  var velocity: VelocityField = VelocityField.ZERO
    private set

  var isMoving = false
    private set

  private val samples = ArrayList<MotionSample>()
  private var windowSpeed = 0.0

  fun reset() {
    samples.clear()
    velocity = VelocityField.ZERO
    windowSpeed = 0.0
    isMoving = false
  }

  fun update(frame: AffineMap, bounds: Bounds, timestamp: Double) {
    val sample = MotionSample(timestamp, frame)
    val previous = samples.lastOrNull()
    if (previous == null) {
      samples.add(sample)
      return
    }
    val elapsed = timestamp - previous.timestamp
    if (elapsed <= 0) {
      return
    }
    if (elapsed > MAX_SAMPLE_GAP) {
      restart(sample)
      return
    }
    val jump = (frame - previous.frame).maxMagnitude(bounds)
    if (jump > JUMP_TOLERANCE + JUMP_SPEED_FACTOR * windowSpeed * elapsed) {
      restart(sample)
      isMoving = true
      return
    }
    samples.add(sample)
    trimHistory(timestamp)
    val frameVelocity = fittedFrameVelocity()
    windowSpeed = frameVelocity.maxMagnitude(bounds)
    val inverse = frame.linearInverse()
    if (inverse == null) {
      velocity = VelocityField.ZERO
      isMoving = false
      return
    }
    val rawVelocity = VelocityField(inverse.linearlyTransforming(frameVelocity))
    val isSpeedingUp = rawVelocity.maxSpeed(bounds) > velocity.maxSpeed(bounds)
    val timeConstant = if (isSpeedingUp) ATTACK_TIME_CONSTANT else RELEASE_TIME_CONSTANT
    velocity = velocity.interpolated(rawVelocity, 1 - exp(-elapsed / timeConstant))
    isMoving = windowSpeed > RESTING_SPEED || velocity.maxSpeed(bounds) > RESTING_SPEED
  }

  private fun restart(sample: MotionSample) {
    reset()
    samples.add(sample)
  }

  private fun trimHistory(timestamp: Double) {
    while (samples.size > 2 && timestamp - samples[0].timestamp > FIT_WINDOW + 0.001) {
      samples.removeAt(0)
    }
  }

  private fun fittedFrameVelocity(): AffineMap {
    val origin = samples[samples.size - 1].timestamp
    val count = samples.size.toDouble()
    var meanTime = 0.0
    var meanFrame = AffineMap.ZERO
    for (sample in samples) {
      meanTime += sample.timestamp - origin
      meanFrame += sample.frame
    }
    meanTime /= count
    meanFrame *= 1 / count
    var covariance = AffineMap.ZERO
    var variance = 0.0
    for (sample in samples) {
      val offset = sample.timestamp - origin - meanTime
      covariance += (sample.frame - meanFrame) * offset
      variance += offset * offset
    }
    return if (variance > 0) covariance * (1 / variance) else AffineMap.ZERO
  }

  private companion object {
    const val FIT_WINDOW = 1.0 / 30.0
    const val ATTACK_TIME_CONSTANT = 0.012
    const val RELEASE_TIME_CONSTANT = 0.05
    const val MAX_SAMPLE_GAP = 0.1
    const val JUMP_TOLERANCE = 32.0
    const val JUMP_SPEED_FACTOR = 3.0
    const val RESTING_SPEED = 2.0
  }
}
