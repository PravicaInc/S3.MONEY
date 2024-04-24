import { FC, HTMLAttributes } from 'react';

export const ProjectVersion: FC<HTMLAttributes<HTMLDivElement>> = props => (
  <div
    {...props}
  >
    v
    {process.env.npm_package_version}
  </div>
);
