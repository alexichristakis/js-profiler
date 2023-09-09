import useSelector from "./useSelector";

const useIsRunning = () => {
  return useSelector(({ runningCases }) => runningCases.size > 0);
};

export default useIsRunning;
