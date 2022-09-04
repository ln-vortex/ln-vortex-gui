export default function InputsScheduled({ inputs }) {
  return (
    <>
      {inputs.map((input, index) => (
        <li key={index}>
          <br />
          <div id="listitem-title">
            <span>{input.outPoint}</span>
          </div>
          <div id="listitem-details">
            <div className="bold-text">Amount</div>
            <div>{input.output.value.toLocaleString()} sats</div>
            <div className="bold-text">Script Pubkey</div>
            <div>{input.output.scriptPubKey}</div>
          </div>
        </li>
      ))}
    </>
  );
}
