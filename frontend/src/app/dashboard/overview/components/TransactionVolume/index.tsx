import { FC, HTMLAttributes, useMemo, useState } from 'react';
import moment from 'moment';
import { Bar, BarChart, CartesianGrid, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { twMerge } from 'tailwind-merge';

import { Loader } from '@/Components/Loader';
import { PeriodSelector } from '@/Components/PeriodSelector';

import { numberFormat } from '@/utils/string_formats';

import { StableCoinEventObject, useStableCoinEvents } from '@/hooks/useStableCoinEvents';
import { StableCoin } from '@/hooks/useStableCoinsList';

export interface TransactionVolumeProps extends HTMLAttributes<HTMLDivElement> {
  stableCoinItem: StableCoin;
}

enum Periods {
  day = 'day',
  week = 'week',
  month = 'month',
  six_months = 'six_months',
}

export const TransactionVolume: FC<TransactionVolumeProps> = ({
  stableCoinItem,
  className,
  ...props
}) => {
  const {
    data: stableCoinEvents = [],
    isLoading: isStableCoinEventsLoading,
  } = useStableCoinEvents(stableCoinItem);

  const [selectedPeriod, setSelectedPeriod] = useState<Periods>(Periods.month);

  const filteredTransactions = useMemo<StableCoinEventObject[]>(
    () => {
      const datePeriods = {
        [Periods.day]: Date.now() - moment().startOf('day')
          .valueOf(),
        [Periods.week]: Date.now() - moment().day(moment().day() - 6)
          .startOf('day')
          .valueOf(),
        [Periods.month]: Date.now() - moment().month(moment().month() - 1)
          .startOf('day')
          .valueOf(),
        [Periods.six_months]: Date.now() - moment().month(moment().month() - 5)
          .startOf('day')
          .startOf('month')
          .valueOf(),
      };

      return stableCoinEvents
        .filter(({ timestampMs }) => parseInt(timestampMs) >= (Date.now() - datePeriods[selectedPeriod]));
    },
    [stableCoinEvents, selectedPeriod]
  );
  const chartData = useMemo<{
    label: string;
    value: number;
  }[]>(
    () => {
      switch (selectedPeriod) {
        case Periods.day:
          return (new Array(moment().hour() + 1))
            .fill(0)
            .map((_, idx) => {
              const date = moment().hours(idx)
                .minute(0);

              return {
                label: date.format('HH:mm'),
                value: filteredTransactions.filter(({ timestampMs }) => parseInt(timestampMs) <= date.valueOf()).length,
              };
            });
        case Periods.week:
          return (new Array(7))
            .fill(0)
            .map((_, idx) => {
              const date = moment().day(moment().day() - 6 + idx)
                .hours(0)
                .minute(0);

              return {
                label: date.format('DD MMM'),
                value: filteredTransactions.filter(({ timestampMs }) => parseInt(timestampMs) <= date.valueOf()).length,
              };
            });
        case Periods.month:
          return (new Array(4))
            .fill(0)
            .map((_, idx) => {
              const startDate = moment().day(moment().day() - 7 * (4 - idx))
                .hours(0)
                .minute(0);
              const endDate = moment().day(moment().day() - 7 * (3 - idx))
                .hours(0)
                .minute(0);

              return {
                label: `${startDate.format('DD MMM')} - ${endDate.format('DD MMM')}`,
                value: filteredTransactions
                  .filter(({ timestampMs }) => parseInt(timestampMs) <= endDate.valueOf()).length,
              };
            });
        case Periods.six_months:
          return (new Array(6))
            .fill(0)
            .map((_, idx) => {
              const date = moment().month(moment().month() - 6 + idx + 1)
                .hours(0)
                .minute(0);

              return {
                label: date.format('MMM YYYY'),
                value: filteredTransactions.filter(({ timestampMs }) => parseInt(timestampMs) <= date.valueOf()).length,
                amt: 100,
              };
            });
        default:
          return [];
      }
    },
    [filteredTransactions, selectedPeriod]
  );

  return (
    <div
      className={twMerge(
        'border border-borderPrimary rounded-xl bg-white',
        className
      )}
      {...props}
    >
      <div className="px-5 pt-5 flex items-center justify-between">
        <p className="text-primary text-lg font-semibold">
          Transaction Volume
        </p>
        <PeriodSelector
          selectedPeriod={selectedPeriod}
          periods={[
            {
              id: Periods.day,
              label: '1D',
            },
            {
              id: Periods.week,
              label: '7D',
            },
            {
              id: Periods.month,
              label: '1M',
            },
            {
              id: Periods.six_months,
              label: '6M',
            },
          ]}
          onSelectPeriod={value => setSelectedPeriod(value as Periods)}
        />
      </div>
      {
        isStableCoinEventsLoading
          ? (
            <div className="m-5 h-[380px] flex items-center justify-center">
              <Loader className="h-8" />
            </div>
          )
          : (
            <div className="p-5 -ml-10 mt-5 h-[380px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  width={500}
                  height={300}
                  data={chartData}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip
                    cursor={false}
                    content={({ payload }) => {
                      const dataToShow = payload?.map(
                        ({ dataKey, payload: currentPayload }) => numberFormat(`${currentPayload[dataKey as string]}`)
                      );

                      return (
                        <div
                          className="text-white text-xs font-medium py-2 px-[5px] bg-black rounded-[5px] block"
                        >
                          {dataToShow?.join('')}
                        </div>
                      );
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill="#FFCDA8"
                    activeBar={<Rectangle stroke="#FFAA71" />}
                    radius={4}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )
      }
    </div>
  );
};
