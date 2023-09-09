import Button from "components/ui/Button";
import useDispatch from "context/useDispatch";
import useIsRunning from "context/useIsRunning";
import { FC } from "react";
import useRuntimeContext from "runtime/useRuntimeContext";
import styles from "./Header.module.scss";

type HeaderProps = {};

const Header: FC<HeaderProps> = () => {
  const dispatch = useDispatch();
  const isRunning = useIsRunning();

  const { run, abort } = useRuntimeContext();

  return (
    <header className={styles.main}>
      <Button onClick={() => dispatch({ type: "ADD_CASE" })}>+ Add case</Button>
      <Button disabled={isRunning} onClick={() => run()}>
        Run all
      </Button>
      {isRunning && <Button onClick={abort}>Stop all</Button>}
    </header>
  );
};

export default Header;
