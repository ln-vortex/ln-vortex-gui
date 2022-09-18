import Link from 'next/link';
import { useRouter } from 'next/router';

export default function SupportedTransactionTypes({
  coordinator,
  coordinatorName,
  onClick = () => {},
}) {
  return (
    <div style={{ textDecoration: 'none' }}>
      {coordinator.transactionTypes?.includes('ChannelOpen') && (
        <Link href={`/create-channel?coordinator=${coordinatorName}`}>
          <a onClick={onClick} className={'actions'}>
            Vortex channel open
          </a>
        </Link>
      )}
      {coordinator.transactionTypes?.includes('OnChain') && (
        <Link
          href={`/collaborative-transaction?coordinator=${coordinatorName}`}
        >
          <a onClick={onClick} className={'actions'}>
            Collaborative transaction
          </a>
        </Link>
      )}
    </div>
  );
}
