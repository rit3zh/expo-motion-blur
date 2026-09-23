package expo.modules.motionblurview.shaders

import android.graphics.RuntimeShader
import android.os.Build
import androidx.annotation.RequiresApi

internal object MotionBlurShader {
  const val CONTENT = "content"
  const val DISPLACEMENT_COLUMN_X = "displacementColumnX"
  const val DISPLACEMENT_COLUMN_Y = "displacementColumnY"
  const val DISPLACEMENT_OFFSET = "displacementOffset"
  const val MAX_DISPLACEMENT = "maxDisplacement"
  const val TAP_SCALE = "tapScale"
  const val TAP_COUNT = "tapCount"
  const val FEATHERED = "feathered"

  const val MAX_TAP_COUNT = 32

  private val SOURCE = """
    uniform shader $CONTENT;
    uniform float2 $DISPLACEMENT_COLUMN_X;
    uniform float2 $DISPLACEMENT_COLUMN_Y;
    uniform float2 $DISPLACEMENT_OFFSET;
    uniform float $MAX_DISPLACEMENT;
    uniform float $TAP_SCALE;
    uniform float $TAP_COUNT;
    uniform float $FEATHERED;

    float softLimit(float x) {
      float e = exp(-2.0 * x);
      return (1.0 - e) / (1.0 + e);
    }

    float2 halfStreak(float2 pixel) {
      float2 displacement = $DISPLACEMENT_COLUMN_X * pixel.x
                          + $DISPLACEMENT_COLUMN_Y * pixel.y
                          + $DISPLACEMENT_OFFSET;
      float magnitude = length(displacement);
      if (magnitude < 1e-4) {
        return float2(0.0);
      }
      const float knee = 0.6;
      float ratio = magnitude / $MAX_DISPLACEMENT;
      float eased = ratio <= knee ? ratio : knee + (1.0 - knee) * softLimit((ratio - knee) / (1.0 - knee));
      return displacement * (eased * $MAX_DISPLACEMENT / magnitude);
    }

    float shutterWeight(float position) {
      return 1.0 - smoothstep(0.35, 1.0, abs(position));
    }

    half4 main(float2 pixel) {
      float2 reach = halfStreak(pixel) * $TAP_SCALE;
      if (length(reach) < 0.05) {
        return $CONTENT.eval(pixel);
      }
      float stepSize = 2.0 / $TAP_COUNT;
      float4 accumulated = float4(0.0);
      float totalWeight = 0.0;
      for (int index = 0; index < $MAX_TAP_COUNT; index++) {
        if (float(index) >= $TAP_COUNT) {
          break;
        }
        float position = -1.0 + stepSize * (float(index) + 0.5);
        float weight = $FEATHERED > 0.5 ? shutterWeight(position) : 1.0;
        accumulated += float4($CONTENT.eval(pixel + reach * position)) * weight;
        totalWeight += weight;
      }
      return half4(accumulated / totalWeight);
    }
  """.trimIndent()

  @get:RequiresApi(Build.VERSION_CODES.TIRAMISU)
  val finePass: RuntimeShader by lazy { RuntimeShader(SOURCE) }

  @get:RequiresApi(Build.VERSION_CODES.TIRAMISU)
  val coarsePass: RuntimeShader by lazy { RuntimeShader(SOURCE) }
}
