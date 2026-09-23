import * as React from 'react';
import { memo, useCallback } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  type PressableStateCallbackType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { COLORS, COMPONENT_NAMES, SIDEBAR_LAYOUT, TYPOGRAPHY } from '../constants';
import type { ISidebarRowProps } from '../interfaces';

const getRowStyle = ({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> => [
  styles.row,
  pressed && styles.pressed,
];

const SidebarRowBase: React.FC<ISidebarRowProps> = ({
  item,
  icon: Icon,
  onPress,
}: ISidebarRowProps): React.JSX.Element => {
  const handlePress = useCallback((): void => {
    onPress?.(item.id);
  }, [item.id, onPress]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={item.label}
      onPress={handlePress}
      style={getRowStyle}>
      {Icon ? <Icon size={SIDEBAR_LAYOUT.ICON_SIZE} color={COLORS.SIDEBAR_ICON} /> : null}
      <Text style={styles.label} numberOfLines={1}>
        {item.label}
      </Text>
    </Pressable>
  );
};

SidebarRowBase.displayName = `${COMPONENT_NAMES.SIDEBAR_ROW}Base`;

const SidebarRow: React.NamedExoticComponent<ISidebarRowProps> =
  memo<ISidebarRowProps>(SidebarRowBase);

SidebarRow.displayName = COMPONENT_NAMES.SIDEBAR_ROW;

export { SidebarRow };

const styles = StyleSheet.create({
  row: {
    height: SIDEBAR_LAYOUT.ROW_HEIGHT,
    marginHorizontal: SIDEBAR_LAYOUT.ROW_INSET,
    paddingHorizontal: SIDEBAR_LAYOUT.PADDING_HORIZONTAL - SIDEBAR_LAYOUT.ROW_INSET,
    borderRadius: SIDEBAR_LAYOUT.ROW_HEIGHT / 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIDEBAR_LAYOUT.ROW_GAP,
  },
  pressed: {
    backgroundColor: COLORS.SIDEBAR_ROW_PRESSED,
  },
  label: {
    ...TYPOGRAPHY.BODY,
    flexShrink: 1,
    color: COLORS.SIDEBAR_TEXT,
  },
});
