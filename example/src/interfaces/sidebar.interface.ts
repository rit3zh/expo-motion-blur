import type { TIconComponent, TSidebarNavId } from '../types';
import type { IGlassPressableProps } from './glass-pressable.interface';

interface ISidebarItem {
  id: string;
  label: string;
}

interface ISidebarNavItem extends ISidebarItem {
  id: TSidebarNavId;
}

interface ISidebarRowProps {
  item: ISidebarItem;
  icon?: TIconComponent;
  onPress?: (id: string) => void;
}

interface ISidebarProps {
  onItemPress?: (id: string) => void;
  onNewChatPress?: () => void;
  onSearchPress?: () => void;
  onSettingsPress?: () => void;
}

interface INewChatButtonProps extends Omit<IGlassPressableProps, 'children'> {
  label?: string;
}

export type { ISidebarItem, ISidebarNavItem, ISidebarRowProps, ISidebarProps, INewChatButtonProps };
