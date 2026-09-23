import * as React from 'react';
import { memo } from 'react';
import { StyleSheet, Text } from 'react-native';

import {
  ACCESSIBILITY_LABELS,
  COLORS,
  COMPONENT_NAMES,
  SIDEBAR_LAYOUT,
  STRINGS,
  TYPOGRAPHY,
} from '../constants';
import { ComposeIcon } from '../icons';
import type { INewChatButtonProps } from '../interfaces';
import { GlassPressable } from './glass-pressable';

const NewChatButtonBase: React.FC<INewChatButtonProps> = ({
  label = STRINGS.NEW_CHAT,
  tintColor = COLORS.NEW_CHAT_BUTTON,
  style,
  fallbackStyle,
  ...props
}: INewChatButtonProps): React.JSX.Element => {
  return (
    <GlassPressable
      accessibilityRole="button"
      accessibilityLabel={ACCESSIBILITY_LABELS.NEW_CHAT}
      tintColor={tintColor}
      {...props}
      style={[styles.button, style]}
      fallbackStyle={[styles.fallback, fallbackStyle]}>
      <ComposeIcon size={SIDEBAR_LAYOUT.ICON_SIZE} color={COLORS.NEW_CHAT_TEXT} />
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </GlassPressable>
  );
};

NewChatButtonBase.displayName = `${COMPONENT_NAMES.NEW_CHAT_BUTTON}Base`;

const NewChatButton: React.NamedExoticComponent<INewChatButtonProps> =
  memo<INewChatButtonProps>(NewChatButtonBase);

NewChatButton.displayName = COMPONENT_NAMES.NEW_CHAT_BUTTON;

export { NewChatButton };

const styles = StyleSheet.create({
  button: {
    height: SIDEBAR_LAYOUT.FOOTER_HEIGHT,
    borderRadius: SIDEBAR_LAYOUT.FOOTER_HEIGHT / 2,
    paddingLeft: SIDEBAR_LAYOUT.NEW_CHAT_PADDING_LEFT,
    paddingRight: SIDEBAR_LAYOUT.NEW_CHAT_PADDING_RIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIDEBAR_LAYOUT.NEW_CHAT_GAP,
  },
  fallback: {
    backgroundColor: COLORS.NEW_CHAT_BUTTON,
  },
  label: {
    ...TYPOGRAPHY.BODY_SEMIBOLD,
    color: COLORS.NEW_CHAT_TEXT,
  },
});
