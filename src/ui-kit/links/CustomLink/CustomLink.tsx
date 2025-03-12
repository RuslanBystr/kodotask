import { FC } from 'react';
import type { LinkProps } from 'react-router-dom';
import { Link } from 'react-router-dom';

export const CustomLink: FC<LinkProps> = ({ style = {}, ...props }) => (
  <Link
    style={{
      color: 'green',
      fontStyle: 'bold',
      ...style,
    }}
    {...props}
  />
);
