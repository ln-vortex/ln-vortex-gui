import Link from 'next/link'

export default function Channel({ channel }) {
  return (
    <li>
      <Link href="/channel/[id]" as={`/channel/${channel.id}`}>
        <a>{channel.id}</a>
      </Link>
    </li>
  )
}
