package expo.modules.motionblurview.models

import kotlin.math.abs
import kotlin.math.hypot
import kotlin.math.max

internal data class AffineMap(
  val a: Double,
  val b: Double,
  val c: Double,
  val d: Double,
  val tx: Double,
  val ty: Double
) {
  val determinant: Double
    get() = a * d - b * c

  fun apply(point: Point): Point = Point(a * point.x + c * point.y + tx, b * point.x + d * point.y + ty)

  fun linearInverse(): AffineMap? {
    val determinant = determinant
    if (abs(determinant) <= 1e-9) {
      return null
    }
    return AffineMap(d / determinant, -b / determinant, -c / determinant, a / determinant, 0.0, 0.0)
  }

  fun linearlyTransforming(other: AffineMap): AffineMap =
    AffineMap(
      a = a * other.a + c * other.b,
      b = b * other.a + d * other.b,
      c = a * other.c + c * other.d,
      d = b * other.c + d * other.d,
      tx = a * other.tx + c * other.ty,
      ty = b * other.tx + d * other.ty
    )

  fun maxMagnitude(rect: Bounds): Double {
    fun magnitude(x: Double, y: Double): Double = hypot(a * x + c * y + tx, b * x + d * y + ty)
    return max(
      max(magnitude(rect.left, rect.top), magnitude(rect.right, rect.top)),
      max(magnitude(rect.left, rect.bottom), magnitude(rect.right, rect.bottom))
    )
  }

  fun interpolated(target: AffineMap, amount: Double): AffineMap = this + (target - this) * amount

  operator fun plus(other: AffineMap): AffineMap =
    AffineMap(a + other.a, b + other.b, c + other.c, d + other.d, tx + other.tx, ty + other.ty)

  operator fun minus(other: AffineMap): AffineMap =
    AffineMap(a - other.a, b - other.b, c - other.c, d - other.d, tx - other.tx, ty - other.ty)

  operator fun times(scalar: Double): AffineMap =
    AffineMap(a * scalar, b * scalar, c * scalar, d * scalar, tx * scalar, ty * scalar)

  companion object {
    val ZERO = AffineMap(0.0, 0.0, 0.0, 0.0, 0.0, 0.0)

    fun mapping(rect: Bounds, topLeft: Point, topRight: Point, bottomLeft: Point): AffineMap? {
      if (rect.width <= 0 || rect.height <= 0) {
        return null
      }
      val a = (topRight.x - topLeft.x) / rect.width
      val b = (topRight.y - topLeft.y) / rect.width
      val c = (bottomLeft.x - topLeft.x) / rect.height
      val d = (bottomLeft.y - topLeft.y) / rect.height
      return AffineMap(
        a = a,
        b = b,
        c = c,
        d = d,
        tx = topLeft.x - a * rect.left - c * rect.top,
        ty = topLeft.y - b * rect.left - d * rect.top
      )
    }
  }
}
