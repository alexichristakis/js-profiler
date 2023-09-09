import { useContextSelector } from "use-context-selector";
import Context, { State } from "./context";

const useSelector = <T>(selector: (state: State) => T): T => {
  return useContextSelector(Context, (value) => {
    if (!value) {
      throw new Error("");
    }

    return selector(value.state);
  });
};

export default useSelector;
