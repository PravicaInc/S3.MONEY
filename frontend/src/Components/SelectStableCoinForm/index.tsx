import React, { ChangeEvent, FC, HTMLAttributes, useCallback, useMemo, useState } from 'react';
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

import SearchIcon from '@/../public/images/search.svg?jsx';

import { Delimiter } from '@/Components/Delimiter';
import { Button } from '@/Components/Form/Button';
import { SimpleInput } from '@/Components/Form/Input';

import { StableCoinItem } from './components/StableCoinItem';

export interface SelectStableCoinFormProps extends HTMLAttributes<HTMLDivElement> {}

export const SelectStableCoinForm: FC<SelectStableCoinFormProps> = ({ className, ...props }) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedStableCoin, setSelectedStableCoin] = useState<StableCoinItem | null>();
  const [stableCoins, setStableCoins] = useState<StableCoinItem[]>([
    {
      name: '$PRV',
      tokenName: 'Pravica Token',
      icon: <FontAwesomeIcon icon={faCoins} />,
      selected: false,
    },
    {
      name: 'SSS',
      tokenName: 'S3 Money Token',
      selected: false,
    },
  ]);

  const filteredStableCoins = useMemo(
    () => stableCoins.filter(coin => stableCoinMatchesSearch(coin, searchValue)),
    [stableCoins, searchValue]
  );

  const changeSearchValue = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;

      setSearchValue(newValue);

      if (selectedStableCoin && !stableCoinMatchesSearch(selectedStableCoin, newValue)) {
        selectStableCoin(null);
      }
    },
    [selectedStableCoin]
  );

  return (
    <div
      className={twMerge('bg-white shadow-stableCoinForm rounded-xl', className)}
      {...props}
    >
      <div className="px-6 py-5 flex items-center justify-between border-b border-borderPrimary">
        <span className="text-lg font-semibold text-primary">
          Select Stablecoin
        </span>
        <Link href="#" className="rounded-xl">
          <Button className="text-sm font-semibold h-[37px] w-[153px]">
            + New Stablecoin
          </Button>
        </Link>
      </div>
      <div className="p-6 space-y-6">
        <SimpleInput
          className="w-full"
          value={searchValue}
          onChange={changeSearchValue}
          placeholder="Search..."
          icon={<SearchIcon />}
        />
        <Delimiter />
        <div className="space-y-3">
          {
            filteredStableCoins.map(item => (
              <StableCoinItem
                key={item.name}
                stableCoinItem={item}
                onClick={() => selectStableCoin(item)}
              />
            ))
          }
        </div>
        <Button
          className="w-full h-[37px] text-sm font-semibold"
          disabled={!selectedStableCoin}
        >
          Manage Stablecoin
        </Button>
      </div>
    </div>
  );

  function selectStableCoin(stableCoin: StableCoinItem | null) {
    setSelectedStableCoin(stableCoin);
    setStableCoins(currentValue => currentValue.map(coin => ({
      ...coin,
      selected: coin.name === stableCoin?.name,
    })));
  }

  function stableCoinMatchesSearch(stableCoin: StableCoinItem, search: string) {
    return stableCoin.name.toLowerCase().includes(search)
      || stableCoin.tokenName.toLowerCase().includes(search);
  }
};
