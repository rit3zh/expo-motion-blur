import type { SIDEBAR_NAV_IDS } from '../constants';

type TSidebarNavId = (typeof SIDEBAR_NAV_IDS)[keyof typeof SIDEBAR_NAV_IDS];

export type { TSidebarNavId };
