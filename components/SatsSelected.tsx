export default function SatsSelected({ satsSelected, enabled, status }) {
  return (
    <h2>
      <u>{satsSelected.toLocaleString()}</u> sats selected
      {!enabled() && (
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
