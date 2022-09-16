import Link from 'next/link';
import { useRouter } from 'next/router';

export default function SupportedTransactionTypes({
  coordinator,
  coordinatorName,
  onClick = () => {},
}) {
  const router = useRouter();

  return (
    <>
      {coordinator.transactionTypes?.includes('ChannelOpen') && (
        <Link href={`/create?coordinator=${coordinatorName}`}>
          <a
            onClick={onClick}
            className={
              router.pathname == '/create' ? 'current-action' : 'actions'
            }
          >
            Vortex channel open
          </a>
        </Link>
      )}
      {coordinator.transactionTypes?.includes('OnChain') && (
        <Link href={`/onchain?coordinator=${coordinatorName}`}>
          <a
            onClick={onClick}
            className={
              router.pathname == '/onchain' ? 'current-action' : 'actions'
            }
          >
            Collaborative transaction
          </a>
        </Link>
      )}
    </>
  );
}
