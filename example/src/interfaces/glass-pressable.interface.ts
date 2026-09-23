import type { PressableProps } from 'react-native';

import type { IGlassSurfaceProps } from './glass-surface.interface';

interface IGlassPressableProps
  extends IGlassSurfaceProps,
    Pick<
      PressableProps,
      | 'onPress'
      | 'onPressIn'
      | 'onPressOut'
      | 'onLongPress'
      | 'disabled'
      | 'hitSlop'
      | 'accessibilityRole'
      | 'accessibilityLabel'
      | 'accessibilityHint'
      | 'testID'
    > {}

export type { IGlassPressableProps };
