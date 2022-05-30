import { useState } from 'react';
import useSWR from 'swr';
import Header from '../components/Header';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Create() {
  const { data: utxoList, error: utxoError } = useSWR('/api/utxos', fetcher);
  const { data: status, error: statusError } = useSWR('/api/status', fetcher);
  const [checkedState, setCheckedState] = useState();
  const [satsSelected, setSatsSelected] = useState(0);

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

  const truncate = (input) =>
    input.length > 20 ? `${input.substring(0, 20)}...` : input;

  if (utxoError || statusError) return <div>Failed to load</div>;
  if (!utxoList || !status) return <div>Loading...</div>;

  return (
    <>
      <Header />
      <div>CHOOSE INPUTS</div>
      <table>
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">OUTPOINT</th>
            <th scope="col">AMOUNT</th>
            <th scope="col">ADDRESS</th>
            <th scope="col">CONFIRMED?</th>
          </tr>
        </thead>
        <tbody>
          {utxoList.map(({ outPoint, amount, address, confirmed }, index) => (
            <tr
              key={index}
              className={checkedState && checkedState[index] ? 'selected' : ''}
            >
              <th scope="row">
                <input
                  type="checkbox"
                  id={`custom-checkbox-${index}`}
                  name={outPoint}
                  value={outPoint}
                  checked={checkedState ? checkedState[index] : false}
                  onChange={() => handleOnChange(index)}
                />
              </th>
              <td>
                <label htmlFor={`custom-checkbox-${index}`}>
                  {truncate(outPoint)}
                </label>
              </td>
              <td>
                <div className="">{amount.toLocaleString()} sats</div>
              </td>
              <td>{truncate(address)}</td>
              <td>{confirmed ? 'YES' : 'NO'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <div>
        {(status.round.amount + status.round.mixFee).toLocaleString()} sats
        required for Vortex channel ({status.round.amount.toLocaleString()} sat
        channel + {status.round.mixFee.toLocaleString()} sat fee)
      </div>
      <br />
      {satsSelected >= status.round.amount + status.round.mixFee ? (
        <div>
          {(status.round.amount + status.round.mixFee).toLocaleString()} sats
          selected
        </div>
      ) : (
        <div>
          {satsSelected.toLocaleString()} sats selected, need{' '}
          {(
            status.round.amount +
            status.round.mixFee -
            satsSelected
          ).toLocaleString()}{' '}
          more
        </div>
      )}
    </>
  );
}
