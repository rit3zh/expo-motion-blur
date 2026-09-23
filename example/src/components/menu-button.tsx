import * as React from 'react';
import { memo } from 'react';
import { StyleSheet } from 'react-native';

import { ACCESSIBILITY_LABELS, COLORS, COMPONENT_NAMES, ICON_BUTTON_LAYOUT } from '../constants';
import { MenuIcon } from '../icons';
import type { IMenuButtonProps } from '../interfaces';
import { GlassPressable } from './glass-pressable';

const MenuButtonBase: React.FC<IMenuButtonProps> = ({
  progress,
  isOpen = false,
  style,
  ...props
}: IMenuButtonProps): React.JSX.Element => {
  return (
    <GlassPressable
      accessibilityRole="button"
      accessibilityLabel={isOpen ? ACCESSIBILITY_LABELS.CLOSE_SIDEBAR : ACCESSIBILITY_LABELS.MENU}
      {...props}
      style={[styles.button, style]}>
      <MenuIcon
        progress={progress}
        size={ICON_BUTTON_LAYOUT.ICON_SIZE}
        color={COLORS.BUTTON_ICON}
      />
    </GlassPressable>
  );
};

MenuButtonBase.displayName = `${COMPONENT_NAMES.MENU_BUTTON}Base`;

const MenuButton: React.NamedExoticComponent<IMenuButtonProps> =
  memo<IMenuButtonProps>(MenuButtonBase);

MenuButton.displayName = COMPONENT_NAMES.MENU_BUTTON;

export { MenuButton };

const styles = StyleSheet.create({
  button: {
    width: ICON_BUTTON_LAYOUT.SIZE,
    height: ICON_BUTTON_LAYOUT.SIZE,
    borderRadius: ICON_BUTTON_LAYOUT.SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
