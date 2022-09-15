import '../styles/styles.css';
import '../styles/fonts.css';
import { AppProps } from 'next/app';
import Layout from '../components/Layout';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { convertQueryParamToString } from '../utils/convertor';

const fetcher = (url) => fetch(url).then((res) => res.json());

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { coordinator } = router.query;
  const { data: statusData, error: statusError } = useSWR(
    'api/getstatuses',
    fetcher
  );

  if (statusError) return <div>Failed to load coordinators</div>;
  if (!statusData) return <div>Loading coordinators...</div>;

  const coordinatorString = convertQueryParamToString(coordinator);
  const coordinatorNames = Object.keys(statusData);

  if (coordinatorNames.length === 0) return <div>No coordinators found</div>;
  if (coordinatorString && !coordinatorNames.includes(coordinatorString))
    return <div>The selected coordinator is not connected</div>;

  const coordinatorName = coordinatorString
    ? coordinatorString
    : coordinatorNames[0];

  return (
    <Layout coordinatorName={coordinatorName} statusData={statusData}>
      <Component
        coordinatorName={coordinatorName}
        coordinator={statusData[coordinatorName]}
        statusData={statusData}
        {...pageProps}
      />
    </Layout>
  );
}

export default MyApp;
