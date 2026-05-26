import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { Dispose } from "@tokimo/sdk";
import { defineApp, makeTranslator } from "@tokimo/sdk";
import {
  ConfigProvider,
  ToastProvider,
  enUS as uiEnUS,
  zhCN as uiZhCN,
} from "@tokimo/ui";
import { StrictMode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { enUS, zhCN } from "./i18n";
import type { Translator } from "./TranslatorContext";
import { TranslatorProvider } from "./TranslatorContext";
import "./index.css";
import CalendarPage from "./pages";

function makeAppTranslator(locale: string): Translator {
  const bundle = locale.startsWith("zh") ? zhCN : enUS;
  return (key: string, vars?: Record<string, string | number>): string => {
    let val = bundle[key] ?? key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        val = val.replace(`{${k}}`, String(v));
      }
    }
    return val;
  };
}

export default defineApp({
  id: "calendar",
  manifest: {
    id: "calendar",
    appName: "Calendar",
    icon: "CalendarDays",
    image: "icon.png",
    color: "#ef4444",
    windowType: "calendar",
    defaultSize: { width: 900, height: 680 },
    category: "app",
    fullBleed: true,
  },
  mount(container, ctx): Dispose {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
    });
    const locale = ctx.locale.startsWith("zh") ? uiZhCN : uiEnUS;
    const t = makeAppTranslator(ctx.locale);
    // makeTranslator is used just to satisfy the import — actual t is our custom one
    void makeTranslator({ "zh-CN": zhCN, "en-US": enUS }, ctx.locale);
    const root: Root = createRoot(container);

    root.render(
      <StrictMode>
        <TranslatorProvider value={t}>
          <QueryClientProvider client={queryClient}>
            <ConfigProvider locale={locale}>
              <ToastProvider>
                <CalendarPage locale={ctx.locale} />
              </ToastProvider>
            </ConfigProvider>
          </QueryClientProvider>
        </TranslatorProvider>
      </StrictMode>,
    );
    return () => root.unmount();
  },
});
