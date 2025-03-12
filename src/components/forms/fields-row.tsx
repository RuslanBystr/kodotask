import { Children, ReactNode } from 'react';

export const FieldsRow = (props: { children: ReactNode }) => (
  <div className="flex justify-between space-x-1 w-full">
    {/* eslint-disable-next-line react/destructuring-assignment */}
    {Children.map(props.children, (child) => (
      <div className="flex-1 min-w-auto]">{child}</div>
    ))}
  </div>
);
