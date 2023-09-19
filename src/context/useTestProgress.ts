import { progressSelector } from "./selectors";
import useSelector from "./useSelector";

const useTestResults = (id: string) => {
  return useSelector((state) => progressSelector(state, id));
};

export default useTestResults;
