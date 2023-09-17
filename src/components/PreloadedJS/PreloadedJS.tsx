import { FC } from "react";
import CodeMirror from "components/CodeMirror";
import useDispatch from "context/useDispatch";
import styles from "./PreloadedJS.module.scss";
import useSelector from "context/useSelector";

const PreloadedJS: FC = () => {
  const dispatch = useDispatch();
  const value = useSelector(({ preloadedJS }) => preloadedJS);

  return (
    <div className={styles.main}>
      <CodeMirror
        value={value}
        onChange={(preloadedJS) =>
          dispatch({ type: "EDIT_PRELOADED_JS", preloadedJS })
        }
      />
    </div>
  );
};

export default PreloadedJS;
