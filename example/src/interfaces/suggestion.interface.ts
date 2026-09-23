import type { StyleProp, ViewStyle } from 'react-native';

import type { TIconComponent, TSuggestionId } from '../types';

interface ISuggestion {
  id: TSuggestionId;
  label: string;
}

interface ISuggestionItemProps {
  suggestion: ISuggestion;
  icon: TIconComponent;
  onPress?: (id: TSuggestionId) => void;
}

interface ISuggestionListProps {
  suggestions?: readonly ISuggestion[];
  onSuggestionPress?: (id: TSuggestionId) => void;
  style?: StyleProp<ViewStyle>;
}

export type { ISuggestion, ISuggestionItemProps, ISuggestionListProps };
