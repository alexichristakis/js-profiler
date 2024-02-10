import { useContextSelector } from "use-context-selector";
import Context from "./context";
import { assertIsNotNullish } from "utils/typeguards";

const useDispatch = () => {
  return useContextSelector(Context, (store) => {
    assertIsNotNullish(store, "");
    return store.dispatch;
  });
};

export default useDispatch;
