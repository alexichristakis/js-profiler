import CodeMirror from "components/CodeMirror";
import { TestCase as TestCaseType } from "context/types";
import useDispatch from "context/useDispatch";
import useCallbackRef from "hooks/useCallbackRef";
import { FC, memo } from "react";
import styles from "./TestCase.module.scss";
import TestCaseSidebar from "./TestCaseSidebar";
import useIsTestCollapsed from "context/useIsTestCollapsed";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

type TestCaseProps = {} & TestCaseType;

const TestCase: FC<TestCaseProps> = ({ title, id, code }) => {
  const dispatch = useDispatch();

  const isCollapsed = useIsTestCollapsed(id);

  const updateTestCase = useCallbackRef((testCase: Partial<TestCaseType>) => {
    dispatch({ type: "EDIT_CASE", testCase: { id, title, code, ...testCase } });
  });

  return (
    <div className={cx("main", { isCollapsed })}>
      <TestCaseSidebar
        id={id}
        title={title}
        isCollapsed={isCollapsed}
        onChangeTitle={(title) => updateTestCase({ title })}
      />
      <div className={styles.body}>
        {isCollapsed ? null : (
          <CodeMirror
            key={id}
            isModule
            id={id}
            value={code}
            onChange={(code) => updateTestCase({ code })}
          />
        )}
      </div>
    </div>
  );
};

export default memo(TestCase);
