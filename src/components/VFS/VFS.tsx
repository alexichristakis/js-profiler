import useLanguageServer from "languageServer/useLanguageServer";
import { FC, useEffect, useState } from "react";
import styles from "./VFS.module.scss";
import useMountEffect from "hooks/useMountEffect";
import useCallbackRef from "hooks/useCallbackRef";
import FileList from "./FileList";
import File from "./File";
import useUpdateEffect from "hooks/useUpdateEffect";

const VFS: FC = () => {
  const languageServerManager = useLanguageServer();

  const [fileList, setFileList] = useState<string[]>([]);
  const [focusedFile, setFocusedFile] = useState<string | null>(null);
  const [focusedFileContents, setFocusedFileContents] = useState<string | null>(
    null
  );

  const requestFileList = useCallbackRef(async () => {
    const fileList = await languageServerManager.getFileList();
    setFileList(fileList ?? []);
  });

  const requestFileContents = useCallbackRef(async (path: string) => {
    const file = await languageServerManager.getFile(path);
    setFocusedFileContents(file ?? null);
  });

  useUpdateEffect(() => {
    if (focusedFile) {
      requestFileContents(focusedFile);
    }
  }, [focusedFile]);

  useMountEffect(() => {
    requestFileList();
  });

  return (
    <div className={styles.main}>
      <FileList files={fileList} onClickFile={setFocusedFile} />
      <File contents={focusedFileContents ?? ""} />
    </div>
  );
};

export default VFS;
