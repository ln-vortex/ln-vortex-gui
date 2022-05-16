import useSWR from 'swr';
import Channel from '../components/Channel';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Index() {
  const { data: channelData, error } = useSWR('/api/channels', fetcher);

  if (error) return <div>Failed to load</div>;
  if (!channelData) return <div>Loading...</div>;

  return (
    <>
      <div>
        LN-VORTEX
        <br />
        <br />
        Channels:
      </div>
      <ul>
        {channelData.map((c, i) => (
          <Channel key={i} channel={c} />
        ))}
      </ul>
    </>
  );
}
