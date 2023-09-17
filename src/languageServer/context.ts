import { createContext } from "react";
import LanguageServerManager from "./LanguageServerManager";

const LanguageServerContext = createContext<LanguageServerManager | null>(null);

export default LanguageServerContext;
