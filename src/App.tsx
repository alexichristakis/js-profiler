import styles from "./App.module.scss";
import Header from "./Header";
import Editor from "./Editor";
import Provider from "context/Provider";
import RuntimeProvider from "runtime/Provider";
import { enableMapSet } from "immer";

enableMapSet();

function App() {
  return (
    <Provider>
      <RuntimeProvider>
        <div className={styles.main}>
          <Header />
          <main>
            <Editor />
          </main>
        </div>
      </RuntimeProvider>
    </Provider>
  );
}

export default App;
