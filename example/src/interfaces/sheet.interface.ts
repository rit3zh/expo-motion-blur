import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

interface IBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export type { IBottomSheetProps };
