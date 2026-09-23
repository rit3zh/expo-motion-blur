import * as React from 'react';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { COMPONENT_NAMES, SUGGESTION_IDS, SUGGESTION_LAYOUT, SUGGESTIONS } from '../constants';
import { ImageIcon, PencilIcon, WaveformIcon } from '../icons';
import type { ISuggestion, ISuggestionListProps } from '../interfaces';
import type { TIconComponent, TSuggestionId } from '../types';
import { SuggestionItem } from './suggestion-item';

const SUGGESTION_ICONS: Readonly<Record<TSuggestionId, TIconComponent>> = {
  [SUGGESTION_IDS.VOICE_CHAT]: WaveformIcon,
  [SUGGESTION_IDS.CREATE_IMAGE]: ImageIcon,
  [SUGGESTION_IDS.WRITE_OR_EDIT]: PencilIcon,
};

const SuggestionListBase: React.FC<ISuggestionListProps> = ({
  suggestions = SUGGESTIONS,
  onSuggestionPress,
  style,
}: ISuggestionListProps): React.JSX.Element => {
  return (
    <View style={[styles.container, style]}>
      {suggestions.map((suggestion: ISuggestion) => (
        <SuggestionItem
          key={suggestion.id}
          suggestion={suggestion}
          icon={SUGGESTION_ICONS[suggestion.id]}
          onPress={onSuggestionPress}
        />
      ))}
    </View>
  );
};

SuggestionListBase.displayName = `${COMPONENT_NAMES.SUGGESTION_LIST}Base`;

const SuggestionList: React.NamedExoticComponent<ISuggestionListProps> =
  memo<ISuggestionListProps>(SuggestionListBase);

SuggestionList.displayName = COMPONENT_NAMES.SUGGESTION_LIST;

export { SuggestionList };

const styles = StyleSheet.create({
  container: {
    marginBottom: SUGGESTION_LAYOUT.MARGIN_BOTTOM,
  },
});
