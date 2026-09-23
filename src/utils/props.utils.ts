import type { ViewProps } from 'react-native';

import { MOTION_BLUR_PROP_KEYS } from '../constants';
import type { IMotionBlurViewProps } from '../interfaces';
import type { TMotionBlurPropKey } from '../types';

const omitMotionBlurProps = <T extends IMotionBlurViewProps>(
  props: T
): Omit<T, TMotionBlurPropKey> & ViewProps => {
  const viewProps: Partial<IMotionBlurViewProps> = { ...props };
  for (const key of MOTION_BLUR_PROP_KEYS) {
    delete viewProps[key];
  }
  return viewProps as Omit<T, TMotionBlurPropKey> & ViewProps;
};

export { omitMotionBlurProps };
