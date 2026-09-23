import type { StyleProp, TextInputProps, ViewStyle } from 'react-native';

interface IComposerProps extends Pick<TextInputProps, 'value' | 'onChangeText' | 'placeholder'> {
  onAttachPress?: () => void;
  onDictatePress?: () => void;
  onVoicePress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export type { IComposerProps };
