import * as React from 'react';
import { memo } from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

import { COLORS, COMPONENT_NAMES, ICON_STROKE_WIDTHS, ICON_VIEW_BOX, ICON_VIEW_BOX_SIZE } from '../constants';
import type { IIconProps } from '../interfaces';

const SearchIconBase: React.FC<IIconProps> = ({
  size = ICON_VIEW_BOX_SIZE,
  color = COLORS.WHITE,
  strokeWidth = ICON_STROKE_WIDTHS.SEARCH,
}: IIconProps): React.JSX.Element => {
  return (
    <Svg width={size} height={size} viewBox={ICON_VIEW_BOX} fill="none">
      <Circle cx={10.8} cy={10.8} r={7.7} stroke={color} strokeWidth={strokeWidth} />
      <Path
        d="M16.4 16.4L20.6 20.6"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
};

SearchIconBase.displayName = `${COMPONENT_NAMES.SEARCH_ICON}Base`;

const SearchIcon: React.NamedExoticComponent<IIconProps> = memo<IIconProps>(SearchIconBase);

SearchIcon.displayName = COMPONENT_NAMES.SEARCH_ICON;

export { SearchIcon };
