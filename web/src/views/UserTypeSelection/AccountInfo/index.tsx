import { FC } from "react";
import styles from "./styles.module.css";
import { Typography } from "../../../components/Typography";
import { USER_TYPE } from "../../../types";
import { USER_TYPE_INFO } from "./data.tsx";

interface IProps {
  selectedUserType: USER_TYPE;
}
export const AccountInfo: FC<IProps> = ({ selectedUserType }) => {
  const infos = USER_TYPE_INFO[selectedUserType];

  return (
    <div className={styles.wrapper}>
      <Typography type={`t_xl-500`}>See What Your Account Can Do</Typography>
      {infos.map((info) => (
        <div className={styles.card}>
          <div className={styles.info}>
            <div style={{ marginBottom: "1rem" }}>
              <Typography type={`t_lg-600`} style={{ color: "var(--gray_90)" }}>
                {info.title}
              </Typography>
            </div>
            <Typography type={`t_sm-400`} style={{ color: "var(--gray_60)" }}>
              {info.para}
            </Typography>
          </div>
          {info.icon}
        </div>
      ))}
    </div>
  );
};
