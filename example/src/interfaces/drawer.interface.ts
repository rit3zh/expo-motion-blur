import type { ReactNode } from 'react';
import type { SharedValue } from 'react-native-reanimated';

interface IDrawerProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  progress: SharedValue<number>;
  drawerContent: ReactNode;
  children: ReactNode;
}

export type { IDrawerProps };
