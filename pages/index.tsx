import useSWR, { useSWRConfig } from 'swr';
import Channel from '../components/Channel';
import { useRouter } from 'next/router';
import Status from '../components/Status';
import InputsScheduled from '../components/InputsScheduled';
import { useState } from 'react';
import ButtonGroup from '../components/ButtonGroup';
import UTXOTable from '../components/UTXOTable';

enum Mode {
  LIGHTNING,
  ONCHAIN,
}

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Index() {
  const { data: statusData, error: statusError } = useSWR(
    '/api/status',
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
  const [mode, setMode] = useState(Mode.LIGHTNING);
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

  const toggleMode = (index: number) => {
    index === 0 ? setMode(Mode.LIGHTNING) : setMode(Mode.ONCHAIN);
  };

  if (statusError || channelError || utxoError)
    return <div>Failed to load</div>;
  if (!statusData || !channelData || !utxoList || cancelCoinsLoading)
    return <div>Loading...</div>;

  return (
    <>
      <ButtonGroup
        buttons={[
          'Create a vortex channel',
          'Create a collaborative transaction',
        ]}
        onClick={toggleMode}
      />
      <h2>Status</h2>
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
      {!statusData.inputs && mode === Mode.LIGHTNING && (
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
      {!statusData.inputs && mode === Mode.ONCHAIN && (
        <>
          <h2>UTXOs</h2>
          <UTXOTable utxoList={utxoList} selectable={false}></UTXOTable>
          <br />
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => {
                router.push('/onchain');
              }}
            >
              CREATE COLLABORATIVE TRANSACTION
            </button>
          </div>
        </>
      )}
    </>
  );
}
