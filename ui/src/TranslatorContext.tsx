import { createContext, useContext } from "react";

export type Translator = (
  key: string,
  vars?: Record<string, string | number>,
) => string;

const TranslatorContext = createContext<Translator>((key) => key);

export const TranslatorProvider = TranslatorContext.Provider;

export function useT(): Translator {
  return useContext(TranslatorContext);
}
