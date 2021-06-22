import "@styles/globals.css";
import axios from "axios";
import { useRouter } from "next/router";
import { AuthProvider } from "@context/auth.context";
import { SWRConfig } from "swr";
import { LayoutProvider } from "@context/layout.context";
import Layout from "@components/Layout";
import Head from "next/head";

// TODO next js progressbar

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_ENDPOINT; // the prefix of the URL only for the client side
axios.defaults.withCredentials = true;

function MyApp({ Component, pageProps }) {
  const { pathname } = useRouter();

  return (
    <AuthProvider>
      <Head>
        <title>Twitty : Social Life</title>
      </Head>
      <LayoutProvider>
        {pathname !== "/auth" ? (
          <SWRConfig
            value={{
              fetcher: (url: string) => axios(url).then((r) => r.data),
              dedupingInterval: 1000,
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
    </AuthProvider>
  );
}

export default MyApp;
