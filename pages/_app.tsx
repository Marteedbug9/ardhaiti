import type { AppProps } from 'next/app';
import Head from 'next/head'; // <--- Ajouté
import { appWithTranslation } from 'next-i18next';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="icon" href="/icon.png" sizes="32x32" type="image/png" />
        <link rel="icon" href="/icon.png" sizes="192x192" type="image/png" />
        <title>ARDH | Assistance for Refugees</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default appWithTranslation(MyApp);
