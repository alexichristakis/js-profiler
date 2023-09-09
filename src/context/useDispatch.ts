import { useContextSelector } from "use-context-selector";
import Context from "./context";

const useDispatch = () => {
  return useContextSelector(Context, (store) => {
    if (!store?.dispatch) {
      throw new Error("");
    }

    return store.dispatch;
  });
};

export default useDispatch;
