'use client';

import { FC, HTMLAttributes, ReactNode, useEffect, useRef, useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { twMerge } from 'tailwind-merge';

import CheckedIcon from '@/../public/images/checked.svg?jsx';
import ChevronIcon from '@/../public/images/chevron.svg?jsx';

import { Label } from '@/Components/Form/Label';

import { AddRolesModal } from './component/AddRolesModal';

export interface RolesDropdownProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  label: ReactNode;
  onChange: (value: string) => void;
  value?: string;
}

export const RolesDropdown: FC<RolesDropdownProps> = ({
  className,
  label,
  value,
  onChange,
  ...props
}) => {
  const rolesDropdownRef = useRef<HTMLDivElement>(null);

  const account = useCurrentAccount();

  const [accountOptions, setAccountOptions] = useState<string[]>(
    account?.address
      ? [account.address, value && value !== account.address ? value : ''].filter(Boolean)
      : []
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showAddRolesModal, setShowAddRolesModal] = useState<boolean>(false);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (rolesDropdownRef.current && !rolesDropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  });

  return (
    <>
      <Label
        label={label}
        className="mb-2"
      />
      <div
        ref={rolesDropdownRef}
        className="relative"
      >
        <div
          className={twMerge(
            'border border-borderPrimary py-[10px] px-[14px] rounded-lg cursor-pointer',
            'flex items-center justify-between transition-all',
            isOpen && 'border-pumpkinOrange shadow-rolesDropdownTriggerActive',
            className
          )}
          onClick={() => setIsOpen(!isOpen)}
          {...props}
        >
          <div className="text-sm font-medium space-x-2">
            {
              value === account?.address
                ? (
                  <span className="text-primary">
                    Current Account
                  </span>
                )
                : (
                  <span className="text-pumpkinOrange">
                    Another Account
                  </span>
                )
            }
            <span className="text-riverBed text-base font-normal">
              {value}
            </span>
          </div>
          <ChevronIcon />
        </div>
        <div
          className={twMerge(
            'border border-borderPrimary p-[5px] rounded-lg bg-white',
            'absolute w-[calc(100%+2px)] top-[calc(100%+4px)] left-[-1px] hidden z-50 shadow-rolesDropdown',
            isOpen && 'block'
          )}
        >
          {
            accountOptions.map(el => (
              <button
                key={el}
                type="button"
                className="
                  flex items-center justify-between w-full px-2 py-[10px]
                  cursor-pointer hover:bg-alabaster rounded-md
                "
                onClick={() => {
                  setIsOpen(false);
                  onChange(el);
                }}
              >
                <span className="text-sm font-medium space-x-2">
                  {
                    el === account?.address
                      ? (
                        <span className="text-primary">
                          Current Account
                        </span>
                      )
                      : (
                        <span className="text-pumpkinOrange">
                          Another Account
                        </span>
                      )
                  }
                  <span className="text-riverBed text-base font-normal">
                    {el}
                  </span>
                </span>
                {
                  value === el && (
                    <CheckedIcon className="[&>path]:stroke-[#7F56D9]" />
                  )
                }
              </button>
            ))
          }
          <button
            type="button"
            className="
              w-full px-2 py-[10px] cursor-pointer hover:bg-alabaster
              rounded-md text-left text-pumpkinOrange
            "
            onClick={() => {
              setShowAddRolesModal(true);
              setIsOpen(false);
            }}
          >
            + Assign another account
          </button>
        </div>
      </div>
      <AddRolesModal
        visible={showAddRolesModal}
        onClose={() => {
          setShowAddRolesModal(false);
          setIsOpen(false);
        }}
        onConfirmClick={(newAddress: string) => {
          setAccountOptions(currentAccountOptions => [...currentAccountOptions, newAddress]);
          onChange(newAddress);
          setShowAddRolesModal(false);
        }}
        addedAddresses={accountOptions}
      />
    </>
  );
};
