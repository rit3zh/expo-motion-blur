import type { IGlassPressableProps } from './glass-pressable.interface';

interface IUpgradeButtonProps extends Omit<IGlassPressableProps, 'children'> {
  label?: string;
}

export type { IUpgradeButtonProps };
