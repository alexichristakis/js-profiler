import StoreProvider from "context/Provider";
import { enableMapSet } from "immer";
import LanguageServerProvider from "languageServer/LanguageServerProvider";
import RuntimeProvider from "runtime/Provider";
import styles from "./App.module.scss";
import Editor from "./Editor";
import Header from "./Header";

enableMapSet();

function App() {
  return (
    <StoreProvider>
      <LanguageServerProvider>
        <RuntimeProvider>
          <div className={styles.main}>
            <Header />
            <main>
              <Editor />
            </main>
          </div>
        </RuntimeProvider>
      </LanguageServerProvider>
    </StoreProvider>
  );
}

export default App;
