import Link from 'next/link';

export default function Channel({ channel }) {
  return (
    <li>
      {channel.alias}
      <br />
      {channel.amount}
      <br />
      {channel.shortChannelId}
      <br />
      <Link href="/channel/[id]" as={`/channel/${channel.shortChannelId}`}>
        <a>Details</a>
      </Link>
    </li>
  );
}
