import useSWR, { useSWRConfig } from 'swr';
import { useRouter } from 'next/router';
import Status from '../components/Status';
import InputsScheduled from '../components/InputsScheduled';
import { useState } from 'react';
import UTXOTable from '../components/UTXOTable';
import { fetcher } from '../utils/convertor';
import { validCoordinator } from '../utils/validator';
import Unsupported from '../components/Unsupported';

const transactionType = 'OnChain';

export default function Index({ coordinatorName, coordinator }) {
  const { data: statusData, error: statusError } = useSWR(
    `/api/getstatus?coordinator=${coordinatorName}`,
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

    const params = {
      coordinator: coordinatorName,
    };
    const response = await fetch('/api/cancelcoins', {
      method: 'POST',
      body: JSON.stringify({ params }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();

    if (data.error) {
      setCancelCoinsError(data.error);
    } else {
      mutate(`/api/getstatus?coordinator=${coordinatorName}`);
    }

    setCancelCoinsLoading(false);
  };

  if (!validCoordinator(transactionType, coordinator)) {
    return (
      <Unsupported
        coordinatorName={coordinatorName}
        transactionType={transactionType}
      />
    );
  }
  if (statusError || utxoError) return <div>Failed to load</div>;
  if (!statusData || !utxoList || cancelCoinsLoading)
    return <div>Loading...</div>;

  return (
    <>
      <h2>On-Chain Coordinator Status</h2>
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
              CANCEL COLLABORATIVE TRANSACTION
            </button>
          </div>
          <br />
          <br />
          {cancelCoinsError && <div className="danger">{cancelCoinsError}</div>}
        </>
      )}
      {!statusData.inputs && (
        <>
          <h2>UTXOs</h2>
          <UTXOTable utxoList={utxoList} selectable={false}></UTXOTable>
          <br />
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => {
                router.push({
                  pathname: '/onchain',
                  query: { coordinator: coordinatorName },
                });
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
