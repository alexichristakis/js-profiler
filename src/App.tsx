import Provider from "context/Provider";
import { enableMapSet } from "immer";
import LanguageServerProvider from "languageServer/LanguageServerProvider";
import RuntimeProvider from "runtime/Provider";
import styles from "./App.module.scss";
import Editor from "./Editor";
import Header from "./Header";

enableMapSet();

function App() {
  return (
    <Provider>
      <RuntimeProvider>
        <LanguageServerProvider>
          <div className={styles.main}>
            <Header />
            <main>
              <Editor />
            </main>
          </div>
        </LanguageServerProvider>
      </RuntimeProvider>
    </Provider>
  );
}

export default App;
