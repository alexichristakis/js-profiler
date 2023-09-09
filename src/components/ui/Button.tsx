import { FC, PropsWithChildren } from "react";
import styles from "./Button.module.scss";

export type ButtonProps = {
  disabled?: boolean;
  onClick?: () => void;
};

const Button: FC<PropsWithChildren<ButtonProps>> = ({
  children,
  disabled = false,
  onClick,
}) => {
  return (
    <button
      className={styles.main}
      disabled={disabled}
      type="button"
      onClick={onClick}
    >
      <div className={styles.inner}>
        <div className={styles.face}>{children}</div>
      </div>
    </button>
  );
};

export default Button;
