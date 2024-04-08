import { useCurrentAccount, useSuiClientContext } from '@mysten/dapp-kit';
import { getFaucetHost, getFaucetRequestStatus, requestSuiFromFaucetV1 } from '@mysten/sui.js/faucet';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type FaucetRequestStatusType = 'INPROGRESS' | 'SUCCEEDED' | 'DISCARDED';

export const useRequestSuiTokens = () => {
  const account = useCurrentAccount();
  const suiClientContext = useSuiClientContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<FaucetRequestStatusType> => {
      if (account?.address && ['testnet', 'devnet', 'localnet'].includes(suiClientContext.network)) {
        const { task } = await requestSuiFromFaucetV1({
          host: getFaucetHost(suiClientContext.network as 'testnet' | 'devnet' | 'localnet'),
          recipient: account?.address,
        });

        if (task) {
          const currentStatus = await checkFaucetRequestStatus({
            host: getFaucetHost(suiClientContext.network as 'testnet' | 'devnet' | 'localnet'),
            taskId: task,
          });

          if (currentStatus === 'SUCCEEDED') {
            queryClient.invalidateQueries({
              queryKey: ['current-sui-balance', account?.address],
            });
          }

          return currentStatus;
        }
      }

      return Promise.resolve('DISCARDED');
    },
  });
};

async function checkFaucetRequestStatus({
  host, taskId }: {
  host: string;
  taskId: string;
}): Promise<FaucetRequestStatusType> {
  const { status: { status: faucetRequestStatus } } = await getFaucetRequestStatus({ host, taskId });

  switch (faucetRequestStatus) {
    case 'INPROGRESS':
      return new Promise(res => {
        setTimeout(
          () => res(checkFaucetRequestStatus({ host, taskId })),
          1000
        );
      });
    case 'SUCCEEDED':
    case 'DISCARDED':
      return faucetRequestStatus;
  }
}
