import { SessionProvider } from "next-auth-static-site";
import {
  I18nProvider,
  languages,
  defaultLanguage,
  namespaces,
  defaultNamespace,
} from "next-i18next-static-site";

// Locales loader
import locales from "../lib/locales";
import Header from "../components/header";
import "./styles.css";

const App = ({ Component, pageProps: { ...pageProps } }) => {
  // i18n options
  const i18n = {
    languages,
    defaultLanguage,
    namespaces,
    defaultNamespace,
    locales,
  };

  return (
    <I18nProvider i18n={i18n} /* Pass the i18n options to the i18n provider */>
      <SessionProvider>
        <Header />
        <Component {...pageProps} />
      </SessionProvider>
    </I18nProvider>
  );
};

export default App;
