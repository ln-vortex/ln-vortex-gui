import router from 'next/router';

export default function SupportedActions({ coordinator, coordinatorName }) {
  const navigateAction = (pathName: string) => {
    router.push({
      pathname: pathName,
      query: { coordinator: coordinatorName },
    });
  };

  return (
    <div style={{ textDecoration: 'none' }}>
      {coordinator.transactionTypes?.includes('ChannelOpen') && (
        <button
          style={{ marginRight: 20 }}
          onClick={() => navigateAction('/create-channel')}
        >
          VORTEX CHANNEL OPEN
        </button>
      )}
      {coordinator.transactionTypes?.includes('OnChain') && (
        <button
          style={{ marginRight: 20 }}
          onClick={() => navigateAction('/collaborative-transaction')}
        >
          COLLABORATIVE TRANSACTION
        </button>
      )}
    </div>
  );
}
