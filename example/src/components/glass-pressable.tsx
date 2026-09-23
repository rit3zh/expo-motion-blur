import * as React from 'react';
import { memo, useCallback, useMemo } from 'react';
import {
  Pressable,
  StyleSheet,
  type PressableStateCallbackType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { COMPONENT_NAMES, GLASS } from '../constants';
import type { IGlassPressableProps } from '../interfaces';
import { isGlassSupported } from '../utils';
import { GlassSurface } from './glass-surface';

const GlassPressableBase: React.FC<IGlassPressableProps> = ({
  children,
  style,
  fallbackStyle,
  glassEffectStyle = GLASS.EFFECT_STYLE,
  tintColor,
  isInteractive = true,
  ...pressableProps
}: IGlassPressableProps): React.JSX.Element => {
  const needsPressFeedback = !isGlassSupported() || glassEffectStyle === 'none';

  const overlayRadiusStyle = useMemo<ViewStyle>(
    () => ({ borderRadius: StyleSheet.flatten(style)?.borderRadius }),
    [style]
  );

  const getOverlayStyle = useCallback(
    ({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> => [
      StyleSheet.absoluteFill,
      overlayRadiusStyle,
      needsPressFeedback && pressed && styles.pressed,
    ],
    [needsPressFeedback, overlayRadiusStyle]
  );

  return (
    <GlassSurface
      glassEffectStyle={glassEffectStyle}
      tintColor={tintColor}
      isInteractive={isInteractive}
      style={style}
      fallbackStyle={fallbackStyle}>
      {children}
      <Pressable {...pressableProps} style={getOverlayStyle} />
    </GlassSurface>
  );
};

GlassPressableBase.displayName = `${COMPONENT_NAMES.GLASS_PRESSABLE}Base`;

const GlassPressable: React.NamedExoticComponent<IGlassPressableProps> =
  memo<IGlassPressableProps>(GlassPressableBase);

GlassPressable.displayName = COMPONENT_NAMES.GLASS_PRESSABLE;

export { GlassPressable };

const styles = StyleSheet.create({
  pressed: {
    backgroundColor: GLASS.FALLBACK_PRESSED_COLOR,
  },
});
