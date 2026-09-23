//
//  MotionBlur.metal
//  Pods
//
//  Created by rit3zh CX on 9/23/26.
//

#include <metal_stdlib>
using namespace metal;

struct MotionBlurUniforms {
  float2 displacementColumnX;
  float2 displacementColumnY;
  float2 displacementOffset;
  float maxDisplacement;
  float tapScale;
  int tapCount;
  int feathered;
};

struct RasterizerData {
  float4 position [[position]];
};

vertex RasterizerData motionBlurVertex(uint vertexID [[vertex_id]]) {
  float2 corner = float2(float((vertexID << 1) & 2), float(vertexID & 2));
  RasterizerData out;
  out.position = float4(corner * 2.0 - 1.0, 0.0, 1.0);
  return out;
}

static float2 halfStreak(constant MotionBlurUniforms &uniforms, float2 pixel) {
  float2 displacement = uniforms.displacementColumnX * pixel.x
                      + uniforms.displacementColumnY * pixel.y
                      + uniforms.displacementOffset;
  float magnitude = length(displacement);
  if (magnitude < 1e-4) {
    return float2(0.0);
  }
  const float knee = 0.6;
  float ratio = magnitude / uniforms.maxDisplacement;
  float eased = ratio <= knee ? ratio : knee + (1.0 - knee) * tanh((ratio - knee) / (1.0 - knee));
  return displacement * (eased * uniforms.maxDisplacement / magnitude);
}

static float shutterWeight(float position) {
  return 1.0 - smoothstep(0.35, 1.0, abs(position));
}

fragment half4 motionBlurFragment(RasterizerData in [[stage_in]],
                                  constant MotionBlurUniforms &uniforms [[buffer(0)]],
                                  texture2d<float, access::sample> source [[texture(0)]]) {
  constexpr sampler sourceSampler(coord::pixel, address::clamp_to_zero, filter::linear);

  float2 pixel = in.position.xy;
  float2 reach = halfStreak(uniforms, pixel) * uniforms.tapScale;

  if (length(reach) < 0.05) {
    return half4(source.sample(sourceSampler, pixel));
  }

  float step = 2.0 / float(uniforms.tapCount);
  float4 accumulated = float4(0.0);
  float totalWeight = 0.0;
  for (int index = 0; index < uniforms.tapCount; index++) {
    float position = -1.0 + step * (float(index) + 0.5);
    float weight = uniforms.feathered != 0 ? shutterWeight(position) : 1.0;
    accumulated += source.sample(sourceSampler, pixel + reach * position) * weight;
    totalWeight += weight;
  }
  return half4(accumulated / totalWeight);
}
