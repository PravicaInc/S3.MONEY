'use client';

import { FC, HTMLAttributes, ReactNode, useCallback, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import CheckedIcon from '@/../public/images/checked.svg?jsx';
import CloseIcon from '@/../public/images/close.svg?jsx';
import QuestionIcon from '@/../public/images/question.svg?jsx';

import { Button, BUTTON_VIEWS } from '@/Components/Form/Button';
import { Loader } from '@/Components/Loader';
import { Tooltip } from '@/Components/Tooltip';

export interface InstructionBlockProps extends HTMLAttributes<HTMLDivElement> {
  header: ReactNode;
  tooltipHeader: ReactNode;
  tooltipDescription?: ReactNode;
  tooltipButtonText: ReactNode;
  onTooltipButtonClick: () => Promise<unknown> | void;
  inProgress?: boolean;
  isDone?: boolean;
}

export const InstructionBlock: FC<InstructionBlockProps> = ({
  header,
  tooltipHeader,
  tooltipDescription,
  tooltipButtonText,
  onTooltipButtonClick,
  className,
  inProgress,
  isDone: defaultIsDone = false,
  ...props
}) => {
  const [isDone, setIsDone] = useState<boolean>(defaultIsDone);

  const onButtonClick = useCallback(
    async () => {
      await Promise.resolve().then(onTooltipButtonClick);
      setIsDone(true);
    },
    [onTooltipButtonClick]
  );

  useEffect(
    () => {
      if (defaultIsDone && !isDone) {
        setIsDone(defaultIsDone);
      }
    },
    [defaultIsDone, isDone]
  );

  return (
    <div
      className={twMerge(
        'border border-borderPrimary p-5 rounded-xl bg-white flex items-center justify-between',
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3 text-sm font-medium text-[#15161E]">
        <QuestionIcon />
        <p>
          {header}
        </p>
      </div>
      <Tooltip
        placement="bottom"
        trigger={['hover']}
        showArrow={false}
        visible={isDone ? false : undefined}
        overlayClassName={`
          w-[320px] opacity-100
          [&>div:first-child]:border-t-deepSapphire [&>div>[role="tooltip"]]:border-deepSapphire [&>div>[role="tooltip"]]:bg-deepSapphire
          [&>div>[role="tooltip"]]:bg-opacity-100
          [&>div:first-child]:translate-x-0
          [&>div:first-child]:translate-y-0
          [&>div>[role="tooltip"]]:text-white
        `}
        overlay={(
          <>
            <p className="text-xs font-semibold">
              {tooltipHeader}
            </p>
            <p className="text-xs font-medium mt-1">
              {tooltipDescription}
            </p>
            <Button
              view={BUTTON_VIEWS.secondary}
              onClick={onButtonClick}
              className="mt-1 h-9 w-full"
              isLoading={inProgress}
              disabled={inProgress}
            >
              {tooltipButtonText}
            </Button>
          </>
        )}
      >
        {
          inProgress
            ? (
              <Loader className="w-[18px]" />
            )
            : (
              <div
                className={twMerge(
                  'w-[18px] h-[18px] rounded-full flex items-center justify-center',
                  isDone ? 'bg-[#66C61C]' : 'bg-error'
                )}
              >
                {
                  isDone
                    ? <CheckedIcon className="[&>path]:stroke-white w-[9px]" />
                    : <CloseIcon className="[&>path]:stroke-white w-[7px]" />
                }
              </div>
            )
        }
      </Tooltip>
    </div>
  );
};
