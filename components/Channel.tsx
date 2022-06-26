import Link from 'next/link';

export default function Channel({ channel }) {
  return (
    <li>
      <br />
      <div id="channel-title">{channel.alias}</div>
      <div id="channel-details">
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
