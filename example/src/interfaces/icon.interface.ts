import type { SharedValue } from 'react-native-reanimated';

interface IIconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

interface IChatGPTIconProps extends Omit<IIconProps, 'strokeWidth'> {
  backgroundColor?: string;
}

interface IMenuIconProps extends IIconProps {
  progress?: SharedValue<number>;
}

interface IMenuBarPose {
  x: number;
  y: number;
  halfLength: number;
  angle: number;
}

export type { IIconProps, IChatGPTIconProps, IMenuIconProps, IMenuBarPose };
