import { truncate } from '../utils/convertor';

export default function UTXOTable({
  utxoList,
  checkedState = [],
  coordinator,
  handleOnChange = (index: number) => {},
  selectable = true,
}) {
  return (
    <table className="utxo-table">
      <thead>
        <tr>
          {selectable && <th scope="col"></th>}
          <th scope="col">OUTPOINT</th>
          <th scope="col">AMOUNT</th>
          <th scope="col">ANON SET</th>
          <th scope="col">ADDRESS</th>
          <th scope="col">CONFIRMED?</th>
        </tr>
      </thead>
      <tbody>
        {utxoList.map(
          (
            { outPoint, amount, address, anonSet, confirmed, scriptType },
            index
          ) => {
            const disabled = coordinator.round.inputType !== scriptType;
            return (
              <tr
                key={index}
                className={
                  disabled
                    ? 'disabled'
                    : checkedState && checkedState[index]
                    ? 'selected'
                    : ''
                }
              >
                {selectable && (
                  <th scope="row">
                    <input
                      type="checkbox"
                      id={`custom-checkbox-${index}`}
                      name={outPoint}
                      value={outPoint}
                      checked={checkedState ? checkedState[index] : false}
                      disabled={disabled}
                      onChange={() => handleOnChange(index)}
                    />
                  </th>
                )}
                <td>
                  <label htmlFor={`custom-checkbox-${index}`}>
                    {truncate(outPoint)}
                  </label>
                </td>
                <td>
                  <div className="">{amount.toLocaleString()} sats</div>
                </td>
                <td>{anonSet.toLocaleString()}</td>
                <td>{truncate(address)}</td>
                <td className={confirmed ? 'success' : 'danger'}>
                  {confirmed ? 'YES' : 'NO'}
                </td>
              </tr>
            );
          }
        )}
      </tbody>
    </table>
  );
}
