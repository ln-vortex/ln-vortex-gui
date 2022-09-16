export default function Status({ statusData, coordinatorName }) {
  const round = statusData.round;
  const roundTime = new Date(round.time * 1000);

  return (
    <li>
      <br />
      <div id="listitem-details">
        <div className="bold-text">Name</div>
        <div>{coordinatorName}</div>
        <div className="bold-text">Status</div>
        <div>{statusData.status}</div>
        {statusData.nodeIdOpt && (
          <>
            <div className="bold-text">Node Pubkey</div>
            <div>{statusData.nodeIdOpt}</div>
          </>
        )}
        {statusData.peerAddrOpt && (
          <>
            <div className="bold-text">Host</div>
            <div>{statusData.peerAddrOpt}</div>
          </>
        )}
        <div className="bold-text">Next round time</div>
        <div>{roundTime.toUTCString()}</div>
        <div className="bold-text">Amount</div>
        <div>{round.amount.toLocaleString()} sats</div>
        <div className="bold-text">Fee</div>
        <div>{round.coordinatorFee.toLocaleString()} sats</div>
        <div className="bold-text">Max participants</div>
        <div>{round.maxPeers}</div>
      </div>
    </li>
  );
}
