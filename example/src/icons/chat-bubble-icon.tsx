import * as React from 'react';
import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

import { COLORS, COMPONENT_NAMES, ICON_STROKE_WIDTHS, ICON_VIEW_BOX, ICON_VIEW_BOX_SIZE } from '../constants';
import type { IIconProps } from '../interfaces';

const ChatBubbleIconBase: React.FC<IIconProps> = ({
  size = ICON_VIEW_BOX_SIZE,
  color = COLORS.WHITE,
  strokeWidth = ICON_STROKE_WIDTHS.CHAT_BUBBLE,
}: IIconProps): React.JSX.Element => {
  return (
    <Svg width={size} height={size} viewBox={ICON_VIEW_BOX} fill="none">
      <Path
        d="M5.51 16.65L4.7 19.6L7.42 18.37A8.5 7.9 0 1 0 5.51 16.65Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </Svg>
  );
};

ChatBubbleIconBase.displayName = `${COMPONENT_NAMES.CHAT_BUBBLE_ICON}Base`;

const ChatBubbleIcon: React.NamedExoticComponent<IIconProps> =
  memo<IIconProps>(ChatBubbleIconBase);

ChatBubbleIcon.displayName = COMPONENT_NAMES.CHAT_BUBBLE_ICON;

export { ChatBubbleIcon };
