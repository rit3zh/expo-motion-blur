import * as React from 'react';
import { memo } from 'react';
import { View } from 'react-native';
import { COMPONENT_NAMES } from '../../constants';
import type { IMotionBlurViewProps } from '../../interfaces';
import { omitMotionBlurProps } from '../../utils';

const MotionBlurViewBase: React.FC<IMotionBlurViewProps> & React.FunctionComponent = (
  props: IMotionBlurViewProps
): React.JSX.Element & React.ReactElement & React.ReactNode => {
  return <View {...omitMotionBlurProps(props)} />;
};

MotionBlurViewBase.displayName = `${COMPONENT_NAMES.MOTION_BLUR_VIEW}Base`;

const MotionBlurView: React.NamedExoticComponent<IMotionBlurViewProps> =
  memo<IMotionBlurViewProps>(MotionBlurViewBase);

MotionBlurView.displayName = COMPONENT_NAMES.MOTION_BLUR_VIEW;

export { MotionBlurView };
