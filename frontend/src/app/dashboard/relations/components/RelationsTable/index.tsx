'use client';

import { FC, HTMLAttributes, useMemo, useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { twMerge } from 'tailwind-merge';

import ChevronIcon from '@/../public/images/chevron.svg?jsx';
import EditPencilIcon from '@/../public/images/edit_pencil.svg?jsx';
import PlusIcon from '@/../public/images/plus.svg?jsx';
import SortingChevronIcon from '@/../public/images/sorting_chevron.svg?jsx';

import { Button } from '@/Components/Form/Button';
import { Loader } from '@/Components/Loader';

import { getShortAccountAddress } from '@/utils/string_formats';

import { Relation, useCreateRelation, useEditRelation } from '@/hooks/useRelations';
import { StableCoin } from '@/hooks/useStableCoinsList';

import { AllocatedAmountCell } from './components/AllocatedAmountCell';
import { BalanceCell } from './components/BalanceCell';
import { CreateRelationFormData, CreateRelationModal } from './components/CreateRelationModal';
import { EditRelationFormData, EditRelationModal } from './components/EditRelationModal';
import { LastAllocatedDateCell } from './components/LastAllocatedDateCell';

export interface RelationsTableProps extends HTMLAttributes<HTMLDivElement> {
  relationsList: Relation[];
  currentStableCoin: StableCoin;
  isFetching?: boolean;
}

export const RelationsTable: FC<RelationsTableProps> = ({
  relationsList,
  currentStableCoin,
  isFetching,
  className,
  ...props
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [showCreateRelationModal, setShowCreateRelationModal] = useState<boolean>(false);
  const [showEditRelationModal, setShowEditRelationModal] = useState<boolean>(false);
  const [editingRelation, setEditingRelation] = useState<Relation>();

  const createRelation = useCreateRelation(currentStableCoin.deploy_addresses.packageId);
  const editRelation = useEditRelation(currentStableCoin.deploy_addresses.packageId);

  const columns = useMemo<ColumnDef<Relation>[]>(
    () => [
      {
        accessorKey: 'label',
        id: 'name',
        header: 'Name',
        cell: info => info.getValue(),
        minSize: 0,
        size: 300,
      },
      {
        accessorKey: 'wallet_address',
        id: 'address',
        header: 'Address',
        cell: info => getShortAccountAddress(info.getValue() as string),
        enableSorting: false,
        minSize: 0,
        size: 160,
      },
      {
        accessorKey: 'wallet_address',
        id: 'allocated',
        header: 'Allocated',
        cell: info => (
          <AllocatedAmountCell
            accountAddress={info.getValue() as string}
            currentStableCoin={currentStableCoin}
          />
        ),
        enableSorting: false,
        minSize: 0,
        size: 194,
      },
      {
        accessorKey: 'wallet_address',
        id: 'balance',
        header: 'Balance',
        cell: info => (
          <BalanceCell
            accountAddress={info.getValue() as string}
            currentStableCoin={currentStableCoin}
          />
        ),
        enableSorting: false,
        minSize: 0,
        size: 194,
      },
      {
        accessorKey: 'wallet_address',
        id: 'last-allocation-date',
        header: 'Last Allocation Date',
        cell: info => (
          <LastAllocatedDateCell
            accountAddress={info.getValue() as string}
            currentStableCoin={currentStableCoin}
          />
        ),
        enableSorting: false,
        minSize: 0,
        size: 194,
      },
      {
        accessorKey: 'slug',
        id: 'actions',
        cell: info => (
          <button
            className="
              border border-borderPrimary h-7 w-7 rounded-md flex items-center justify-center cursor-pointer
              transition-all hover:bg-actionPrimary hover:border-actionSecondary hover:bg-opacity-10
            "
            onClick={() => {
              setShowEditRelationModal(true);
              setEditingRelation(relationsList.find(({ slug }) => slug === (info.getValue() as string)));
            }}
          >
            <EditPencilIcon />
          </button>
        ),
        enableSorting: false,
        minSize: 64,
        size: 64,
        maxSize: 64,
      },
    ],
    [currentStableCoin, relationsList]
  );

  const table = useReactTable({
    data: relationsList,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  const onCreateRelation = async ({ label, walletAddress }: CreateRelationFormData) => {
    await createRelation.mutateAsync({
      label,
      walletAddress,
    });

    setShowCreateRelationModal(false);
  };

  const onEditRelation = async ({ label }: EditRelationFormData) => {
    if (editingRelation?.slug) {
      await editRelation.mutateAsync({
        relationSlug: editingRelation?.slug,
        label,
      });

      setShowEditRelationModal(false);
    }
  };

  return (
    <div
      className={twMerge(
        'border border-borderPrimary rounded-xl bg-white',
        isFetching && 'overflow-hidden',
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between h-[65px] px-5">
        <p className="text-primary text-lg font-semibold">
          Related Wallets:
        </p>
        <Button
          className="h-10 w-[182px] text-xs gap-[15px] [&>svg>*]:hover:stroke-actionPrimary"
          onClick={() => setShowCreateRelationModal(true)}
        >
          <PlusIcon />
          Add New Relationship
        </Button>
      </div>
      <table className="w-full text-left relative">
        {
          isFetching && (
            <span
              className="absolute w-full h-full top-0 flex items-center justify-center bg-black bg-opacity-40"
            >
              <Loader className="h-8" />
            </span>
          )
        }
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  className="bg-[#F8F9FB] py-[11px] px-4 border-t border-borderPrimary"
                  style={{
                    width: `${header.column.getSize()}px`,
                  }}
                >
                  <div
                    className={twMerge(
                      'text-xs !font-medium text-bluishGrey flex items-center gap-3',
                      header.column.getCanSort() && 'cursor-pointer select-none'
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: <ChevronIcon className="[&>*]:stroke-bluishGrey rotate-180" />,
                      desc: <ChevronIcon className="[&>*]:stroke-bluishGrey" />,
                    }[header.column.getIsSorted() as string] ?? (
                      header.column.getCanSort()
                        ? <SortingChevronIcon />
                        : null
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table
            .getRowModel()
            .rows.slice(0, 10)
            .map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    className="text-primary text-sm font-medium px-4 py-[18px] border-t border-borderPrimary"
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
      <CreateRelationModal
        visible={showCreateRelationModal}
        onClose={() => setShowCreateRelationModal(false)}
        inProcess={createRelation.isPending}
        onProceed={onCreateRelation}
        excludeNames={relationsList.map(({ label }) => label.toLowerCase())}
      />
      <EditRelationModal
        visible={showEditRelationModal}
        onClose={() => setShowEditRelationModal(false)}
        inProcess={editRelation.isPending}
        onProceed={onEditRelation}
        excludeNames={relationsList.map(({ label }) => label.toLowerCase())}
        defaultValues={editingRelation}
      />
    </div>
  );
};
