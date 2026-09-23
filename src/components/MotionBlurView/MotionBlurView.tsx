import * as React from 'react';
import { memo } from 'react';
import { COMPONENT_NAMES } from '../../constants';
import type { IMotionBlurViewProps } from '../../interfaces';
import { NativeMotionBlurView } from '../../views/NativeMotionBlurView';

const MotionBlurViewBase: React.FC<IMotionBlurViewProps> & React.FunctionComponent = ({
  children,
  ...props
}: IMotionBlurViewProps): React.JSX.Element & React.ReactElement & React.ReactNode => {
  return <NativeMotionBlurView {...props}>{children}</NativeMotionBlurView>;
};

MotionBlurViewBase.displayName = `${COMPONENT_NAMES.MOTION_BLUR_VIEW}Base`;

const MotionBlurView: React.NamedExoticComponent<IMotionBlurViewProps> =
  memo<IMotionBlurViewProps>(MotionBlurViewBase);

MotionBlurView.displayName = COMPONENT_NAMES.MOTION_BLUR_VIEW;

export { MotionBlurView };
