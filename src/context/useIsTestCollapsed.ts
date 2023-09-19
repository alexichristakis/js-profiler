import useSelector from "./useSelector";

const useIsTestCollapsed = (id: string) => {
  return useSelector(({ collapsedCases }) => collapsedCases.has(id));
};

export default useIsTestCollapsed;
