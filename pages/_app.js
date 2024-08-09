import { useEffect, useState } from 'react';
import '../styles/globals.css';
import '../styles/loading.css'; // Import the loading CSS
import { AppProvider } from '../context/context';

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading period, e.g., 1 second
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1275);

    // Cleanup timer if component unmounts
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    setLoading(false);
  };

  return (
    <AppProvider>
      {loading && (
        <div className={`loading-overlay ${!loading ? 'fade-out' : ''}`} onClick={handleClick}>
          <video autoPlay muted>
            <source src="/loading.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
      <Component {...pageProps} />
    </AppProvider>
  );
}

export default MyApp;
