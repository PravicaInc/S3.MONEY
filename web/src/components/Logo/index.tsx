import { FC } from "react";
import { useSuiClientContext } from "@mysten/dapp-kit";
import LogoIcon from "../../assets/logo.svg?react";
import { Link } from "react-router-dom";
import { PAGES_URLS } from "../../utils/const.ts";
import styles from "./styles.module.css";
import { Typography } from "../Typography";

export const AppLogo: FC = () => {
  const suiClientContext = useSuiClientContext();

  return (
    <Link className={styles.container} to={PAGES_URLS.home}>
      <LogoIcon />
      {["testnet", "devnet"].includes(suiClientContext.network) && (
        <Typography className={styles.text} style={{ color: "var(--base)" }} type={"t_xss-700"}>
          {suiClientContext.network}
        </Typography>
      )}
    </Link>
  );
};
