import { FC, useEffect, useState } from "react";
import styles from "./styles.module.css";
import { AppLogo } from "../Logo";

const Loading: FC = () => {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent((prevState) => prevState + 1);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      <AppLogo />
      <div className={styles.loading}>
        <div
          className={styles.loadingInner}
          style={{
            width: `${percent}%`,
          }}
        />
      </div>
    </div>
  );
};

export default Loading;
