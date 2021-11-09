import "tailwindcss/tailwind.css";
import "@material-tailwind/react/tailwind.css";
import Head from "next/head";
import "../styles.css";
import NextNprogress from "nextjs-progressbar";

import { Provider } from "react-redux";
import { Provider as AuthProvider } from "next-auth/client";
import { store } from "../app/store";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </Head>

      <AuthProvider session={pageProps.session}>
        <Provider store={store}>
          <NextNprogress
            color="#2196F3"
            startPosition={0.3}
            stopDelayMs={200}
            height={5}
            options={{ showSpinner: false }}
            showSpinner={false}
            showOnShallow={true}
          />

          <Component {...pageProps} />
        </Provider>
      </AuthProvider>
    </>
  );
}

export default MyApp;
