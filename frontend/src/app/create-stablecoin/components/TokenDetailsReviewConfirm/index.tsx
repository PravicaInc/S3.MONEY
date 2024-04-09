import { FC } from 'react';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { twMerge } from 'tailwind-merge';

import CheckedIcon from '@/../public/images/checked.svg?jsx';

import { Delimiter } from '@/Components/Delimiter';
import {
  WalletTransactionConfirmModal,
  WalletTransactionConfirmModalProps,
} from '@/Components/WalletTransactionConfirmModal';

import { PermissionsStableCoinData } from '@/app/create-stablecoin/components/AssignDefaultPermissions';
import { InitialStableCoinData } from '@/app/create-stablecoin/components/InitialDetails';
import { SupplyStableCoinData, SupplyTypes } from '@/app/create-stablecoin/components/SupplyDetails';

import { getShortAccountAddress, numberFormat } from '@/utils/string_formats';

interface NewStableCoinData extends InitialStableCoinData, SupplyStableCoinData, PermissionsStableCoinData {}

export interface TokenDetailsReviewConfirmProps extends Omit<WalletTransactionConfirmModalProps, 'header'> {
  stableCoinData: Partial<NewStableCoinData>,
}

export const TokenDetailsReviewConfirm: FC<TokenDetailsReviewConfirmProps> = ({
  stableCoinData: {
    name,
    ticker,
    icon,
    initialSupply,
    maxSupply,
    decimals,
    supplyType = SupplyTypes.Infinite,
    permissions,
  },
  ...props
}) => {
  const account = useCurrentAccount();

  return (
    <WalletTransactionConfirmModal
      header="Review Your Token Details"
      description="If you did not review your token details yet, make sure everything is in place before proceeding."
      additionContent={(
        <>
          {
            name && ticker && account?.address && (
              <div className="flex items-center gap-4 border border-borderPrimary p-4 rounded-xl mt-5">
                <div
                  className="min-w-12 min-h-12 rounded-full bg-seashell bg-no-repeat bg-center bg-cover"
                  style={{
                    backgroundImage: `url(${icon})`,
                  }}
                />
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-primary">
                      {ticker}
                    </span>
                    <span className="text-mistBlue text-sm">
                      {name}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-actionPrimary">
                    {getShortAccountAddress(account.address, 15)}
                  </p>
                </div>
              </div>
            )
          }
          {
            (initialSupply != undefined || maxSupply != undefined || decimals != undefined) && (
              <>
                <p className="font-semibold mt-3">
                  Supply details
                </p>
                <Delimiter className="mt-3 mb-4" />
                <div className="space-y-3">
                  {
                    initialSupply != undefined && (
                      <div className="flex items-center justify-between text-secondary text-sm">
                        <span>
                          Initial Supply
                        </span>
                        <span>
                          {numberFormat(`${initialSupply}`)}
                        </span>
                      </div>
                    )
                  }
                  {
                    maxSupply != undefined && (
                      <div className="flex items-center justify-between text-secondary text-sm">
                        <span>
                          Max Supply
                        </span>
                        <span>
                          {numberFormat(`${maxSupply}`)}
                        </span>
                      </div>
                    )
                  }
                  <div className="flex items-center justify-between text-secondary text-sm">
                    <span>
                      Supply Type
                    </span>
                    <span className="capitalize">
                      {supplyType}
                    </span>
                  </div>
                  {
                    decimals != undefined && (
                      <div className="flex items-center justify-between text-secondary text-sm">
                        <span>
                          Decimals
                        </span>
                        <span>
                          {numberFormat(`${decimals}`)}
                        </span>
                      </div>
                    )
                  }
                </div>
              </>
            )
          }
          {
            permissions?.length && (
              <>
                <p className="font-semibold mt-5">
                  Permissions
                </p>
                <Delimiter className="mt-3 mb-4" />
                <div className="space-y-4 relative">
                  <div
                    className="
                  h-full border-l border-l-lavenderGrey border-dashed
                  absolute bottom-0 left-[7px] z-0
                "
                  />
                  {
                    permissions.map(({ value, label, isActive }) => (
                      <div
                        key={value}
                        className="flex items-center gap-3 text-mistBlue text-sm font-medium bg-white relative z-10"
                      >
                        <div
                          className={twMerge(
                            'w-4 h-4 min-w-4 min-h-4 flex items-center justify-center rounded-full',
                            isActive ? 'bg-[#40C4AA]' : 'bg-red-100'
                          )}
                        >
                          {
                            isActive
                              ? <CheckedIcon className="[&>path]:stroke-white w-[8px] h-[8px]" />
                              : <FontAwesomeIcon icon={faXmark} className="text-red-400 w-[8px] h-[8px]" />
                          }
                        </div>
                        {label}
                      </div>
                    ))
                  }
                </div>
              </>
            )
          }
        </>
      )}
      {...props}
    />
  );
};
