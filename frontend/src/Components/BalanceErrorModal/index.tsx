import { FC, useCallback, useState } from 'react';
import { useSuiClientContext } from '@mysten/dapp-kit';

import { Button, BUTTON_VIEWS } from '@/Components/Form/Button';
import { Modal, ModalProps } from '@/Components/Modal';

import { useRequestSuiTokens } from '@/hooks/useRequestSuiTokens';

export interface BalanceErrorModalProps extends ModalProps {}

export const BalanceErrorModal: FC<BalanceErrorModalProps> = ({
  onClose,
  ...props
}) => {
  const suiClientContext = useSuiClientContext();
  const requestSuiTokens = useRequestSuiTokens();

  const [requestSuiTokensSuccess, setRequestSuiTokensSuccess] = useState<boolean>(false);
  const [requestSuiTokensError, setRequestSuiTokensError] = useState<boolean>(false);

  const requestToken = useCallback(
    async () => {
      const faucetRequestStatus = await requestSuiTokens.mutateAsync();

      setRequestSuiTokensSuccess(faucetRequestStatus === 'SUCCEEDED');
      setRequestSuiTokensError(faucetRequestStatus === 'DISCARDED');
    },
    [requestSuiTokens]
  );

  return (
    <Modal
      onClose={onClose}
      className="p-6 w-[520px]"
      {...props}
    >
      <p className="text-primary font-semibold text-2xl text-center mt-4">
        Your balance is too low
      </p>
      <p className="text-sm text-grayText mt-3 text-center">
        Unfortunately, your balance is too small to create a new StableCoin.
        {
          requestSuiTokensError && (
            <>
              <br />
              <span className="text-error">
                Something went wrong, and we were unable to complete your request. Please try again.
              </span>
            </>
          )
        }
      </p>
      <div className="grid grid-cols-4 items-center justify-center gap-4 mt-8">
        <Button
          className="h-[56px] col-span-1"
          view={BUTTON_VIEWS.secondary}
          onClick={onClose}
        >
          Close
        </Button>
        {
          ['testnet', 'devnet'].includes(suiClientContext.network) && (
            <Button
              className="h-[56px] col-span-3"
              onClick={requestToken}
              disabled={requestSuiTokens.isPending || requestSuiTokens.isSuccess}
              isLoading={requestSuiTokens.isPending}
            >
              {
                requestSuiTokensSuccess
                  ? (
                    <>
                      {
                        suiClientContext.network === 'testnet'
                          ? 1
                          : 10
                      }
                      {' '}
                      SUI received
                    </>
                  )
                  : (
                    <>
                      Request
                      {' '}
                      <span className="capitalize">
                        {suiClientContext.network}
                      </span>
                      {' '}
                      SUI Tokens
                    </>
                  )
              }
            </Button>
          )
        }
      </div>
    </Modal>
  );
};
