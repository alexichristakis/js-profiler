import useSelector from "./useSelector";

const useTestError = (id: string) => {
  const error = useSelector(
    ({ testErrors }) =>
      testErrors.find((testError) => testError.id === id)?.error
  );

  return error;
};

export default useTestError;
