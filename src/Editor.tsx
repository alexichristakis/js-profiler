import PreloadedJS from "components/PreloadedJS";
import TestCase from "components/TestCase";
import useSelector from "context/useSelector";
import { FC } from "react";
import styles from "./Editor.module.scss";

const Editor: FC = () => {
  const cases = useSelector(({ testCases }) => testCases);
  return (
    <main className={styles.main}>
      <PreloadedJS />
      {cases.map(({ id, ...rest }) => (
        <TestCase key={id} id={id} {...rest} />
      ))}
    </main>
  );
};

export default Editor;
