import { useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import UTXOTable from '../components/UTXOTable';
import SatsSelected from '../components/SatsSelected';
import { fetcher } from '../utils/convertor';
import { validCoordinator } from '../utils/validator';
import Unsupported from '../components/Unsupported';
import InputType from '../components/InputType';

const transactionType = 'OnChain';

export default function OnChain({ coordinatorName, coordinator }) {
  const { data: statusData, error: statusError } = useSWR(
    `/api/getstatus?coordinator=${coordinatorName}`,
    fetcher
  );
  const { data: utxoList, error: utxoError } = useSWR('/api/utxos', fetcher);
  const [checkedState, setCheckedState] = useState<Array<boolean> | undefined>(
    undefined
  );
  const [utxosSelected, setUtxosSelected] = useState<Array<any>>([]);
  const [satsSelected, setSatsSelected] = useState(0);
  const [address, setAddress] = useState('');
  const [queueCoinsError, setQueueCoinsError] = useState('');
  const [queueCoinsLoading, setQueueCoinsLoading] = useState(false);
  const router = useRouter();

  const handleOnChange = (position: number) => {
    const changedUtxo = utxoList[position];
    const initialCheckedState = !checkedState
      ? new Array(utxoList.length).fill(false)
      : checkedState;

    if (initialCheckedState[position]) {
      setUtxosSelected(
        utxosSelected.filter(function (utxo) {
          return utxo.outPoint !== changedUtxo.outPoint;
        })
      );
      setSatsSelected(satsSelected - changedUtxo.amount);
    } else {
      utxosSelected.push(changedUtxo);
      setSatsSelected(satsSelected + changedUtxo.amount);
    }

    setCheckedState(
      initialCheckedState.map((item, index) =>
        index === position ? !item : item
      )
    );
  };

  const handleQueueCoins = async () => {
    setQueueCoinsError('');
    setQueueCoinsLoading(true);

    const selectedOutpoints = utxosSelected.map(function (item) {
      return item.outPoint;
    });

    const params: any = {
      coordinator: coordinatorName,
      outpoints: selectedOutpoints,
    };
    if (address) params.address = address;

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
        pathname: '/',
        query: { coordinator: coordinatorName },
      });
    }
  };

  const zeroFees = () => {
    if (utxosSelected.length != 1) return false;
    else if (
      utxosSelected[0].anonSet > 1 &&
      utxosSelected[0].amount == statusData.round.amount
    )
      return true;
    else return false;
  };

  const queueTransactionEnabled = () => {
    let roundAmount = statusData.round.amount;
    if (!zeroFees()) {
      roundAmount += statusData.round.coordinatorFee;
    }
    return satsSelected >= roundAmount;
  };

  if (!validCoordinator(transactionType, coordinator)) {
    return (
      <Unsupported
        coordinatorName={coordinatorName}
        transactionType={transactionType}
      />
    );
  }
  if (coordinator.inputs) return <div>Coins already queued</div>;
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
      <InputType coordinator={coordinator} />
      <UTXOTable
        utxoList={utxoList}
        checkedState={checkedState}
        coordinator={coordinator}
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
