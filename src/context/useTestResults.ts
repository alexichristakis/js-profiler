import { resultsSelector } from "./selectors";
import useSelector from "./useSelector";

const useTestResults = (id: string) => {
  return useSelector((state) => resultsSelector(state, id));
};

export default useTestResults;
