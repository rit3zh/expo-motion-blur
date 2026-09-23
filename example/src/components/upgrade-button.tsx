import * as React from 'react';
import { memo } from 'react';
import { StyleSheet, Text } from 'react-native';

import {
  COLORS,
  COMPONENT_NAMES,
  STRINGS,
  TYPOGRAPHY,
  UPGRADE_BUTTON_LAYOUT,
} from '../constants';
import { SparkleIcon } from '../icons';
import type { IUpgradeButtonProps } from '../interfaces';
import { GlassPressable } from './glass-pressable';

const UpgradeButtonBase: React.FC<IUpgradeButtonProps> = ({
  label = STRINGS.UPGRADE,
  style,
  ...props
}: IUpgradeButtonProps): React.JSX.Element => {
  return (
    <GlassPressable
      accessibilityRole="button"
      accessibilityLabel={label}
      {...props}
      style={[styles.button, style]}>
      <SparkleIcon size={UPGRADE_BUTTON_LAYOUT.ICON_SIZE} color={COLORS.UPGRADE} />
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </GlassPressable>
  );
};

UpgradeButtonBase.displayName = `${COMPONENT_NAMES.UPGRADE_BUTTON}Base`;

const UpgradeButton: React.NamedExoticComponent<IUpgradeButtonProps> =
  memo<IUpgradeButtonProps>(UpgradeButtonBase);

UpgradeButton.displayName = COMPONENT_NAMES.UPGRADE_BUTTON;

export { UpgradeButton };

const styles = StyleSheet.create({
  button: {
    height: UPGRADE_BUTTON_LAYOUT.HEIGHT,
    borderRadius: UPGRADE_BUTTON_LAYOUT.HEIGHT / 2,
    paddingLeft: UPGRADE_BUTTON_LAYOUT.PADDING_LEFT,
    paddingRight: UPGRADE_BUTTON_LAYOUT.PADDING_RIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    gap: UPGRADE_BUTTON_LAYOUT.GAP,
  },
  label: {
    ...TYPOGRAPHY.BODY_SEMIBOLD,
    color: COLORS.UPGRADE,
  },
});
