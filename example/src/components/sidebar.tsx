import { LinearGradient } from 'expo-linear-gradient';
import * as React from 'react';
import { memo, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  ACCESSIBILITY_LABELS,
  BORDER_WIDTH,
  COLORS,
  COMPONENT_NAMES,
  HEADER_LAYOUT,
  PINNED_CHATS,
  RECENT_CHATS,
  SIDEBAR_LAYOUT,
  SIDEBAR_NAV_IDS,
  SIDEBAR_NAV_ITEMS,
  STRINGS,
  TYPOGRAPHY,
} from '../constants';
import {
  BooksIcon,
  BrushIcon,
  ChatBubbleIcon,
  ClockIcon,
  FolderIcon,
  GearIcon,
  HeartBadgeIcon,
  SearchIcon,
  ShapesIcon,
} from '../icons';
import type { ISidebarItem, ISidebarNavItem, ISidebarProps } from '../interfaces';
import type { TIconComponent, TSidebarNavId } from '../types';
import { IconButton } from './icon-button';
import { NewChatButton } from './new-chat-button';
import { SidebarRow } from './sidebar-row';

const NAV_ICONS: Readonly<Record<TSidebarNavId, TIconComponent>> = {
  [SIDEBAR_NAV_IDS.IMAGES]: BrushIcon,
  [SIDEBAR_NAV_IDS.LIBRARY]: BooksIcon,
  [SIDEBAR_NAV_IDS.PROJECTS]: FolderIcon,
  [SIDEBAR_NAV_IDS.HEALTH]: HeartBadgeIcon,
  [SIDEBAR_NAV_IDS.SCHEDULED]: ClockIcon,
  [SIDEBAR_NAV_IDS.EXPLORE]: ShapesIcon,
};

const FADE_COLORS = [COLORS.SIDEBAR_FADE_START, COLORS.SIDEBAR_FADE_END] as const;

const SidebarBase: React.FC<ISidebarProps> = ({
  onItemPress,
  onNewChatPress,
  onSearchPress,
  onSettingsPress,
}: ISidebarProps): React.JSX.Element => {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, SIDEBAR_LAYOUT.MIN_BOTTOM_INSET);

  const containerStyle = useMemo<ViewStyle>(() => ({ paddingTop: insets.top }), [insets.top]);
  const contentStyle = useMemo<ViewStyle>(
    () => ({
      paddingBottom:
        bottomInset + SIDEBAR_LAYOUT.FOOTER_HEIGHT + SIDEBAR_LAYOUT.CONTENT_PADDING_TOP,
    }),
    [bottomInset]
  );
  const footerStyle = useMemo<ViewStyle>(() => ({ paddingBottom: bottomInset }), [bottomInset]);

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {STRINGS.SIDEBAR_TITLE}
        </Text>
        <IconButton
          icon={SearchIcon}
          accessibilityLabel={ACCESSIBILITY_LABELS.SEARCH_CHATS}
          onPress={onSearchPress}
          tintColor={COLORS.BUTTON_BACKGROUND}
          style={styles.frame}
          fallbackStyle={styles.surface}
        />
      </View>
      <ScrollView
        contentContainerStyle={[styles.content, contentStyle]}
        showsVerticalScrollIndicator={false}>
        {SIDEBAR_NAV_ITEMS.map((item: ISidebarNavItem) => (
          <SidebarRow key={item.id} item={item} icon={NAV_ICONS[item.id]} onPress={onItemPress} />
        ))}
        <View style={styles.section}>
          <Text accessibilityRole="header" style={styles.sectionTitle}>
            {STRINGS.PINNED}
          </Text>
        </View>
        {PINNED_CHATS.map((chat: ISidebarItem) => (
          <SidebarRow key={chat.id} item={chat} icon={ChatBubbleIcon} onPress={onItemPress} />
        ))}
        <View style={styles.section}>
          <Text accessibilityRole="header" style={styles.sectionTitle}>
            {STRINGS.RECENTS}
          </Text>
        </View>
        {RECENT_CHATS.map((chat: ISidebarItem) => (
          <SidebarRow key={chat.id} item={chat} onPress={onItemPress} />
        ))}
      </ScrollView>
      <View style={[styles.footer, footerStyle]}>
        <LinearGradient colors={FADE_COLORS} style={styles.fade} />
        <NewChatButton onPress={onNewChatPress} />
        <IconButton
          icon={GearIcon}
          size={SIDEBAR_LAYOUT.FOOTER_HEIGHT}
          accessibilityLabel={ACCESSIBILITY_LABELS.SETTINGS}
          onPress={onSettingsPress}
          tintColor={COLORS.BUTTON_BACKGROUND}
          style={styles.frame}
          fallbackStyle={styles.surface}
        />
      </View>
    </View>
  );
};

SidebarBase.displayName = `${COMPONENT_NAMES.SIDEBAR}Base`;

const Sidebar: React.NamedExoticComponent<ISidebarProps> = memo<ISidebarProps>(SidebarBase);

Sidebar.displayName = COMPONENT_NAMES.SIDEBAR;

export { Sidebar };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.SIDEBAR_BACKGROUND,
  },
  header: {
    height: HEADER_LAYOUT.HEIGHT,
    paddingHorizontal: SIDEBAR_LAYOUT.PADDING_HORIZONTAL,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    ...TYPOGRAPHY.TITLE,
    flexShrink: 1,
    color: COLORS.SIDEBAR_TEXT,
  },
  content: {
    paddingTop: SIDEBAR_LAYOUT.CONTENT_PADDING_TOP,
  },
  section: {
    height: SIDEBAR_LAYOUT.ROW_HEIGHT,
    marginTop: SIDEBAR_LAYOUT.SECTION_MARGIN_TOP,
    paddingHorizontal: SIDEBAR_LAYOUT.PADDING_HORIZONTAL,
    justifyContent: 'center',
  },
  sectionTitle: {
    ...TYPOGRAPHY.BODY_SEMIBOLD,
    color: COLORS.SIDEBAR_TEXT,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingLeft: SIDEBAR_LAYOUT.FOOTER_PADDING_LEFT,
    paddingRight: SIDEBAR_LAYOUT.FOOTER_PADDING_RIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    pointerEvents: 'box-none',
  },
  fade: {
    ...StyleSheet.absoluteFill,
    pointerEvents: 'none',
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
