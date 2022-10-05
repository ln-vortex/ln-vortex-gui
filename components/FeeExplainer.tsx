export default function FeeExplainer({
  transactionType,
  statusData,
  zeroFees,
}) {
  return (
    <>
      {zeroFees ? (
        <div>
          {`${statusData.round.amount.toLocaleString()} sats required for ${transactionType} (${statusData.round.amount.toLocaleString()} sat transaction + 0 sat fee)`}
        </div>
      ) : (
        <div>
          {`${(
            statusData.round.amount + statusData.round.coordinatorFee
          ).toLocaleString()} sats required for ${transactionType} (${statusData.round.amount.toLocaleString()} sat transaction + ${statusData.round.coordinatorFee.toLocaleString()} sat fee)`}
        </div>
      )}
    </>
  );
}
