import { requireNativeView } from 'expo';
import type { ComponentType } from 'react';

import { NATIVE_MODULE_NAME } from '../constants';
import type { IMotionBlurViewProps } from '../interfaces';

type TNativeViewRegistry = Map<string, ComponentType<IMotionBlurViewProps>>;

const REGISTRY_KEY = '__expoMotionBlurNativeViews__';

const getNativeViewRegistry = (): TNativeViewRegistry => {
  const scope = globalThis as typeof globalThis & { [REGISTRY_KEY]?: TNativeViewRegistry };
  scope[REGISTRY_KEY] ??= new Map();
  return scope[REGISTRY_KEY];
};

const getNativeMotionBlurView = (): ComponentType<IMotionBlurViewProps> => {
  const registry = getNativeViewRegistry();
  let nativeView = registry.get(NATIVE_MODULE_NAME);
  if (!nativeView) {
    nativeView = requireNativeView<IMotionBlurViewProps>(NATIVE_MODULE_NAME);
    registry.set(NATIVE_MODULE_NAME, nativeView);
  }
  return nativeView;
};

const NativeMotionBlurView: ComponentType<IMotionBlurViewProps> = getNativeMotionBlurView();

export { NativeMotionBlurView };
