import "@styles/globals.css";
import { SnackbarProvider } from "notistack";
import axios from "axios";
import { useRouter } from "next/router";
import { AuthProvider } from "@context/auth.context";
import { SWRConfig } from "swr";
import { LayoutProvider } from "@context/layout.context";
import Layout from "@components/Layout";
import Head from "next/head";
import { SocketProvider } from "@context/socket.context";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_ENDPOINT; // the prefix of the URL only for the client side
axios.defaults.withCredentials = true;

function MyApp({ Component, pageProps }) {
  const { pathname } = useRouter();

  return (
    <AuthProvider>
      <SnackbarProvider>
        <SWRConfig
          value={{
            fetcher: (url: string) => axios(url).then((r) => r.data),
            dedupingInterval: 100000, // TODO for development

            revalidateOnFocus: false,
          }}
        >
          <SocketProvider>
            <Head>
              <title>Twitty : Not Twitter</title>
              <link rel="icon" href="/favicon.png" />
            </Head>
            <LayoutProvider>
              {pathname !== "/auth" ? (
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              ) : (
                <Component {...pageProps} />
              )}
            </LayoutProvider>
          </SocketProvider>
        </SWRConfig>
      </SnackbarProvider>
    </AuthProvider>
  );
}

export default MyApp;
