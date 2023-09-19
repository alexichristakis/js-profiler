import { FC } from "react";
import styles from "./Input.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

export type InputProps = {
  bold?: boolean;
  value: string;
  placeholder?: string;
  onChange?: (value: string) => void;
};

const Input: FC<InputProps> = ({
  bold = false,
  placeholder,
  value,
  onChange,
}) => {
  return (
    <input
      className={cx("main", { bold })}
      placeholder={placeholder}
      value={value}
      onChange={({ target: { value } }) => onChange?.(value)}
    />
  );
};

export default Input;
