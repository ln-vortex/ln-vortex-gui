export default function SatsSelected({
  satsSelected,
  createChannelEnabled,
  status,
}) {
  return (
    <h2>
      <u>{satsSelected.toLocaleString()}</u> sats selected
      {!createChannelEnabled() && (
        <>
          ,{' '}
          <span className="danger">
            need{' '}
            <u>
              {(
                status.round.amount +
                status.round.mixFee -
                satsSelected
              ).toLocaleString()}
            </u>{' '}
            more
          </span>
        </>
      )}
    </h2>
  );
}
