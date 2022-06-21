import useSWR from 'swr';
import Channel from '../components/Channel';
import Header from '../components/Header';
import { useRouter } from 'next/router';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Index() {
  const { data: channelData, error } = useSWR('/api/channels', fetcher);
  const router = useRouter();

  if (error) return <div>Failed to load</div>;
  if (!channelData) return <div>Loading...</div>;

  return (
    <>
      <Header />
      <h2>Channels</h2>
      <ul>
        {channelData.map((c, i) => (
          <>
            <Channel key={i} channel={c} />
            <br />
          </>
        ))}
      </ul>
      <button
        onClick={() => {
          router.push('/create');
        }}
      >
        CREATE NEW CHANNEL
      </button>
    </>
  );
}
