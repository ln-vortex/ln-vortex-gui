import { useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import UTXOTable from '../components/UTXOTable';
import SatsSelected from '../components/SatsSelected';
import { fetcher } from '../utils/convertor';
import { validCoordinator } from '../utils/validator';
import Unsupported from '../components/Unsupported';

const transactionType = 'OnChain';

export default function Create({ coordinatorName, coordinator }) {
  if (!validCoordinator(transactionType, coordinator)) {
    return (
      <Unsupported
        coordinatorName={coordinatorName}
        transactionType={transactionType}
      />
    );
  }

  const { data: statusData, error: statusError } = useSWR(
    `/api/getstatus?coordinator=${coordinatorName}`,
    fetcher
  );
  const { data: utxoList, error: utxoError } = useSWR('/api/utxos', fetcher);
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
      return item.outPoint;
    });
    const selectedOutpoints = allOutpoints.filter(function (item, index) {
      return checkedState[index];
    });

    const params = {
      coordinator: coordinatorName,
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
      router.push({
        pathname: '/collaborativetransaction',
        query: { coordinator: coordinatorName },
      });
    }
  };

  const queueTransactionEnabled = () =>
    satsSelected >= statusData.round.amount + statusData.round.coordinatorFee;

  if (utxoError || statusError) return <div>Failed to load</div>;
  if (!utxoList || !statusData || queueCoinsLoading)
    return <div>Loading...</div>;

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
        {(
          statusData.round.amount + statusData.round.coordinatorFee
        ).toLocaleString()}{' '}
        sats required for collaborative transaction (
        {statusData.round.amount.toLocaleString()} sat transaction +{' '}
        {statusData.round.coordinatorFee.toLocaleString()} sat fee)
      </div>
      <br />
      <SatsSelected
        satsSelected={satsSelected}
        enabled={queueTransactionEnabled}
        status={statusData}
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
