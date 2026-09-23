import * as React from 'react';
import { memo, useCallback } from 'react';
import { StyleSheet, Text } from 'react-native';

import { COLORS, COMPONENT_NAMES, SUGGESTION_LAYOUT, TYPOGRAPHY } from '../constants';
import type { ISuggestionItemProps } from '../interfaces';
import { GlassPressable } from './glass-pressable';

const SuggestionItemBase: React.FC<ISuggestionItemProps> = ({
  suggestion,
  icon: Icon,
  onPress,
}: ISuggestionItemProps): React.JSX.Element => {
  const handlePress = useCallback((): void => {
    onPress?.(suggestion.id);
  }, [onPress, suggestion.id]);

  return (
    <GlassPressable
      glassEffectStyle="none"
      accessibilityRole="button"
      accessibilityLabel={suggestion.label}
      onPress={handlePress}
      style={styles.row}>
      <Icon size={SUGGESTION_LAYOUT.ICON_SIZE} color={COLORS.SUGGESTION} />
      <Text style={styles.label} numberOfLines={1}>
        {suggestion.label}
      </Text>
    </GlassPressable>
  );
};

SuggestionItemBase.displayName = `${COMPONENT_NAMES.SUGGESTION_ITEM}Base`;

const SuggestionItem: React.NamedExoticComponent<ISuggestionItemProps> =
  memo<ISuggestionItemProps>(SuggestionItemBase);

SuggestionItem.displayName = COMPONENT_NAMES.SUGGESTION_ITEM;

export { SuggestionItem };

const styles = StyleSheet.create({
  row: {
    alignSelf: 'flex-start',
    height: SUGGESTION_LAYOUT.ROW_HEIGHT,
    borderRadius: SUGGESTION_LAYOUT.ROW_HEIGHT / 2,
    paddingHorizontal: SUGGESTION_LAYOUT.PADDING_HORIZONTAL,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SUGGESTION_LAYOUT.GAP,
  },
  label: {
    ...TYPOGRAPHY.BODY,
    color: COLORS.SUGGESTION,
  },
});
