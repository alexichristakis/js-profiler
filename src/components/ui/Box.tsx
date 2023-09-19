import { FC, PropsWithChildren } from "react";
import styles from "./Box.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

type BoxProps = PropsWithChildren<{
  className?: string;
}>;

const Box: FC<BoxProps> = ({ className, children }) => {
  return <div className={cx("main", className)}>{children}</div>;
};

export default Box;
