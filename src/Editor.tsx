import useSelector from "context/useSelector";
import { FC } from "react";
import styles from "./Editor.module.scss";
import TestCase from "./components/TestCase";
import useIsRunning from "context/useIsRunning";

const Editor: FC = () => {
  const isRunning = useIsRunning();
  const cases = useSelector(({ testCases }) => testCases);
  return (
    <main className={styles.main}>
      {cases.map(({ id, code }) => (
        <TestCase key={id} id={id} code={code} />
      ))}
      {isRunning ? "RUNNING" : "IDLE"}
    </main>
  );
};

export default Editor;
