import Vortex from '../assets/vortex.svg';
import { getMempoolLink, getNetworkString } from '../utils/convertor';

export default function Transaction({ transaction, network }) {
  const networkString = getNetworkString(network);
  const mempoolLink = getMempoolLink(networkString, `tx/${transaction.txId}`);

  return (
    <li>
      <br />
      <div id="listitem-title">
        <span style={{ float: 'left' }}>
          {transaction.isVortex && (
            <Vortex width="28" height="28" viewBox="0 0 21 25" />
          )}
          <span style={{ position: 'absolute' }}>{transaction.txId}</span>
        </span>
      </div>
      <div id="listitem-details">
        <div className="bold-text">Confirmations</div>
        <div>{transaction.numConfirmations.toLocaleString()}</div>
        <div className="bold-text">Block Height</div>
        <div>{transaction.blockHeight}</div>
      </div>
      {network !== 'regtest' && (
        <a target="_blank" href={mempoolLink} rel="noopener noreferrer">
          Details
        </a>
      )}
    </li>
  );
}
