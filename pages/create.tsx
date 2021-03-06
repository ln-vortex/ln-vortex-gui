import { useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import UTXOTable from '../components/UTXOTable';
import SatsSelected from '../components/SatsSelected';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Create() {
  const { data: utxoList, error: utxoError } = useSWR('/api/utxos', fetcher);
  const { data: status, error: statusError } = useSWR('/api/status', fetcher);
  const [checkedState, setCheckedState] = useState<Array<boolean> | undefined>(
    undefined
  );
  const [satsSelected, setSatsSelected] = useState(0);
  const [nodePubkey, setNodePubkey] = useState('');
  const [host, setHost] = useState('');
  const [queueCoinsError, setQueueCoinsError] = useState('');
  const [queueCoinsLoading, setQueueCoinsLoading] = useState(false);
  const router = useRouter();

  const handleOnChange = (position) => {
    const initialCheckedState = !checkedState
      ? new Array(utxoList.length).fill(false)
      : checkedState;

    const updatedCheckedState = initialCheckedState.map((item, index) =>
      index === position ? !item : item
    );

    setCheckedState(updatedCheckedState);

    const totalSats = updatedCheckedState.reduce((sum, currentState, index) => {
      if (currentState === true) {
        return sum + utxoList[index].amount;
      }
      return sum;
    }, 0);

    setSatsSelected(totalSats);
  };

  const handleQueueCoins = async () => {
    setQueueCoinsError('');
    setQueueCoinsLoading(true);

    const allOutpoints = utxoList.map(function (item) {
      return item.outPoint;
    });
    const selectedOutpoints = allOutpoints.filter(function (item, index) {
      return checkedState[index];
    });

    const params = {
      nodeId: nodePubkey,
      peerAddr: host, // optional
      outpoints: selectedOutpoints,
    };

    const response = await fetch('/api/queuecoins', {
      method: 'POST',
      body: JSON.stringify({ params }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (data.error) {
      setQueueCoinsError(data.error);
      setQueueCoinsLoading(false);
    } else {
      router.push('/');
    }
  };

  const createChannelEnabled = () =>
    satsSelected >= status.round.amount + status.round.mixFee;

  if (utxoError || statusError) return <div>Failed to load</div>;
  if (!utxoList || !status || queueCoinsLoading) return <div>Loading...</div>;

  return (
    <>
      <h2>CREATE CHANNEL</h2>
      <h3>Node Pubkey</h3>
      <input
        type="text"
        value={nodePubkey}
        onChange={(e) => setNodePubkey(e.target.value)}
      />
      <div>The pubkey of the target node you want to open a channel to.</div>
      <h3>Host (optional)</h3>
      <input
        type="text"
        value={host}
        onChange={(e) => setHost(e.target.value)}
      />
      <div>The IP address / Tor address of the target node.</div>
      <h2>CHOOSE INPUTS</h2>
      <UTXOTable
        utxoList={utxoList}
        checkedState={checkedState}
        handleOnChange={handleOnChange}
      />
      <br />
      <div>
        {(status.round.amount + status.round.mixFee).toLocaleString()} sats
        required for Vortex channel ({status.round.amount.toLocaleString()} sat
        channel + {status.round.mixFee.toLocaleString()} sat fee)
      </div>
      <br />
      <SatsSelected
        satsSelected={satsSelected}
        enabled={createChannelEnabled}
        status={status}
      />
      <br />
      <button
        disabled={!(nodePubkey && createChannelEnabled())}
        onClick={handleQueueCoins}
      >
        CREATE CHANNEL
      </button>
      <br />
      <br />
      {queueCoinsError && <div className="danger">{queueCoinsError}</div>}
    </>
  );
}
