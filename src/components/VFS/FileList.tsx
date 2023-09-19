import Button from "components/ui/Button";
import { FC } from "react";
import styles from "./FileList.module.scss";

export type FileListProps = {
  files: string[];
  onClickFile?: (path: string) => void;
  onRefresh?: () => void;
};

const FileList: FC<FileListProps> = ({ files, onRefresh, onClickFile }) => {
  return (
    <div className={styles.main}>
      <Button onClick={onRefresh}>Refresh</Button>
      <ol className={styles.list}>
        {files.map((file) => (
          <li key={file} onClick={() => onClickFile?.(file)}>
            {file}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default FileList;
