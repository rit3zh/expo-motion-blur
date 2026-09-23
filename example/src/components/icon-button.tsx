import * as React from 'react';
import { memo, useMemo } from 'react';
import { StyleSheet, type ViewStyle } from 'react-native';

import { COLORS, COMPONENT_NAMES, ICON_BUTTON_LAYOUT } from '../constants';
import type { IIconButtonProps } from '../interfaces';
import { GlassPressable } from './glass-pressable';

const IconButtonBase: React.FC<IIconButtonProps> = ({
  icon: Icon,
  size = ICON_BUTTON_LAYOUT.SIZE,
  iconSize = ICON_BUTTON_LAYOUT.ICON_SIZE,
  iconColor = COLORS.BUTTON_ICON,
  iconStrokeWidth,
  style,
  ...props
}: IIconButtonProps): React.JSX.Element => {
  const sizeStyle = useMemo<ViewStyle>(
    () => ({ width: size, height: size, borderRadius: size / 2 }),
    [size]
  );

  return (
    <GlassPressable accessibilityRole="button" {...props} style={[styles.button, sizeStyle, style]}>
      <Icon size={iconSize} color={iconColor} strokeWidth={iconStrokeWidth} />
    </GlassPressable>
  );
};

IconButtonBase.displayName = `${COMPONENT_NAMES.ICON_BUTTON}Base`;

const IconButton: React.NamedExoticComponent<IIconButtonProps> =
  memo<IIconButtonProps>(IconButtonBase);

IconButton.displayName = COMPONENT_NAMES.ICON_BUTTON;

export { IconButton };

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
