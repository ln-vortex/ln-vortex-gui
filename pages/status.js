import useSWR from 'swr';
import Header from '../components/Header';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Index() {
  const { data: statusData, error } = useSWR('/api/status', fetcher);

  if (error) return <div>Failed to load</div>;
  if (!statusData) return <div>Loading...</div>;

  return (
    <>
      <Header />
      <h2>Status</h2>
      {statusData.status}
    </>
  );
}
