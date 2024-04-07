'use client';

import { FC, HTMLAttributes } from 'react';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { twMerge } from 'tailwind-merge';

import CheckedIcon from '@/../public/images/checked.svg?jsx';

import { Delimiter } from '@/Components/Delimiter';

import { PermissionsStableCoinData } from '@/app/create-stablecoin/components/AssignDefaultPermissions';
import { InitialStableCoinData } from '@/app/create-stablecoin/components/InitialDetails';
import { SupplyStableCoinData, SupplyTypes } from '@/app/create-stablecoin/components/SupplyDetails';

import { numberFormat } from '@/utils/string_formats';

interface StableCoinPreviewProps
  extends InitialStableCoinData, SupplyStableCoinData, PermissionsStableCoinData, HTMLAttributes<HTMLDivElement> {}

export const StableCoinPreview: FC<Partial<StableCoinPreviewProps>> = ({
  name,
  ticker,
  initialSupply,
  maxSupply,
  decimals,
  className,
  icon,
  supplyType = SupplyTypes.Infinite,
  permissions,
}) => (
  <div className={twMerge('bg-white border rounded-xl text-primary border-borderPrimary', className)}>
    <p className="text-lg font-semibold p-5 border-b border-borderPrimary">
      Preview Details
    </p>
    <div className="p-6 pt-5">
      <div
        className="w-12 h-12 rounded-full bg-seashell bg-no-repeat bg-center bg-cover"
        style={{
          backgroundImage: `url(${icon})`,
        }}
      />
      <p className="text-lg font-semibold mt-3">
        {name}
        {' '}
        (
        {ticker}
        )
      </p>
      {
        (initialSupply != undefined || maxSupply != undefined || decimals != undefined) && (
          <>
            <p className="font-semibold mt-5">
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
                    className="flex items-center gap-3 text-grayText text-sm font-medium bg-white relative z-10"
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
    </div>
  </div>
);
