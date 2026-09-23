import type { ISidebarItem, ISidebarNavItem } from '../interfaces';

const SIDEBAR_NAV_IDS = {
  IMAGES: 'images',
  LIBRARY: 'library',
  PROJECTS: 'projects',
  HEALTH: 'health',
  SCHEDULED: 'scheduled',
  EXPLORE: 'explore',
} as const;

const SIDEBAR_NAV_ITEMS: readonly ISidebarNavItem[] = [
  { id: SIDEBAR_NAV_IDS.IMAGES, label: 'Images' },
  { id: SIDEBAR_NAV_IDS.LIBRARY, label: 'Library' },
  { id: SIDEBAR_NAV_IDS.PROJECTS, label: 'Projects' },
  { id: SIDEBAR_NAV_IDS.HEALTH, label: 'Health' },
  { id: SIDEBAR_NAV_IDS.SCHEDULED, label: 'Scheduled' },
  { id: SIDEBAR_NAV_IDS.EXPLORE, label: 'Explore' },
];

const PINNED_CHATS: readonly ISidebarItem[] = [
  { id: 'calisthenics-beginner-guide', label: 'Calisthenics Beginner Guide' },
  { id: 'if-let-in-swift', label: 'If-let in Swift' },
  { id: 'best-ui-library', label: 'Making the best UI library for React Native' },
  { id: 'image-ripple-shader', label: 'Image Ripple Shader' },
  { id: 'tailwind-variants-alternatives', label: 'Tailwind Variants Alternatives' },
  { id: 'ios-liquid-glass-optimization', label: 'iOS Liquid Glass Optimization' },
];

const RECENT_CHATS: readonly ISidebarItem[] = [
  { id: 'private-apis-safety', label: 'Apple Private APIs Safety' },
  { id: 'native-module-name-suggestions', label: 'Native Module Name Suggestions' },
  { id: 'motion-blur-metal-shader', label: 'Motion Blur Metal Shader' },
  { id: 'reanimated-shared-values', label: 'Reanimated Shared Values' },
  { id: 'expo-router-layouts', label: 'Expo Router Layouts' },
  { id: 'swiftui-glass-effect', label: 'SwiftUI Glass Effect' },
  { id: 'kotlin-agsl-shaders', label: 'Kotlin AGSL Shaders' },
];

export { SIDEBAR_NAV_IDS, SIDEBAR_NAV_ITEMS, PINNED_CHATS, RECENT_CHATS };
