import useLazyRef from "hooks/useLazyRef";
import { FC, PropsWithChildren } from "react";
import LanguageServerManager from "./LanguageServerManager";
import LanguageServerContext from "./context";

const LanguageServerProvider: FC<PropsWithChildren> = ({ children }) => {
  const languageServerManager = useLazyRef(
    () => new LanguageServerManager()
  ).current;

  return (
    <LanguageServerContext.Provider value={languageServerManager}>
      {children}
    </LanguageServerContext.Provider>
  );
};

export default LanguageServerProvider;
