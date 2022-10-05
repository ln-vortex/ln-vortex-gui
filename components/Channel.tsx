import Vortex from '../assets/vortex.svg';
import { getMempoolLink, getNetworkString } from '../utils/convertor';

export default function Channel({ channel, network }) {
  const channelState: string =
    channel.shortChannelId === '0x0x0'
      ? 'Pending'
      : channel.active
      ? 'Active'
      : 'Inactive';

  const channelStateClass = channelState.toLowerCase();
  const networkString = getNetworkString(network);
  const mempoolLink = getMempoolLink(
    networkString,
    `lightning/channel/${channel.channelId}`
  );

  return (
    <li>
      <br />
      <div id="listitem-title">
        <span style={{ float: 'left' }}>
          {channel.anonSet > 1 && (
            <Vortex width="28" height="28" viewBox="0 0 21 25" />
          )}
          <span style={{ position: 'absolute' }}>{channel.alias}</span>
        </span>
        <span className={channelStateClass} style={{ float: 'right' }}>
          {channelState}
        </span>
      </div>
      <div id="listitem-details">
        <div className="bold-text">Capacity</div>
        <div>{channel.amount.toLocaleString()} sats</div>
        <div className="bold-text">Channel ID</div>
        <div>{channel.shortChannelId}</div>
      </div>
      {network !== 'regtest' && (
        <a target="_blank" href={mempoolLink} rel="noopener noreferrer">
          Details
        </a>
      )}
    </li>
  );
}
