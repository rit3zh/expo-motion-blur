package expo.modules.motionblurview.views

import android.content.Context
import android.graphics.Canvas
import android.graphics.Matrix
import android.graphics.RecordingCanvas
import android.graphics.RectF
import android.os.Build
import android.util.Log
import android.view.View
import android.view.ViewTreeObserver
import android.view.animation.AnimationUtils
import androidx.annotation.RequiresApi
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.views.ExpoView
import expo.modules.motionblurview.models.AffineMap
import expo.modules.motionblurview.models.BlurCanvas
import expo.modules.motionblurview.models.Bounds
import expo.modules.motionblurview.models.MotionBlurConfiguration
import expo.modules.motionblurview.models.Point
import expo.modules.motionblurview.motion.MotionTracker
import expo.modules.motionblurview.rendering.MotionBlurRenderer
import kotlin.math.max
import kotlin.math.min

class MotionBlurView(context: Context, appContext: AppContext) :
  ExpoView(context, appContext), ViewTreeObserver.OnPreDrawListener {

  internal var configuration = MotionBlurConfiguration.DEFAULT
    set(value) {
      val oldValue = field
      field = value
      configurationDidChange(oldValue)
    }

  private val tracker = MotionTracker()
  private val globalMatrix = Matrix()
  private val points = FloatArray(6)
  private val childRect = RectF()
  private var renderer: MotionBlurRenderer? = null
  private var blurCanvas: BlurCanvas? = null
  private var halfStreakPixels = 0.0
  private var isBlurVisible = false
  private var registeredObserver: ViewTreeObserver? = null

  private val density: Double
    get() = resources.displayMetrics.density.toDouble()

  init {
    clipChildren = false
    clipToPadding = false
    setWillNotDraw(false)
  }

  override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
    setMeasuredDimension(MeasureSpec.getSize(widthMeasureSpec), MeasureSpec.getSize(heightMeasureSpec))
  }

  override fun onLayout(changed: Boolean, l: Int, t: Int, r: Int, b: Int) = Unit

  override fun onAttachedToWindow() {
    super.onAttachedToWindow()
    updateRegistration(isAttached = true)
  }

  override fun onDetachedFromWindow() {
    updateRegistration(isAttached = false)
    super.onDetachedFromWindow()
  }

  fun propsDidUpdate() {
    invalidate()
  }

  override fun onPreDraw(): Boolean {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
      tick()
    }
    return true
  }

  override fun draw(canvas: Canvas) {
    if (isBlurVisible && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S && drawBlur(canvas)) {
      return
    }
    super.draw(canvas)
  }

  @RequiresApi(Build.VERSION_CODES.S)
  private fun tick() {
    val frame = if (isShown) currentWindowFrame() else null
    if (frame == null) {
      tracker.reset()
      setBlurVisible(false)
      return
    }
    val bounds = contentBounds()
    val timestamp = AnimationUtils.currentAnimationTimeMillis() / 1000.0
    tracker.update(frame, bounds, timestamp)

    val halfStreak = min(tracker.velocity.maxSpeed(bounds) * configuration.exposure, configuration.intensity)
    halfStreakPixels = halfStreak * density
    val threshold = if (isBlurVisible) HIDE_THRESHOLD else SHOW_THRESHOLD
    val canvas = updateCanvas()
    val wantsBlur = halfStreakPixels > threshold && alpha > 0.01f && canvas != null && isOnScreen(frame, canvas)
    setBlurVisible(wantsBlur)

    if (isBlurVisible) {
      invalidate()
    }
    if (isBlurVisible || tracker.isMoving) {
      postInvalidateOnAnimation()
    }
  }

  @RequiresApi(Build.VERSION_CODES.S)
  private fun drawBlur(target: Canvas): Boolean {
    val recording = target as? RecordingCanvas ?: return false
    val canvas = blurCanvas?.takeIf { it.isRenderable } ?: return false
    val renderer = renderer ?: MotionBlurRenderer.create()?.also { renderer = it } ?: return false
    return renderer.draw(recording, canvas, tracker.velocity, halfStreakPixels, configuration) { contentCanvas ->
      super.draw(contentCanvas)
    }
  }

  private fun setBlurVisible(visible: Boolean) {
    if (visible == isBlurVisible) {
      return
    }
    isBlurVisible = visible
    if (!visible) {
      renderer?.release()
    }
    invalidate()
  }

  private fun contentBounds(): Bounds = Bounds(0.0, 0.0, width / density, height / density)

  @RequiresApi(Build.VERSION_CODES.Q)
  private fun currentWindowFrame(): AffineMap? {
    if (!isAttachedToWindow || width <= 0 || height <= 0) {
      return null
    }
    globalMatrix.reset()
    transformMatrixToGlobal(globalMatrix)
    points[0] = 0f
    points[1] = 0f
    points[2] = width.toFloat()
    points[3] = 0f
    points[4] = 0f
    points[5] = height.toFloat()
    globalMatrix.mapPoints(points)
    val density = density
    return AffineMap.mapping(
      contentBounds(),
      topLeft = Point(points[0] / density, points[1] / density),
      topRight = Point(points[2] / density, points[3] / density),
      bottomLeft = Point(points[4] / density, points[5] / density)
    )
  }

  @RequiresApi(Build.VERSION_CODES.Q)
  private fun isOnScreen(frame: AffineMap, canvas: BlurCanvas): Boolean {
    val root = rootView
    globalMatrix.reset()
    root.transformMatrixToGlobal(globalMatrix)
    points[0] = 0f
    points[1] = 0f
    points[2] = root.width.toFloat()
    points[3] = root.height.toFloat()
    globalMatrix.mapPoints(points, 0, points, 0, 2)
    val density = density
    val window = Bounds(points[0] / density, points[1] / density, points[2] / density, points[3] / density)
    return Bounds.enclosing(canvas.frame.corners.map(frame::apply)).intersects(window)
  }

  private fun contentInkRect(bounds: Bounds): Bounds {
    val density = density
    var ink = bounds
    for (index in 0 until childCount) {
      val child = getChildAt(index)
      if (child.visibility != View.VISIBLE || child.alpha <= 0f) {
        continue
      }
      childRect.set(0f, 0f, child.width.toFloat(), child.height.toFloat())
      child.matrix.mapRect(childRect)
      childRect.offset(child.left.toFloat(), child.top.toFloat())
      val shadow = max(child.z, 0f) * SHADOW_SPREAD_PER_ELEVATION
      childRect.inset(-shadow, -shadow)
      ink = ink.union(
        Bounds(
          childRect.left / density,
          childRect.top / density,
          childRect.right / density,
          childRect.bottom / density
        )
      )
    }
    return ink.intersection(bounds.insetBy(-MAX_INK_OVERFLOW, -MAX_INK_OVERFLOW))
  }

  private fun updateCanvas(): BlurCanvas? {
    val bounds = contentBounds()
    val canvas = BlurCanvas.make(
      bounds = bounds,
      inkRect = contentInkRect(bounds),
      intensity = configuration.intensity,
      scale = density,
      streakReach = MotionBlurRenderer.streakReach
    )
    blurCanvas = canvas
    return canvas.takeIf { it.isRenderable }
  }

  private fun configurationDidChange(oldValue: MotionBlurConfiguration) {
    if (configuration.isEnabled != oldValue.isEnabled) {
      updateRegistration(isAttachedToWindow)
    }
  }

  private fun updateRegistration(isAttached: Boolean) {
    val shouldRun = isAttached && configuration.isEnabled && MotionBlurRenderer.isSupported
    if (shouldRun == (registeredObserver != null)) {
      return
    }
    if (shouldRun) {
      val observer = viewTreeObserver
      observer.addOnPreDrawListener(this)
      registeredObserver = observer
      if (renderer == null) {
        renderer = MotionBlurRenderer.create()
      }
    } else {
      val observer = registeredObserver?.takeIf { it.isAlive } ?: viewTreeObserver
      observer.removeOnPreDrawListener(this)
      registeredObserver = null
      tracker.reset()
      setBlurVisible(false)
      renderer?.release()
      renderer = null
    }
    if (isAttached && configuration.isEnabled && !MotionBlurRenderer.isSupported && !didWarnUnsupported) {
      didWarnUnsupported = true
      Log.i(TAG, "Motion blur requires Android 12 (API 31). The children render without blur on API ${Build.VERSION.SDK_INT}.")
    }
  }

  private companion object {
    const val TAG = "ExpoMotionBlur"
    const val SHOW_THRESHOLD = 1.0
    const val HIDE_THRESHOLD = 0.5
    const val MAX_INK_OVERFLOW = 96.0
    const val SHADOW_SPREAD_PER_ELEVATION = 2f
    var didWarnUnsupported = false
  }
}
