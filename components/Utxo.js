export default function Utxo({ utxo }) {
  return (
    <li>
      <a>{utxo.outPoint}</a>
    </li>
  );
}
