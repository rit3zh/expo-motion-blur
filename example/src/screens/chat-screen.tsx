import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { memo, useCallback, useMemo, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Composer, Drawer, HeaderBar, Sidebar, SuggestionList, AuthSheet } from '../components';
import { COLORS, COMPONENT_NAMES, COMPOSER_LAYOUT } from '../constants';

const ChatScreenBase: React.FC = (): React.JSX.Element => {
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isAuthSheetVisible, setIsAuthSheetVisible] = useState<boolean>(false);
  const sidebarProgress = useSharedValue<number>(0);

  const toggleSidebar = useCallback((): void => {
    setIsSidebarOpen((isOpen: boolean) => !isOpen);
  }, []);

  const closeSidebar = useCallback((): void => {
    setIsSidebarOpen(false);
  }, []);

  const startNewChat = useCallback((): void => {
    setMessage('');
    setIsSidebarOpen(false);
  }, []);

  const openAuthSheet = useCallback((): void => {
    setIsAuthSheetVisible(true);
  }, []);

  const closeAuthSheet = useCallback((): void => {
    setIsAuthSheetVisible(false);
  }, []);

  const bottomInset = Math.max(insets.bottom, COMPOSER_LAYOUT.MIN_BOTTOM_INSET);

  const containerStyle = useMemo<ViewStyle>(() => ({ paddingTop: insets.top }), [insets.top]);
  const composerStyle = useMemo<ViewStyle>(() => ({ marginBottom: bottomInset }), [bottomInset]);

  return (
    <View style={styles.root}>
      <Drawer
        isOpen={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
        progress={sidebarProgress}
        drawerContent={<Sidebar onItemPress={closeSidebar} onNewChatPress={startNewChat} />}>
        <View style={[styles.container, containerStyle]}>
          <StatusBar style="light" />
          <HeaderBar
            onMenuPress={toggleSidebar}
            menuProgress={sidebarProgress}
            isMenuOpen={isSidebarOpen}
            onUpgradePress={openAuthSheet}
          />
          <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={COMPOSER_LAYOUT.KEYBOARD_GAP - bottomInset}
            style={styles.body}>
            <Pressable accessible={false} onPress={Keyboard.dismiss} style={styles.conversation} />
            <SuggestionList />
            <Composer value={message} onChangeText={setMessage} style={composerStyle} />
          </KeyboardAvoidingView>
        </View>
      </Drawer>
      <AuthSheet visible={isAuthSheetVisible} onClose={closeAuthSheet} />
    </View>
  );
};

ChatScreenBase.displayName = `${COMPONENT_NAMES.CHAT_SCREEN}Base`;

const ChatScreen: React.NamedExoticComponent = memo(ChatScreenBase);

ChatScreen.displayName = COMPONENT_NAMES.CHAT_SCREEN;

export { ChatScreen };

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  body: {
    flex: 1,
  },
  conversation: {
    flex: 1,
  },
});
