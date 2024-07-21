import { FC, HTMLAttributes } from "react";
import { useCurrentWallet } from "@mysten/dapp-kit";
import { LogoutButton } from "../LogoutButton";
import { useShortAccountAddress } from "../../hooks/useShortAccountAddress.ts";
import styles from "./styles.module.css";
import { AppLogo } from "../Logo";

export const AppHeader: FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  const shortAccountAddress = useShortAccountAddress();
  const { isConnected } = useCurrentWallet();

  return (
    <div
      className={`${styles.container} ${className}`}
      style={{ justifyContent: isConnected ? "space-between" : "center" }}
      {...props}
    >
      <AppLogo />
      {shortAccountAddress && <LogoutButton />}
    </div>
  );
};
