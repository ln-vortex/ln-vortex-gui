import '../styles/styles.css';
import '../styles/fonts.css';
import { AppProps } from 'next/app';
import Layout from '../components/Layout';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { convertQueryParamToString, fetcher } from '../utils/convertor';

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
  const coordinatorNames = statusData.map(function (coordinator) {
    return coordinator[0];
  });

  if (coordinatorNames.length === 0) return <div>No coordinators found</div>;

  const coordinatorName = coordinatorString
    ? coordinatorString
    : coordinatorNames[0];
  const coordinatorIndex = coordinatorNames.indexOf(coordinatorName);

  if (coordinatorString && coordinatorIndex === -1)
    return <div>The selected coordinator is not connected</div>;

  return (
    <Layout coordinatorName={coordinatorName} statusData={statusData}>
      <Component
        coordinatorName={coordinatorName}
        coordinator={statusData[coordinatorIndex][1]}
        statusData={statusData}
        {...pageProps}
      />
    </Layout>
  );
}

export default MyApp;
