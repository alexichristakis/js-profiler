import Alert from "components/ui/Alert";
import CircleButton from "components/ui/CircleButton";
import Input from "components/ui/Input";
import useDispatch from "context/useDispatch";
import useSelector from "context/useSelector";
import Close from "icons/Close";
import Reload from "icons/Reload";
import useLanguageServer from "languageServer/useLanguageServer";
import { FC } from "react";
import useRuntimeContext from "runtime/useRuntimeContext";
import styles from "./TestCase.module.scss";
import TestResults from "./TestResults";
import classNames from "classnames/bind";
import Progress from "components/ui/Progress";
import useTestProgress from "context/useTestProgress";

const cx = classNames.bind(styles);

export type TestCaseSidebarProps = {
  id: string;
  title: string;
  onChangeTitle?: (title: string) => void;
};

const TestCaseSidebar: FC<TestCaseSidebarProps> = ({
  id,
  title,
  onChangeTitle,
}) => {
  const dispatch = useDispatch();

  const { run } = useRuntimeContext();

  const languageServer = useLanguageServer();
  const error = useSelector(
    ({ testErrors }) =>
      testErrors.find((testError) => testError.id === id)?.error
  );

  const progress = useTestProgress(id);

  return (
    <div className={cx("sidebar", { error })}>
      <div className={styles.header}>
        <div className={styles.headerGroup}>
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
          <Input
            bold
            placeholder="Untitled"
            value={title}
            onChange={onChangeTitle}
          />
        </div>

        {progress && progress !== 1 && (
          <Progress size={16} min={0} max={1} value={progress} />
        )}
      </div>
      {error && (
        <Alert level="error" title={error.error} message={error.message} />
      )}
      <TestResults id={id} />
    </div>
  );
};

export default TestCaseSidebar;
