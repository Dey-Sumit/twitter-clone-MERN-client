import "@styles/globals.css";
import { SnackbarProvider } from "notistack";
import axios from "axios";
import { useRouter } from "next/router";
import { AuthProvider } from "@context/auth.context";
import { SWRConfig } from "swr";
import { LayoutProvider } from "@context/layout.context";
import Layout from "@components/Layout";
import Head from "next/head";
import { useEffect } from "react";
import { SocketProvider } from "@context/socket.context";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_ENDPOINT; // the prefix of the URL only for the client side
axios.defaults.withCredentials = true;

function MyApp({ Component, pageProps }) {
  const { pathname } = useRouter();
  useEffect(() => {
    window.onload = function () {
      document.getElementById("loadingScreen");
    };
  }, []);

  return (
    <AuthProvider>
      <SnackbarProvider>
        <SocketProvider>
          <Head>
            <title>Twitty : Not Twitter</title>
            <link rel="icon" href="/favicon.png" />
          </Head>
          <LayoutProvider>
            {pathname !== "/auth" ? (
              <SWRConfig
                value={{
                  fetcher: (url: string) => axios(url).then((r) => r.data),
                  dedupingInterval: 10000,
                  revalidateOnFocus: false,
                }}
              >
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </SWRConfig>
            ) : (
              <Component {...pageProps} />
            )}
          </LayoutProvider>
        </SocketProvider>
      </SnackbarProvider>
    </AuthProvider>
  );
}

export default MyApp;
