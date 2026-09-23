const NATIVE_MODULE_NAME = 'ExpoMotionBlurView';
const COMPONENT_NAMES = {
  MOTION_BLUR_VIEW: 'MotionBlurView',
} as const;
const MOTION_BLUR_PROP_KEYS = [
  'intensity',
  'speedForMaxBlur',
  'samples',
  'enabled',
  'live',
] as const;

export { NATIVE_MODULE_NAME, COMPONENT_NAMES, MOTION_BLUR_PROP_KEYS };
