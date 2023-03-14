import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { MantineProvider, createEmotionCache } from "@mantine/core";
import rtlPlugin from "stylis-plugin-rtl";

const rtlCache = createEmotionCache({
  key: "mantine-rtl",
  stylisPlugins: [rtlPlugin],
});

const ltrCache = createEmotionCache({
  key: "mantine-ltr",
});

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { useState } from "react";
import { LanguageContext } from "~/context/lang";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [lang, setLang] = useState<"he" | "en">("he");
  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      <SessionProvider session={session}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          emotionCache={lang == "he" ? rtlCache : ltrCache}
          theme={{ dir: lang == "he" ? "rtl" : "ltr" }}
        >
          <Component {...pageProps} />
        </MantineProvider>
      </SessionProvider>
    </LanguageContext.Provider>
  );
};

export default api.withTRPC(MyApp);
