import CodeMirror from "components/CodeMirror";
import useDispatch from "context/useDispatch";
import { FC, memo } from "react";
import styles from "./TestCase.module.scss";
import TestResults from "./TestResults";
import CircleButton from "components/ui/CircleButton";
import Close from "icons/Close";
import Reload from "icons/Reload";
import Input from "components/ui/Input";
import useRuntimeContext from "runtime/useRuntimeContext";
import useLanguageServer from "languageServer/useLanguageServer";
import useSelector from "context/useSelector";
import classNames from "classnames/bind";
import Alert from "components/ui/Alert";

const cx = classNames.bind(styles);

type TestCaseProps = {
  id: string;
  code: string;
};

const TestCase: FC<TestCaseProps> = ({ id, code }) => {
  const dispatch = useDispatch();
  const languageServer = useLanguageServer();
  const error = useSelector(
    ({ testErrors }) =>
      testErrors.find((testError) => testError.id === id)?.error
  );

  const { run } = useRuntimeContext();
  return (
    <div className={styles.main}>
      <div className={cx("sidebar", { error })}>
        <div className={styles.header}>
          <CircleButton
            color="rgb(255, 54, 54)"
            onClick={() => {
              dispatch({ type: "DELETE_CASE", id });
              languageServer.deleteFile(id);
            }}
          >
            <Close />
          </CircleButton>
          <CircleButton color="rgb(36, 228, 45)" onClick={() => run(id)}>
            <Reload />
          </CircleButton>
          <Input value={"Test case"} />
        </div>

        {error && (
          <Alert level="error" title={error.error} message={error.message} />
        )}
        <TestResults id={id} />
      </div>
      <div className={styles.body}>
        <CodeMirror
          key={id}
          isModule
          id={id}
          value={code}
          onChange={(code) =>
            dispatch({ type: "EDIT_CASE", testCase: { id, code } })
          }
        />
      </div>
    </div>
  );
};

export default memo(TestCase);
