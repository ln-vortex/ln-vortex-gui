import { scriptTypeToString } from '../utils/convertor';

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
        {round.status && (
          <>
            <div className="bold-text">Status Message</div>
            <div>{round.status}</div>
          </>
        )}
        <div className="bold-text" style={{ marginBottom: 20 }}>
          Next round time
        </div>
        <div>{roundTime.toUTCString()}</div>

        <div className="bold-text" style={{ textDecoration: 'underline' }}>
          Round Details
        </div>
        <div>
          <br />
        </div>
        <div className="bold-text">Amount</div>
        <div>{round.amount.toLocaleString()} sats</div>
        <div className="bold-text">Fee</div>
        <div>{round.coordinatorFee.toLocaleString()} sats</div>
        <div className="bold-text">Max participants</div>
        <div>{round.maxPeers}</div>
        <div className="bold-text">Input Type</div>
        <div>{scriptTypeToString(round.inputType)}</div>
        <div className="bold-text">Change Type</div>
        <div>{scriptTypeToString(round.changeType)}</div>
        <div className="bold-text">Output Type</div>
        <div>{scriptTypeToString(round.outputType)}</div>

        {(statusData.nodeIdOpt || statusData.addressOpt) && (
          <>
            <div
              className="bold-text"
              style={{ textDecoration: 'underline', marginTop: 20 }}
            >
              Round Inputs
            </div>
            <div>
              <br />
            </div>
          </>
        )}
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
        {statusData.addressOpt && (
          <>
            <div className="bold-text">Send to address</div>
            <div>{statusData.addressOpt}</div>
          </>
        )}
        {statusData.addressOpt && (
          <>
            <div className="bold-text">Requeue coins?</div>
            <div>{statusData.requeue ? 'Yes' : 'No'}</div>
          </>
        )}
      </div>
    </li>
  );
}
