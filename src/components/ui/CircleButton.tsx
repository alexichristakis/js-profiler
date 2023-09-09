import { FC, PropsWithChildren } from "react";
import styles from "./CircleButton.module.scss";

export type CircleButtonProps = {
  disabled?: boolean;
  onClick?: () => void;
  color: string;
};

const CircleButton: FC<PropsWithChildren<CircleButtonProps>> = ({
  color,
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
      style={{ backgroundColor: color }}
    >
      <div className={styles.inner}>{children}</div>
    </button>
  );
};

export default CircleButton;
