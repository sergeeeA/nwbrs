import '../styles/globals.css';
import { AppProvider } from '../context/context';
import { NftProvider } from '../context/NftContext';

function MyApp({ Component, pageProps }) {
  return (
    <NftProvider>
      <AppProvider>
        <div className="full-screen-shadow"></div>
        <Component {...pageProps} />
      </AppProvider>
    </NftProvider>
  );
}

export default MyApp;
