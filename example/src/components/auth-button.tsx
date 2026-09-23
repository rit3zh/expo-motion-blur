import * as React from 'react';
import { memo } from 'react';
import { StyleSheet, Text } from 'react-native';

import {
  AUTH_BUTTON_VARIANTS,
  AUTH_SHEET_LAYOUT,
  COLORS,
  COMPONENT_NAMES,
  TYPOGRAPHY,
} from '../constants';
import type { IAuthButtonProps } from '../interfaces';
import { GlassPressable } from './glass-pressable';

const AuthButtonBase: React.FC<IAuthButtonProps> = ({
  label,
  icon,
  variant = AUTH_BUTTON_VARIANTS.SECONDARY,
  onPress,
}: IAuthButtonProps): React.JSX.Element => {
  const isPrimary = variant === AUTH_BUTTON_VARIANTS.PRIMARY;

  return (
    <GlassPressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      tintColor={isPrimary ? COLORS.AUTH_PRIMARY_BACKGROUND : COLORS.AUTH_SECONDARY_TINT}
      style={styles.button}
      fallbackStyle={isPrimary ? styles.primaryFallback : styles.secondaryFallback}>
      {icon}
      <Text style={[styles.label, isPrimary ? styles.primaryLabel : styles.secondaryLabel]}>
        {label}
      </Text>
    </GlassPressable>
  );
};

AuthButtonBase.displayName = `${COMPONENT_NAMES.AUTH_BUTTON}Base`;

const AuthButton: React.NamedExoticComponent<IAuthButtonProps> =
  memo<IAuthButtonProps>(AuthButtonBase);

AuthButton.displayName = COMPONENT_NAMES.AUTH_BUTTON;

export { AuthButton };

const styles = StyleSheet.create({
  button: {
    height: AUTH_SHEET_LAYOUT.BUTTON_HEIGHT,
    borderRadius: AUTH_SHEET_LAYOUT.BUTTON_HEIGHT / 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: AUTH_SHEET_LAYOUT.BUTTON_ICON_GAP,
  },
  primaryFallback: {
    backgroundColor: COLORS.AUTH_PRIMARY_BACKGROUND,
  },
  secondaryFallback: {
    backgroundColor: COLORS.AUTH_SECONDARY_BACKGROUND,
  },
  label: {
    ...TYPOGRAPHY.BODY_SEMIBOLD,
  },
  primaryLabel: {
    color: COLORS.AUTH_PRIMARY_TEXT,
  },
  secondaryLabel: {
    color: COLORS.AUTH_SECONDARY_TEXT,
  },
});
