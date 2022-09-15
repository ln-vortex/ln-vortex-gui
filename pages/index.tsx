import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Index({ coordinatorName }) {
  const { data: statusData, error: statusError } = useSWR(
    '/api/getstatuses',
    fetcher
  );

  if (statusError) return <div>Failed to load</div>;
  if (!statusData) return <div>Loading...</div>;

  return <div>{coordinatorName}</div>;
}
