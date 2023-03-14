/* eslint-disable */

import { createContext } from "react";
import { useContext } from "react";
export const LanguageContext = createContext<{
  lang: "he" | "en";
  setLang: (l: "he" | "en") => void;
}>({
  lang: "he",
  setLang: () => {},
});

export const useLang = () => useContext(LanguageContext);
