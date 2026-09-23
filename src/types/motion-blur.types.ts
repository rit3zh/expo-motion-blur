import type { COMPONENT_NAMES, MOTION_BLUR_PROP_KEYS } from '../constants';

type TComponentName = (typeof COMPONENT_NAMES)[keyof typeof COMPONENT_NAMES];
type TMotionBlurPropKey = (typeof MOTION_BLUR_PROP_KEYS)[number];

export type { TComponentName, TMotionBlurPropKey };
