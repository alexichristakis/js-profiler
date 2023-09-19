import { FC } from "react";
import CodeMirror from "components/CodeMirror";
import useDispatch from "context/useDispatch";
import styles from "./PreloadedJS.module.scss";
import useSelector from "context/useSelector";
import { PRELOADED_JS_ID } from "context/constants";
import Box from "components/ui/Box";

const PreloadedJS: FC = () => {
  const dispatch = useDispatch();
  const value = useSelector(({ preloadedJS }) => preloadedJS);

  return (
    <Box>
      <div className={styles.content}>
        <CodeMirror
          id={PRELOADED_JS_ID}
          value={value}
          onChange={(preloadedJS) =>
            dispatch({ type: "EDIT_PRELOADED_JS", preloadedJS })
          }
        />
      </div>
    </Box>
  );
};

export default PreloadedJS;
