import { FC } from "react";
import styles from "./File.module.scss";

type FileProps = {
  contents: string;
};

const File: FC<FileProps> = ({ contents }) => {
  return <code className={styles.main}>{contents}</code>;
};

export default File;
