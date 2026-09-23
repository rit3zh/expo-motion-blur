import type { GlassStyle } from 'expo-glass-effect';
import type { ReactNode } from 'react';
import type { ColorValue, StyleProp, ViewStyle } from 'react-native';

interface IGlassSurfaceProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  fallbackStyle?: StyleProp<ViewStyle>;
  glassEffectStyle?: GlassStyle;
  tintColor?: ColorValue;
  isInteractive?: boolean;
}

export type { IGlassSurfaceProps };
