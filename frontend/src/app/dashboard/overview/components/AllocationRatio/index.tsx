import React, { FC, HTMLAttributes } from 'react';
import { Cell, Pie, PieChart } from 'recharts';
import { twMerge } from 'tailwind-merge';

import { Loader } from '@/Components/Loader';

import { numberFormat } from '@/utils/string_formats';

import { useCurrentAllocated } from '@/hooks/useAllocate';
import { StableCoin } from '@/hooks/useStableCoinsList';
import { useStableCoinCurrentSupply } from '@/hooks/useStableCoinSupply';

export interface AllocationRatioProps extends HTMLAttributes<HTMLDivElement> {
  stableCoinItem: StableCoin;
}

export const AllocationRatio: FC<AllocationRatioProps> = ({
  stableCoinItem,
  className,
  ...props
}) => {
  const {
    data: stableCoinCurrentSupply = 0,
    isLoading: isStableCoinCurrentSupplyLoading,
  } = useStableCoinCurrentSupply(stableCoinItem);
  const {
    data: stableCoinCurrentAllocated = 0,
    isLoading: isStableCoinCurrentAllocatedLoading,
  } = useCurrentAllocated(
    stableCoinItem,
    [stableCoinItem.deploy_addresses.deployer]
  );

  return (
    <div
      className={twMerge(
        'border border-borderPrimary rounded-xl bg-white',
        className
      )}
      {...props}
    >
      <p className="p-5 text-primary text-lg font-semibold border-b border-borderPrimary">
        Allocation Ratio
      </p>
      {
        isStableCoinCurrentSupplyLoading || isStableCoinCurrentAllocatedLoading
          ? (
            <div className="m-5 h-[376px] flex items-center justify-center">
              <Loader className="h-8" />
            </div>
          )
          : (
            <div className="m-5 bg-snowDrift p-6 rounded-[10px]">
              <PieChart width={254} height={254} className="mx-auto mb-7">
                <Pie
                  data={[
                    { name: 'Allocated', value: stableCoinCurrentAllocated },
                    { name: 'Not Allocated', value: stableCoinCurrentSupply - stableCoinCurrentAllocated },
                  ]}
                  cx={122}
                  cy={122}
                  innerRadius={90}
                  outerRadius={122}
                  fill="green"
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  <Cell fill="#FE6321" />
                  <Cell fill="#DFE1E6" />
                </Pie>
              </PieChart>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 bg-actionPrimary rounded-full" />
                  <div>
                    <p className="text-tuna text-sm">
                      Allocated
                    </p>
                    <p className="text-primary font-medium mt-[2px]">
                      {numberFormat(`${stableCoinCurrentAllocated}`)}
                      {' '}
                      {stableCoinItem.ticker}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 bg-lavenderGrey rounded-full" />
                  <div>
                    <p className="text-tuna text-sm">
                      Not Allocated
                    </p>
                    <p className="text-primary font-medium mt-[2px]">
                      {numberFormat(`${stableCoinCurrentSupply - stableCoinCurrentAllocated}`)}
                      {' '}
                      {stableCoinItem.ticker}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
      }
    </div>
  );
};
