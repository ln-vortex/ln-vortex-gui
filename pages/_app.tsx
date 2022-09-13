import '../styles/styles.css';
import '../styles/fonts.css';
import { AppProps } from 'next/app';
import Layout from '../components/Layout';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

function MyApp({ Component, pageProps }: AppProps) {
  const { data: statusData, error: statusError } = useSWR(
    'api/getstatuses',
    fetcher
  );

  if (statusError) return <div>Failed to load coordinators</div>;
  if (!statusData) return <div>Loading coordinators...</div>;

  return (
    <Layout statusData={statusData}>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
