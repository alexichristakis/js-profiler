import type { FC } from "react";
import styles from "./Alert.module.scss";
import classNames from "classnames/bind";

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
      <div className={styles.title}>{title}</div>
      <span className={styles.message}>{message}</span>
    </div>
  );
};

export default Alert;
