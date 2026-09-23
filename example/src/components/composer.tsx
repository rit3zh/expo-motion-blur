import * as React from 'react';
import { memo } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import {
  ACCESSIBILITY_LABELS,
  BORDER_WIDTH,
  COLORS,
  COMPONENT_NAMES,
  COMPOSER_LAYOUT,
  ICON_STROKE_WIDTHS,
  STRINGS,
  TYPOGRAPHY,
} from '../constants';
import { MicrophoneIcon, PlusIcon, WaveformIcon } from '../icons';
import type { IComposerProps } from '../interfaces';
import { IconButton } from './icon-button';
import { GlassView } from 'expo-glass-effect';
import { GlassPressable } from './glass-pressable';

const ComposerBase: React.FC<IComposerProps> = ({
  value,
  onChangeText,
  placeholder = STRINGS.COMPOSER_PLACEHOLDER,
  onAttachPress,
  onDictatePress,
  onVoicePress,
  style,
}: IComposerProps): React.JSX.Element => {
  return (
    <GlassPressable style={[styles.container, style]}>
      <IconButton
        icon={PlusIcon}
        glassEffectStyle="none"
        size={COMPOSER_LAYOUT.ACTION_SIZE}
        iconSize={COMPOSER_LAYOUT.ICON_SIZE}
        iconColor={COLORS.COMPOSER_ICON}
        hitSlop={COMPOSER_LAYOUT.ACTION_HIT_SLOP}
        accessibilityLabel={ACCESSIBILITY_LABELS.ATTACH}
        onPress={onAttachPress}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.COMPOSER_PLACEHOLDER}
        selectionColor={COLORS.VOICE_BUTTON}
        cursorColor={COLORS.VOICE_BUTTON}
        keyboardAppearance="dark"
        style={styles.input}
      />
      <IconButton
        icon={MicrophoneIcon}
        glassEffectStyle="none"
        size={COMPOSER_LAYOUT.ACTION_SIZE}
        iconSize={COMPOSER_LAYOUT.ICON_SIZE}
        iconColor={COLORS.COMPOSER_ICON}
        hitSlop={COMPOSER_LAYOUT.ACTION_HIT_SLOP}
        accessibilityLabel={ACCESSIBILITY_LABELS.DICTATE}
        onPress={onDictatePress}
      />
      <IconButton
        icon={WaveformIcon}
        size={COMPOSER_LAYOUT.ACTION_SIZE}
        iconSize={COMPOSER_LAYOUT.VOICE_ICON_SIZE}
        iconColor={COLORS.VOICE_ICON}
        iconStrokeWidth={ICON_STROKE_WIDTHS.VOICE_WAVEFORM}
        hitSlop={COMPOSER_LAYOUT.ACTION_HIT_SLOP}
        accessibilityLabel={ACCESSIBILITY_LABELS.VOICE_MODE}
        onPress={onVoicePress}
        tintColor={COLORS.VOICE_BUTTON}
        style={styles.voiceButton}
        fallbackStyle={styles.voiceButtonFallback}
      />
    </GlassPressable>
  );
};

ComposerBase.displayName = `${COMPONENT_NAMES.COMPOSER}Base`;

const Composer: React.NamedExoticComponent<IComposerProps> = memo<IComposerProps>(ComposerBase);

Composer.displayName = COMPONENT_NAMES.COMPOSER;

export { Composer };

const styles = StyleSheet.create({
  container: {
    height: COMPOSER_LAYOUT.HEIGHT,
    marginHorizontal: COMPOSER_LAYOUT.MARGIN_HORIZONTAL,
    padding: COMPOSER_LAYOUT.PADDING,
    borderRadius: COMPOSER_LAYOUT.HEIGHT / 2,
    borderWidth: BORDER_WIDTH,
    borderColor: COLORS.COMPOSER_BORDER,
    backgroundColor: COLORS.COMPOSER_BACKGROUND,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    ...TYPOGRAPHY.BODY,
    flex: 1,
    alignSelf: 'stretch',
    marginHorizontal: COMPOSER_LAYOUT.INPUT_MARGIN_HORIZONTAL,
    padding: 0,
    paddingBottom: COMPOSER_LAYOUT.INPUT_PADDING_BOTTOM,
    color: COLORS.COMPOSER_TEXT,
  },
  voiceButton: {
    marginLeft: COMPOSER_LAYOUT.ACTION_GAP,
  },
  voiceButtonFallback: {
    backgroundColor: COLORS.VOICE_BUTTON,
  },
});
