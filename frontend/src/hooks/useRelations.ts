import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { ApiManager } from '@/services/api';

const relationsApi = new ApiManager(
  process.env.NEXT_PUBLIC_API_DOMAIN as string,
  '/related'
);

export interface Relation {
  slug: string;
  label: string;
  wallet_address: string;
}

export interface relationsListApiGetByKeyResponse {
  status: 'ok';
  related: Relation[];
}

const getRelationsList = async (stableCoinPackageID: string): Promise<Relation[]> => {
  const { related } = await relationsApi.getByKey(stableCoinPackageID)
    .then((response: AxiosResponse<relationsListApiGetByKeyResponse>) => response.data);

  return related;
};

export const useRelationsList = (stableCoinPackageID: string | undefined) => useQuery<Relation[]>({
  queryKey: ['use-relations-list', stableCoinPackageID],
  queryFn: () => stableCoinPackageID
    ? getRelationsList(stableCoinPackageID)
    : Promise.resolve([]),
  staleTime: 60 * 1000,
});

export const useCreateRelation = (stableCoinPackageID: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      label,
      walletAddress,
    }: {
      label: string,
      walletAddress: string,
    }): Promise<void> => {
      await relationsApi.setUrl(`/related/${stableCoinPackageID}`).post({
        label,
        address: walletAddress,
      });

      queryClient.invalidateQueries({
        queryKey: ['use-relations-list', stableCoinPackageID],
      });
    },
  });
};

export const useEditRelation = (stableCoinPackageID: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      relationSlug,
      label,
    }: {
      relationSlug: string,
      label: string,
    }): Promise<void> => {
      await relationsApi.setUrl(`/related/${stableCoinPackageID}`).patch(relationSlug, {
        label,
      });

      queryClient.invalidateQueries({
        queryKey: ['use-relations-list', stableCoinPackageID],
      });
    },
  });
};
