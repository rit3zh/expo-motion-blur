import * as React from 'react';
import { memo } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import {
  AUTH_BUTTON_VARIANTS,
  AUTH_SHEET_LAYOUT,
  COLORS,
  COMPONENT_NAMES,
  STRINGS,
  TYPOGRAPHY,
} from '../constants';
import { AppleIcon, ChatGPTIcon, EnvelopeIcon, GoogleIcon } from '../icons';
import type { IAuthSheetProps } from '../interfaces';
import { AuthButton } from './auth-button';
import { BottomSheet } from './bottom-sheet';

const IS_IOS: boolean = Platform.OS === 'ios';

const APPLE_ICON = (
  <AppleIcon size={AUTH_SHEET_LAYOUT.APPLE_ICON_SIZE} color={COLORS.AUTH_PRIMARY_TEXT} />
);
const GOOGLE_ICON = <GoogleIcon size={AUTH_SHEET_LAYOUT.GOOGLE_ICON_SIZE} />;
const ENVELOPE_ICON = (
  <EnvelopeIcon size={AUTH_SHEET_LAYOUT.ENVELOPE_ICON_SIZE} color={COLORS.AUTH_SECONDARY_TEXT} />
);

const AuthSheetBase: React.FC<IAuthSheetProps> = ({
  visible,
  onClose,
  onContinueWithApple,
  onContinueWithGoogle,
  onSignUpWithEmail,
}: IAuthSheetProps): React.JSX.Element => {
  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.content}>
        <View style={styles.appIcon}>
          <ChatGPTIcon size={AUTH_SHEET_LAYOUT.APP_ICON_SIZE} />
        </View>
        <Text accessibilityRole="header" style={styles.title}>
          {STRINGS.AUTH_TITLE}
        </Text>
        <Text style={styles.description}>{STRINGS.AUTH_DESCRIPTION}</Text>
        <View style={styles.actions}>
          {IS_IOS ? (
            <AuthButton
              label={STRINGS.CONTINUE_WITH_APPLE}
              icon={APPLE_ICON}
              variant={AUTH_BUTTON_VARIANTS.PRIMARY}
              onPress={onContinueWithApple}
            />
          ) : (
            <AuthButton
              label={STRINGS.CONTINUE_WITH_GOOGLE}
              icon={GOOGLE_ICON}
              variant={AUTH_BUTTON_VARIANTS.PRIMARY}
              onPress={onContinueWithGoogle}
            />
          )}
          <AuthButton
            label={STRINGS.SIGN_UP_WITH_EMAIL}
            icon={ENVELOPE_ICON}
            onPress={onSignUpWithEmail}
          />
        </View>
      </View>
    </BottomSheet>
  );
};

AuthSheetBase.displayName = `${COMPONENT_NAMES.AUTH_SHEET}Base`;

const AuthSheet: React.NamedExoticComponent<IAuthSheetProps> = memo<IAuthSheetProps>(AuthSheetBase);

AuthSheet.displayName = COMPONENT_NAMES.AUTH_SHEET;

export { AuthSheet };

const styles = StyleSheet.create({
  content: {
    padding: AUTH_SHEET_LAYOUT.PADDING,
    paddingBottom: AUTH_SHEET_LAYOUT.PADDING_BOTTOM,
  },
  appIcon: {
    alignSelf: 'flex-start',
    borderRadius: AUTH_SHEET_LAYOUT.APP_ICON_RADIUS,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.APP_ICON_BORDER,
    overflow: 'hidden',
  },
  title: {
    ...TYPOGRAPHY.TITLE,
    marginTop: AUTH_SHEET_LAYOUT.TITLE_MARGIN_TOP,
    color: COLORS.SHEET_TITLE,
  },
  description: {
    ...TYPOGRAPHY.PARAGRAPH,
    marginTop: AUTH_SHEET_LAYOUT.DESCRIPTION_MARGIN_TOP,
    color: COLORS.SHEET_DESCRIPTION,
  },
  actions: {
    marginTop: AUTH_SHEET_LAYOUT.ACTIONS_MARGIN_TOP,
    marginHorizontal: AUTH_SHEET_LAYOUT.ACTIONS_INSET - AUTH_SHEET_LAYOUT.PADDING,
    gap: AUTH_SHEET_LAYOUT.ACTION_GAP,
  },
});
