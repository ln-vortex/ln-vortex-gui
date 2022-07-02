export default function UTXOTable({
  utxoList,
  checkedState,
  handleOnChange,
  selectable = true,
}) {
  const truncate = (input) =>
    input.length > 20 ? `${input.substring(0, 20)}...` : input;

  return (
    <table className="utxo-table">
      <thead>
        <tr>
          {selectable && <th scope="col"></th>}
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
            {selectable && (
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
            )}
            <td>
              <label htmlFor={`custom-checkbox-${index}`}>
                {truncate(outPoint)}
              </label>
            </td>
            <td>
              <div className="">{amount.toLocaleString()} sats</div>
            </td>
            <td>{truncate(address)}</td>
            <td className={confirmed ? 'success' : 'danger'}>
              {confirmed ? 'YES' : 'NO'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
