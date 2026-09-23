import * as React from 'react';
import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

import { COLORS, COMPONENT_NAMES, ICON_STROKE_WIDTHS, ICON_VIEW_BOX, ICON_VIEW_BOX_SIZE } from '../constants';
import type { IIconProps } from '../interfaces';

const DashedChatIconBase: React.FC<IIconProps> = ({
  size = ICON_VIEW_BOX_SIZE,
  color = COLORS.WHITE,
  strokeWidth = ICON_STROKE_WIDTHS.DASHED_CHAT,
}: IIconProps): React.JSX.Element => {
  return (
    <Svg width={size} height={size} viewBox={ICON_VIEW_BOX} fill="none">
      <Path
        d="M4.58 5.26A10.5 10 0 0 1 19.42 5.26M22.09 9.57A10.5 10 0 0 1 14 22.15M1.91 9.57A10.5 10 0 0 0 3.17 17.75L2.75 21.7Q6 19.8 9.67 22.25"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

DashedChatIconBase.displayName = `${COMPONENT_NAMES.DASHED_CHAT_ICON}Base`;

const DashedChatIcon: React.NamedExoticComponent<IIconProps> =
  memo<IIconProps>(DashedChatIconBase);

DashedChatIcon.displayName = COMPONENT_NAMES.DASHED_CHAT_ICON;

export { DashedChatIcon };
