import { FC } from "react";
import CodeMirror from "components/CodeMirror";
import useDispatch from "context/useDispatch";
import styles from "./PreloadedJS.module.scss";
import useSelector from "context/useSelector";
import { PRELOADED_JS_ID } from "context/constants";

const PreloadedJS: FC = () => {
  const dispatch = useDispatch();
  const value = useSelector(({ preloadedJS }) => preloadedJS);

  return (
    <div className={styles.main}>
      <CodeMirror
        id={PRELOADED_JS_ID}
        value={value}
        onChange={(preloadedJS) =>
          dispatch({ type: "EDIT_PRELOADED_JS", preloadedJS })
        }
      />
    </div>
  );
};

export default PreloadedJS;
