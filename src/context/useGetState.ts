import { useContext } from "use-context-selector";
import { GetStateContext } from "./context";
import { assertIsNotNullish } from "utils/typeguards";

const useGetState = () => {
  const context = useContext(GetStateContext);

  assertIsNotNullish(
    context,
    "useGetState was not called within GetStateContext provider."
  );
  return context;
};

export default useGetState;
