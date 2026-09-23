import type { SharedValue } from 'react-native-reanimated';

import type { IGlassPressableProps } from './glass-pressable.interface';

interface IMenuButtonProps extends Omit<IGlassPressableProps, 'children'> {
  progress?: SharedValue<number>;
  isOpen?: boolean;
}

export type { IMenuButtonProps };
