import useSWR from 'swr';
import Utxo from '../components/Utxo';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Create() {
  const { data: utxoList, error } = useSWR('/api/utxos', fetcher);

  if (error) return <div>Failed to load</div>;
  if (!utxoList) return <div>Loading...</div>;

  return (
    <>
      <div>
        LN-VORTEX
        <br />
        <br />
        UTXOs:
      </div>
      <ul>
        {utxoList.map((u, i) => (
          <Utxo key={i} utxo={u} />
        ))}
      </ul>
    </>
  );
}
