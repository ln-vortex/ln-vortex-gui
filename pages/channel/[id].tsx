import { useRouter } from 'next/router';
import useSWR from 'swr';

const fetcher = async (url) => {
  const res = await fetch(url);
  const data = await res.json();

  if (res.status !== 200) {
    throw new Error(data.message);
  }
  return data;
};

export default function Channel() {
  const { query } = useRouter();
  const { data, error } = useSWR(
    () => query.id && `/api/channels/${query.id}`,
    fetcher
  );

  if (error) return <div>{error.message}</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <table>
      <thead>
        <tr>
          <th>Channel ID</th>
          <td>{data.shortChannelId}</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>Amount</th>
          <td>{data.amount}</td>
        </tr>
      </tbody>
    </table>
  );
}
