import { useContext } from "react";
import LanguageServerContext from "./context";
import { assertIsNotNullish } from "typeguards";

const useLanguageServer = () => {
  const languageServerManager = useContext(LanguageServerContext);

  assertIsNotNullish(languageServerManager, "");
  return languageServerManager;
};

export default useLanguageServer;
