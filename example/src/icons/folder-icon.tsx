import * as React from 'react';
import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

import { COLORS, COMPONENT_NAMES, ICON_STROKE_WIDTHS, ICON_VIEW_BOX, ICON_VIEW_BOX_SIZE } from '../constants';
import type { IIconProps } from '../interfaces';

const FolderIconBase: React.FC<IIconProps> = ({
  size = ICON_VIEW_BOX_SIZE,
  color = COLORS.WHITE,
  strokeWidth = ICON_STROKE_WIDTHS.FOLDER,
}: IIconProps): React.JSX.Element => {
  return (
    <Svg width={size} height={size} viewBox={ICON_VIEW_BOX} fill="none">
      <Path
        d="M3.7 11.3H20.5M3.7 7.2A2.5 2.5 0 0 1 6.2 4.7H8.9C9.9 4.7 10.3 6.3 11.6 6.3H18A2.5 2.5 0 0 1 20.5 8.8V17.2A2.5 2.5 0 0 1 18 19.7H6.2A2.5 2.5 0 0 1 3.7 17.2Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

FolderIconBase.displayName = `${COMPONENT_NAMES.FOLDER_ICON}Base`;

const FolderIcon: React.NamedExoticComponent<IIconProps> = memo<IIconProps>(FolderIconBase);

FolderIcon.displayName = COMPONENT_NAMES.FOLDER_ICON;

export { FolderIcon };
