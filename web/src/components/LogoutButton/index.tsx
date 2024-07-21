import { ButtonHTMLAttributes, FC, useCallback } from "react";
import { useCurrentAccount, useCurrentWallet, useDisconnectWallet } from "@mysten/dapp-kit";
import LogoutIcon from "../../assets/logout.svg?react";
import { useShortAccountAddress } from "../../hooks/useShortAccountAddress.ts";
import { PAGES_URLS } from "../../utils/const.ts";
import { LogoutModal } from "../LogoutModal";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { Typography } from "../Typography";
import { Avatar } from "../Avatar";

export const LogoutButton: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({ className, ...props }) => {
  const navigate = useNavigate();

  const account = useCurrentAccount();
  const { currentWallet, connectionStatus } = useCurrentWallet();
  const shortAccountAddress = useShortAccountAddress();
  const disconnectWallet = useDisconnectWallet();

  const disconnect = useCallback(async () => {
    await disconnectWallet.mutateAsync();

    navigate(`${PAGES_URLS.home}`);
  }, [disconnectWallet]);

  return (
    <>
      {shortAccountAddress && (
        <LogoutModal inProcess={connectionStatus === "disconnected"} onProceed={disconnect}>
          {({ showModal }) => (
            <button className={`${styles.button} ${className}`} onClick={showModal} {...props}>
              <Avatar
                src={account?.icon || currentWallet?.icon}
                initials={{ text: account?.label || shortAccountAddress }}
              />
              <Typography style={{ color: "inherit" }} type={"t_sm-500"}>
                {account?.label || shortAccountAddress}
              </Typography>
              <LogoutIcon />
            </button>
          )}
        </LogoutModal>
      )}
    </>
  );
};
