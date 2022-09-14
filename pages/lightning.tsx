import useSWR, { useSWRConfig } from 'swr';
import Channel from '../components/Channel';
import { useRouter } from 'next/router';
import Status from '../components/Status';
import InputsScheduled from '../components/InputsScheduled';
import { useState } from 'react';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Index() {
  const { data: statusData, error: statusError } = useSWR(
    '/api/lightningstatus',
    fetcher
  );
  const { data: channelData, error: channelError } = useSWR(
    '/api/channels',
    fetcher
  );
  const { data: utxoList, error: utxoError } = useSWR('/api/utxos', fetcher);
  const router = useRouter();
  const [cancelCoinsError, setCancelCoinsError] = useState('');
  const [cancelCoinsLoading, setCancelCoinsLoading] = useState(false);
  const { mutate } = useSWRConfig();

  const handleCancelCoins = async () => {
    setCancelCoinsError('');
    setCancelCoinsLoading(true);

    const response = await fetch('/api/cancelcoins');
    const data = await response.json();

    if (data.error) {
      setCancelCoinsError(data.error);
    } else {
      mutate('/api/status');
    }

    setCancelCoinsLoading(false);
  };

  if (statusError || channelError || utxoError)
    return <div>Failed to load</div>;
  if (!statusData || !channelData || !utxoList || cancelCoinsLoading)
    return <div>Loading...</div>;

  return (
    <>
      <h2>Lightning Coordinator Status</h2>
      <ul className="scrollable">
        <Status statusData={statusData} />
      </ul>
      {statusData.inputs && (
        <>
          <h2>Inputs Scheduled</h2>
          <ul className="scrollable">
            <InputsScheduled inputs={statusData.inputs} />
          </ul>
          <div style={{ textAlign: 'center' }}>
            <button className="danger" onClick={handleCancelCoins}>
              CANCEL CHANNEL OPEN
            </button>
          </div>
          <br />
          <br />
          {cancelCoinsError && <div className="danger">{cancelCoinsError}</div>}
        </>
      )}
      {!statusData.inputs && (
        <>
          <h2>Channels</h2>
          <ul className="scrollable">
            {channelData.map((c, i) => (
              <>
                <Channel key={i} channel={c} />
              </>
            ))}
          </ul>
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => {
                router.push('/create');
              }}
            >
              CREATE NEW CHANNEL
            </button>
          </div>
        </>
      )}
    </>
  );
}
