import { GlassView } from 'expo-glass-effect';
import * as React from 'react';
import { memo } from 'react';
import { View } from 'react-native';

import { COMPONENT_NAMES, GLASS } from '../constants';
import type { IGlassSurfaceProps } from '../interfaces';
import { isGlassSupported } from '../utils';

const GlassSurfaceBase: React.FC<IGlassSurfaceProps> = ({
  children,
  style,
  fallbackStyle,
  glassEffectStyle = GLASS.EFFECT_STYLE,
  tintColor,
  isInteractive = false,
}: IGlassSurfaceProps): React.JSX.Element => {
  if (!isGlassSupported()) {
    return <View style={[style, fallbackStyle]}>{children}</View>;
  }

  return (
    <GlassView
      glassEffectStyle={glassEffectStyle}
      tintColor={tintColor}
      isInteractive={isInteractive}
      colorScheme={GLASS.COLOR_SCHEME}
      style={style}>
      {children}
    </GlassView>
  );
};

GlassSurfaceBase.displayName = `${COMPONENT_NAMES.GLASS_SURFACE}Base`;

const GlassSurface: React.NamedExoticComponent<IGlassSurfaceProps> =
  memo<IGlassSurfaceProps>(GlassSurfaceBase);

GlassSurface.displayName = COMPONENT_NAMES.GLASS_SURFACE;

export { GlassSurface };
