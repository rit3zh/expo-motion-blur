import * as React from 'react';
import { memo } from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

import { COLORS, COMPONENT_NAMES, ICON_STROKE_WIDTHS, ICON_VIEW_BOX, ICON_VIEW_BOX_SIZE } from '../constants';
import type { IIconProps } from '../interfaces';

const BooksIconBase: React.FC<IIconProps> = ({
  size = ICON_VIEW_BOX_SIZE,
  color = COLORS.WHITE,
  strokeWidth = ICON_STROKE_WIDTHS.BOOKS,
}: IIconProps): React.JSX.Element => {
  return (
    <Svg width={size} height={size} viewBox={ICON_VIEW_BOX} fill="none">
      <Rect
        x={4}
        y={4.5}
        width={5}
        height={15.3}
        rx={2}
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <Rect
        x={9}
        y={4.5}
        width={5}
        height={15.3}
        rx={2}
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <Path
        d="M15.71 4.72L16.7 4.57A2 2 0 0 1 18.99 6.23L20.75 17.39A2 2 0 0 1 19.09 19.68L18.1 19.83A2 2 0 0 1 15.81 18.17L14.05 7.01A2 2 0 0 1 15.71 4.72Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </Svg>
  );
};

BooksIconBase.displayName = `${COMPONENT_NAMES.BOOKS_ICON}Base`;

const BooksIcon: React.NamedExoticComponent<IIconProps> = memo<IIconProps>(BooksIconBase);

BooksIcon.displayName = COMPONENT_NAMES.BOOKS_ICON;

export { BooksIcon };
