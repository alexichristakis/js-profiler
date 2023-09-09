import { FC } from "react";
import styles from "./Input.module.scss";

export type InputProps = {
  value: string;
  onChange?: (value: string) => void;
};

const Input: FC<InputProps> = ({ value, onChange }) => {
  return (
    <input
      className={styles.main}
      value={value}
      onChange={({ target: { value } }) => onChange?.(value)}
    />
  );
};

export default Input;
