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

  const { averageTime = 0, iterations = 0, progress } = results;
  return (
    <div className={styles.main}>
      <table className={styles.table}>
        <tbody>
          <tr>
            <td>Iterations / sec:</td>
            <td>{Math.round(iterations / (10000 * progress))}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TestResults;
