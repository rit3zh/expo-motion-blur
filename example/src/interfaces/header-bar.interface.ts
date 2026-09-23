import type { SharedValue } from 'react-native-reanimated';

interface IHeaderBarProps {
  onMenuPress?: () => void;
  menuProgress?: SharedValue<number>;
  isMenuOpen?: boolean;
  onUpgradePress?: () => void;
  onTemporaryChatPress?: () => void;
}

export type { IHeaderBarProps };
