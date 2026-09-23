import * as React from 'react';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  ACCESSIBILITY_LABELS,
  BORDER_WIDTH,
  COLORS,
  COMPONENT_NAMES,
  HEADER_LAYOUT,
} from '../constants';
import { DashedChatIcon } from '../icons';
import type { IHeaderBarProps } from '../interfaces';
import { IconButton } from './icon-button';
import { MenuButton } from './menu-button';
import { UpgradeButton } from './upgrade-button';

const HeaderBarBase: React.FC<IHeaderBarProps> = ({
  onMenuPress,
  menuProgress,
  isMenuOpen = false,
  onUpgradePress,
  onTemporaryChatPress,
}: IHeaderBarProps): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <View style={styles.leading}>
        <MenuButton
          progress={menuProgress}
          isOpen={isMenuOpen}
          onPress={onMenuPress}
          tintColor={COLORS.BUTTON_BACKGROUND}
          style={styles.frame}
          fallbackStyle={styles.surface}
        />
        <UpgradeButton
          onPress={onUpgradePress}
          tintColor={COLORS.BUTTON_BACKGROUND}
          style={styles.frame}
          fallbackStyle={styles.surface}
        />
      </View>
      <IconButton
        icon={DashedChatIcon}
        accessibilityLabel={ACCESSIBILITY_LABELS.TEMPORARY_CHAT}
        onPress={onTemporaryChatPress}
        tintColor={COLORS.BUTTON_BACKGROUND}
        style={styles.frame}
        fallbackStyle={styles.surface}
      />
    </View>
  );
};

HeaderBarBase.displayName = `${COMPONENT_NAMES.HEADER_BAR}Base`;

const HeaderBar: React.NamedExoticComponent<IHeaderBarProps> =
  memo<IHeaderBarProps>(HeaderBarBase);

HeaderBar.displayName = COMPONENT_NAMES.HEADER_BAR;

export { HeaderBar };

const styles = StyleSheet.create({
  container: {
    height: HEADER_LAYOUT.HEIGHT,
    paddingHorizontal: HEADER_LAYOUT.PADDING_HORIZONTAL,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: HEADER_LAYOUT.GAP,
  },
  frame: {
    borderWidth: BORDER_WIDTH,
    borderColor: 'transparent',
  },
  surface: {
    backgroundColor: COLORS.BUTTON_BACKGROUND,
    borderColor: COLORS.BUTTON_BORDER,
  },
});
