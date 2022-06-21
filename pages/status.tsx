import { useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Index() {
  const { data: statusData, error } = useSWR('/api/status', fetcher);
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

  if (error) return <div>Failed to load</div>;
  if (!statusData || cancelCoinsLoading) return <div>Loading...</div>;

  return (
    <>
      <h2>Status</h2>
      {statusData.status}
      {statusData.inputs && (
        <>
          <ul>
            {statusData.inputs.map((input, index) => (
              <>
                <li>
                  outpoint: {input.outPoint}
                  <br />
                  amount: {input.output.value}
                </li>
                <br />
              </>
            ))}
          </ul>
          <button onClick={handleCancelCoins}>CANCEL CHANNEL OPEN</button>
          <br />
          <br />
          {cancelCoinsError && <div className="danger">{cancelCoinsError}</div>}
        </>
      )}
    </>
  );
}
