import type { Ref } from 'react';
import type { View, ViewProps } from 'react-native';

/**
 * Blurs its children along their on-screen motion.
 *
 * Android needs Android 12 (API 31) or later and renders the children without blur on older
 * versions. Android 13 (API 33) and later run the same per-pixel shader as iOS. Android 12 blurs the
 * whole view along the direction its center moves, so views that spin or scale blur less.
 */
interface IMotionBlurViewProps extends ViewProps {
  /**
   * Longest blur, in points, from the content to either end of the streak.
   * Reached when the view moves at `speedForMaxBlur`.
   * @default 40
   */
  intensity?: number;
  /**
   * On-screen speed, in points per second, at which the blur reaches `intensity`.
   * Lower values make slower motion blurrier.
   * @default 1500
   */
  speedForMaxBlur?: number;
  /**
   * Maximum texture reads per pixel, from 4 to 64. The blur runs in two passes, so a pixel's streak
   * is built from up to `(samples / 2)²` taps. Higher values smooth very long streaks and cost more
   * GPU time. Slow motion uses fewer reads automatically. Has no effect on Android 12.
   * @default 32
   */
  samples?: number;
  /**
   * Turns the effect off. The children then render like in a plain `View`.
   * @default true
   */
  enabled?: boolean;
  /**
   * Re-captures the children on every blurred frame instead of once when the motion starts.
   * Only needed when the children change on their own while the view is moving, like a video or a
   * ticking counter. Android always shows the children's current state, so it ignores this prop.
   * @default false
   */
  live?: boolean;
  ref?: Ref<View>;
}

export type { IMotionBlurViewProps };
