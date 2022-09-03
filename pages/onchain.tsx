import { useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import UTXOTable from '../components/UTXOTable';
import SatsSelected from '../components/SatsSelected';
import { outPointString } from '../utils/convertor';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Create() {
  const { data: utxoList, error: utxoError } = useSWR('/api/utxos', fetcher);
  const { data: status, error: statusError } = useSWR('/api/status', fetcher);
  const [checkedState, setCheckedState] = useState<Array<boolean> | undefined>(
    undefined
  );
  const [satsSelected, setSatsSelected] = useState(0);
  const [address, setAddress] = useState('');
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
      return outPointString(item.outPoint);
    });
    const selectedOutpoints = allOutpoints.filter(function (item, index) {
      return checkedState[index];
    });

    const params = {
      address: address, // optional
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

  const queueTransactionEnabled = () =>
    satsSelected >= status.round.amount + status.round.coordinatorFee;

  if (utxoError || statusError) return <div>Failed to load</div>;
  if (!utxoList || !status || queueCoinsLoading) return <div>Loading...</div>;

  return (
    <>
      <h2>COLLABORATIVE TRANSACTION</h2>
      <h3>Address (optional)</h3>
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <div>
        Address to send to. If this is not entered, an address will be generated
        from your wallet.
      </div>
      <h2>CHOOSE INPUTS</h2>
      <UTXOTable
        utxoList={utxoList}
        checkedState={checkedState}
        handleOnChange={handleOnChange}
      />
      <br />
      <div>
        {(status.round.amount + status.round.coordinatorFee).toLocaleString()}{' '}
        sats required for collaborative transaction (
        {status.round.amount.toLocaleString()} sat transaction +{' '}
        {status.round.coordinatorFee.toLocaleString()} sat fee)
      </div>
      <br />
      <SatsSelected
        satsSelected={satsSelected}
        enabled={queueTransactionEnabled}
        status={status}
      />
      <br />
      <button disabled={!queueTransactionEnabled()} onClick={handleQueueCoins}>
        QUEUE COLLABORATIVE TRANSACTION
      </button>
      <br />
      <br />
      {queueCoinsError && <div className="danger">{queueCoinsError}</div>}
    </>
  );
}
