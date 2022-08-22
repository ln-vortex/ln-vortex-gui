import Link from 'next/link';

export default function Channel({ channel }) {
  const channelState: string =
    channel.shortChannelId === '0x0x0'
      ? 'Pending'
      : channel.active
      ? 'Active'
      : 'Inactive';

  const channelStateClass = channelState.toLowerCase();

  return (
    <li>
      <br />
      <div id="listitem-title">
        <span style={{ float: 'left' }}>{channel.alias}</span>
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
      <Link href="/channel/[id]" as={`/channel/${channel.shortChannelId}`}>
        <a>Details</a>
      </Link>
    </li>
  );
}
