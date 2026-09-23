import type { TIconComponent } from '../types';
import type { IGlassPressableProps } from './glass-pressable.interface';

interface IIconButtonProps extends Omit<IGlassPressableProps, 'children'> {
  icon: TIconComponent;
  size?: number;
  iconSize?: number;
  iconColor?: string;
  iconStrokeWidth?: number;
}

export type { IIconButtonProps };
