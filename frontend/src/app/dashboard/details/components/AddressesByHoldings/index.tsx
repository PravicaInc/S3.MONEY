import React, { FC, HTMLAttributes, useMemo, useState } from 'react';
import moment from 'moment';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { twMerge } from 'tailwind-merge';

import { Loader } from '@/Components/Loader';
import { PeriodSelector } from '@/Components/PeriodSelector';

import { StableCoinEventObject, useStableCoinEvents } from '@/hooks/useStableCoinEvents';
import { StableCoin } from '@/hooks/useStableCoinsList';

export interface AddressesByHoldingsProps extends HTMLAttributes<HTMLDivElement> {
  stableCoinItem: StableCoin;
}

enum Periods {
  day = 'day',
  five_days = 'five_days',
  month = 'month',
  all = 'all',
}

export const AddressesByHoldings: FC<AddressesByHoldingsProps> = ({
  stableCoinItem,
  className,
  ...props
}) => {
  const {
    data: stableCoinEvents = [],
    isLoading: isStableCoinEventsLoading,
  } = useStableCoinEvents(
    stableCoinItem,
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const [selectedPeriod, setSelectedPeriod] = useState<Periods>(Periods.month);

  const filteredTransactions = useMemo<StableCoinEventObject[]>(
    () => {
      const datePeriods = {
        [Periods.day]: Date.now() - moment().startOf('day')
          .valueOf(),
        [Periods.five_days]: Date.now() - moment().day(moment().day() - 4)
          .startOf('day')
          .valueOf(),
        [Periods.month]: Date.now() - moment().month(moment().month() - 1)
          .startOf('day')
          .valueOf(),
        [Periods.all]: Date.now(),
      };

      return stableCoinEvents
        .filter(({ timestampMs }) => parseInt(timestampMs) >= (Date.now() - datePeriods[selectedPeriod]));
    },
    [stableCoinEvents, selectedPeriod]
  );
  const { areaChartData, pieChartData } = useMemo<{
    areaChartData: {
      label: string;
      value1: number;
      value2: number;
    }[];
    pieChartData: {
      small: number;
      medium: number;
      large: number;
      all: number;
    },
  }>(
    () => {
      const pieData = {
        small: filteredTransactions
          .map(({ parsedJson: { amount } }) => parseFloat(amount || '0'))
          .filter(amount => amount <= 1e3)
          .reduce((current, next) => current + next, 0),
        medium: filteredTransactions
          .map(({ parsedJson: { amount } }) => parseFloat(amount || '0'))
          .filter(amount => amount > 1e3 && amount <= 1e5)
          .reduce((current, next) => current + next, 0),
        large: filteredTransactions
          .map(({ parsedJson: { amount } }) => parseFloat(amount || '0'))
          .filter(amount => amount > 1e5)
          .reduce((current, next) => current + next, 0),
        all: filteredTransactions
          .map(({ parsedJson: { amount } }) => parseFloat(amount || '0'))
          .reduce((current, next) => current + next, 0) || 1,
      };
      const areaData = filteredTransactions
        .map(({ timestampMs }) => ({
          label: moment(parseInt(timestampMs)).format(),
          value1: 1 + (Math.random() > 0.5 ? 1 : -1) * Math.round(Math.random() * Math.random() * 100) / 100,
          value2: 1 + (Math.random() > 0.5 ? 1 : -1) * Math.round(Math.random() * Math.random() * 100) / 100,
        }));

      return {
        areaChartData: areaData,
        pieChartData: pieData,
      };
    },
    [filteredTransactions]
  );

  return (
    <div
      className={twMerge(
        'border border-borderPrimary rounded-xl bg-white',
        className
      )}
      {...props}
    >
      <div className="p-5 border-b border-borderPrimary flex items-center justify-between">
        <p className=" text-primary text-lg font-semibold">
          Addresses by holdings
        </p>
        <PeriodSelector
          selectedPeriod={selectedPeriod}
          periods={[
            {
              id: Periods.day,
              label: '1D',
            },
            {
              id: Periods.five_days,
              label: '5D',
            },
            {
              id: Periods.month,
              label: '1M',
            },
            {
              id: Periods.all,
              label: 'ALL',
            },
          ]}
          onSelectPeriod={value => setSelectedPeriod(value as Periods)}
        />
      </div>
      {
        isStableCoinEventsLoading
          ? (
            <div className="m-5 h-[376px] flex items-center justify-center">
              <Loader className="h-8" />
            </div>
          )
          : (
            <div className="grid grid-cols-2 gap-6 p-5">
              <div className="-ml-6 -mb-3">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    width={500}
                    height={400}
                    data={areaChartData}
                  >
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="3%" stopColor="#FE6321" stopOpacity={0.8} />
                        <stop offset="97%" stopColor="#FE6321" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      content={({ payload }) => {
                        if (payload?.length) {
                          const date = moment(payload[0].payload.label);
                          const value1 = payload[0].payload.value1;
                          const value2 = payload[0].payload.value2;

                          return (
                            <div
                              className="flex items-center gap-6 p-2 border border-borderPrimary bg-white rounded-md"
                            >
                              <p className="text-xs text-mistBlue">
                                {date.format('MMM DD')}
                              </p>
                              <div className="text-xs font-semibold text-right space-y-1">
                                <p className="text-actionPrimary">
                                  {value1}
                                </p>
                                <p className="text-primary">
                                  {value2}
                                </p>
                              </div>
                            </div>
                          );
                        }

                        return null;
                      }}
                    />
                    <Area type="monotone" dataKey="value1" stroke="#FE6321" fill="url(#colorValue)" />
                    <Area type="monotone" dataKey="value2" stroke="#0D0D12" fill="none" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-snowDrift p-6 rounded-[10px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 bg-actionPrimary rounded-full" />
                    <div>
                      <p className="text-tuna text-sm">
                        0-1K
                        {' '}
                        {stableCoinItem.ticker}
                      </p>
                      <p className="text-primary font-medium mt-[2px]">
                        {Math.round(pieChartData.small / pieChartData.all * 100 * 10) / 10}
                        %
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 bg-primary rounded-full" />
                    <div>
                      <p className="text-tuna text-sm">
                        1K-100K
                        {' '}
                        {stableCoinItem.ticker}
                      </p>
                      <p className="text-primary font-medium mt-[2px]">
                        {Math.round(pieChartData.medium / pieChartData.all * 100 * 10) / 10}
                        %
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 bg-borderPrimary rounded-full" />
                    <div>
                      <p className="text-tuna text-sm">
                        100K+
                        {' '}
                        {stableCoinItem.ticker}
                      </p>
                      <p className="text-primary font-medium mt-[2px]">
                        {Math.round(pieChartData.large / pieChartData.all * 100 * 10) / 10}
                        %
                      </p>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div
                    className="
                      absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                      rounded-full w-[244px] h-[244px] bg-gray-100
                      after:contents-[''] after:w-[180px] after:h-[180px] after:bg-snowDrift after:rounded-full
                      after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2
                    "
                  />
                  <PieChart width={254} height={254} className="mx-auto mt-6 -mb-2">
                    <Pie
                      data={[
                        { name: `0-1K ${stableCoinItem.ticker}`, value: pieChartData.small },
                        { name: `1K-100K ${stableCoinItem.ticker}`, value: pieChartData.medium },
                        { name: `100K+ ${stableCoinItem.ticker}`, value: pieChartData.large },
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
                      <Cell fill="#0D0D12" />
                      <Cell fill="#DFE1E6" />
                    </Pie>
                  </PieChart>
                </div>
              </div>
            </div>
          )
      }
    </div>
  );
};
