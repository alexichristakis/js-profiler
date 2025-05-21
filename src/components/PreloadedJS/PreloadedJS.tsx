import { FC } from "react";
import CodeMirror from "components/CodeMirror";
import useDispatch from "context/useDispatch";
import styles from "./PreloadedJS.module.scss";
import useSelector from "context/useSelector";
import { PRELOADED_JS_ID } from "context/constants";
import CircleButton from "components/ui/CircleButton";
import Reload from "icons/Reload";
import Box from "components/ui/Box";

const PreloadedJS: FC = () => {
  const dispatch = useDispatch();
  const value = useSelector(({ preloadedJS }) => preloadedJS);

  return (
    <Box>
      <div className={styles.header}>
        <CircleButton
          color="rgb(255, 188, 54)"
          onClick={() => dispatch({ type: "RESET_PRELOADED_JS" })}
        >
          <Reload />
        </CircleButton>
      </div>
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
