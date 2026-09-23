package expo.modules.motionblurview.models

internal data class VelocityField(val map: AffineMap) {
  fun maxSpeed(rect: Bounds): Double = map.maxMagnitude(rect)

  fun interpolated(target: VelocityField, amount: Double): VelocityField =
    VelocityField(map.interpolated(target.map, amount))

  companion object {
    val ZERO = VelocityField(AffineMap.ZERO)
  }
}
