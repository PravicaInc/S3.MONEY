import { FC, Fragment, HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

import { Delimiter } from '@/Components/Delimiter';

import { ProgressStep, ProgressStepItem } from './components/ProgressStep';

export interface ProgressStepsProps extends HTMLAttributes<HTMLDivElement> {
  steps: Omit<ProgressStepItem, 'number'>[];
}

export const ProgressSteps: FC<ProgressStepsProps> = ({ steps, className, ...props }) => (
  <div
    className={twMerge('flex items-center gap-10', className)}

    {...props}
  >
    {
      steps.map(({ text, isActive }, idx) => (
        <Fragment key={`${idx}-${text}`}>
          {
            idx !== 0 && (
              <Delimiter
                className={twMerge('w-16 h-[2px]', isActive && 'bg-actionSecondary')}
              />
            )
          }
          <ProgressStep
            number={idx + 1}
            text={text}
            isActive={isActive}
          />
        </Fragment>
      ))
    }
  </div>
);
