import { useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import UTXOTable from '../components/UTXOTable';
import SatsSelected from '../components/SatsSelected';
import {
  transactionEnabled,
  validCoordinator,
  zeroFeeCheck,
} from '../utils/validator';
import Unsupported from '../components/Unsupported';
import { fetcher } from '../utils/convertor';
import InputType from '../components/InputType';
import FeeExplainer from '../components/FeeExplainer';

const transactionType = 'ChannelOpen';

export default function CreateChannel({ coordinatorName, coordinator }) {
  const { data: statusData, error: statusError } = useSWR(
    `/api/getstatus?coordinator=${coordinatorName}`,
    fetcher
  );
  const { data: utxoList, error: utxoError } = useSWR(
    '/api/listutxos',
    fetcher
  );
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

    const params: any = {
      coordinator: coordinatorName,
      nodeId: nodePubkey,
      outpoints: selectedOutpoints,
    };
    if (host) params.peerAddr = host;

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

  const zeroFees = () => zeroFeeCheck(utxosSelected, statusData?.round.amount);
  const createChannelEnabled = () =>
    transactionEnabled(
      statusData?.round.amount,
      zeroFees(),
      statusData?.round.coordinatorFee,
      satsSelected
    );

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
      <FeeExplainer
        transactionType="vortex channel open"
        statusData={statusData}
        zeroFees={zeroFees()}
      />
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
