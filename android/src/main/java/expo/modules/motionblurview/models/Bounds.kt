package expo.modules.motionblurview.models

import kotlin.math.max
import kotlin.math.min

internal data class Bounds(val left: Double, val top: Double, val right: Double, val bottom: Double) {
  val width: Double
    get() = right - left

  val height: Double
    get() = bottom - top

  val corners: List<Point>
    get() = listOf(Point(left, top), Point(right, top), Point(left, bottom), Point(right, bottom))

  fun union(other: Bounds): Bounds =
    Bounds(min(left, other.left), min(top, other.top), max(right, other.right), max(bottom, other.bottom))

  fun intersection(other: Bounds): Bounds =
    Bounds(max(left, other.left), max(top, other.top), min(right, other.right), min(bottom, other.bottom))

  fun intersects(other: Bounds): Boolean =
    left < other.right && other.left < right && top < other.bottom && other.top < bottom

  fun insetBy(dx: Double, dy: Double): Bounds = Bounds(left + dx, top + dy, right - dx, bottom - dy)

  companion object {
    fun enclosing(points: List<Point>): Bounds =
      Bounds(points.minOf { it.x }, points.minOf { it.y }, points.maxOf { it.x }, points.maxOf { it.y })
  }
}
