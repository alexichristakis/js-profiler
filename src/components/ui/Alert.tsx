import type { FC } from "react";
import styles from "./Alert.module.scss";
import classNames from "classnames/bind";
import AlertIcon from "icons/Alert";

const cx = classNames.bind(styles);

type AlertLevel = "error" | "warning";

export type AlertProps = {
  level: AlertLevel;
  title: string;
  message: string;
};

const Alert: FC<AlertProps> = ({ level, title, message }) => {
  return (
    <div className={cx("main", level)}>
      <AlertIcon className={styles.icon} />
      <div className={styles.content}>
        <div className={styles.title}>{title}</div>
        <span className={styles.message}>{message}</span>
      </div>
    </div>
  );
};

export default Alert;
