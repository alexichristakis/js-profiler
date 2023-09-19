import useTestResults from "context/useTestResults";
import { FC } from "react";
import styles from "./TestResults.module.scss";

type TestResultsProps = {
  id: string;
};

const TestResults: FC<TestResultsProps> = ({ id }) => {
  const results = useTestResults(id);
  if (!results) {
    return null;
  }

  const { averageTime = 0, iterations = 0 } = results;
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
    </div>
  );
};

export default TestResults;
