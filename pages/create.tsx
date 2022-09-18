import { useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import UTXOTable from '../components/UTXOTable';
import SatsSelected from '../components/SatsSelected';
import { validCoordinator } from '../utils/validator';
import Unsupported from '../components/Unsupported';
import { fetcher } from '../utils/convertor';
import InputType from '../components/InputType';

const transactionType = 'ChannelOpen';

export default function Create({ coordinatorName, coordinator }) {
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
  const [nodePubkey, setNodePubkey] = useState('');
  const [host, setHost] = useState('');
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

    const params = {
      coordinator: coordinatorName,
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

  const createChannelEnabled = () => {
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
  if (statusError || utxoError) return <div>Failed to load</div>;
  if (!statusData || !utxoList || queueCoinsLoading)
    return <div>Loading...</div>;

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
        sats required for Vortex channel (
        {statusData.round.amount.toLocaleString()} sat channel +{' '}
        {statusData.round.coordinatorFee.toLocaleString()} sat fee)
      </div>
      <br />
      <SatsSelected
        satsSelected={satsSelected}
        enabled={createChannelEnabled}
        status={statusData}
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
