import Link from 'next/link';

export default function Channel({ channel }) {
  return (
    <li>
      <Link href="/channel/[id]" as={`/channel/${channel.shortChannelId}`}>
        <a>{channel.shortChannelId}</a>
      </Link>
    </li>
  );
}
