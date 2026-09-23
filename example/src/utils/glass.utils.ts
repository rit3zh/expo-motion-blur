import { isGlassEffectAPIAvailable, isLiquidGlassAvailable } from 'expo-glass-effect';
import { Platform } from 'react-native';

const IS_GLASS_SUPPORTED: boolean =
  Platform.OS === 'ios' && isLiquidGlassAvailable() && isGlassEffectAPIAvailable();

const isGlassSupported = (): boolean => IS_GLASS_SUPPORTED;

export { isGlassSupported };
