import useSelector from "context/useSelector";
import { FC } from "react";
import styles from "./TestResults.module.scss";
import Progress from "components/ui/Progress";

type TestResultsProps = {
  id: string;
};

const TestResults: FC<TestResultsProps> = ({ id }) => {
  const results = useSelector(({ testResults }) =>
    testResults.find((result) => result.id === id)
  );

  if (!results) {
    return null;
  }

  const { averageTime = 0, iterations = 0, progress = 0 } = results;
  return (
    <div className={styles.main}>
      <table className={styles.table}>
        <tbody>
          <tr>
            <td>Avg</td>
            <td>{averageTime}</td>
          </tr>
          <tr>
            <td>Iterations</td>
            <td>{iterations}</td>
          </tr>
        </tbody>
      </table>
      <Progress min={0} max={1} value={progress} />
    </div>
  );
};

export default TestResults;
