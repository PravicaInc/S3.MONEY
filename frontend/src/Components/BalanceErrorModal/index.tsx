import { FC, useCallback, useState } from 'react';
import { useSuiClientContext } from '@mysten/dapp-kit';

import AlertIcon from '@/../public/images/alert_icon.svg?jsx';
import BackgroundModalDecorativeIcon from '@/../public/images/background_modal_decorative_left.svg?jsx';

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
      className="relative p-6 w-[480px]"
      {...props}
    >
      <div className="absolute top-0 left-0 z-[-1]">
        <BackgroundModalDecorativeIcon />

        <div className="absolute top-6 left-6 bg-mistyRose w-12 h-12 flex items-center justify-center rounded-full">
          <AlertIcon />
        </div>
      </div>
      <p className="text-primary text-lg font-semibold mt-16">
        Your balance is too low
      </p>
      <p className="mt-1 text-secondary">
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
                      <span className="capitalize px-1">
                        {suiClientContext.network}
                      </span>
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
