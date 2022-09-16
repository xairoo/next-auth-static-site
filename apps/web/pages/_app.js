import { SessionProvider } from "next-static-site-auth";
import Header from "../components/header";
import "./styles.css";

const App = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <SessionProvider>
      <Header />
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default App;
