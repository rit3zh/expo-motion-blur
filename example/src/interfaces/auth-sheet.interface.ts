import type { ReactNode } from 'react';

import type { TAuthButtonVariant } from '../types';
import type { IGlassPressableProps } from './glass-pressable.interface';
import type { IBottomSheetProps } from './sheet.interface';

interface IAuthSheetProps extends Pick<IBottomSheetProps, 'visible' | 'onClose'> {
  onContinueWithApple?: () => void;
  onContinueWithGoogle?: () => void;
  onSignUpWithEmail?: () => void;
}

interface IAuthButtonProps extends Pick<IGlassPressableProps, 'onPress'> {
  label: string;
  icon: ReactNode;
  variant?: TAuthButtonVariant;
}

export type { IAuthSheetProps, IAuthButtonProps };
