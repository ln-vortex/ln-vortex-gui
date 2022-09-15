export default function Unsupported({ coordinatorName, transactionType }) {
  return (
    <div>{`${transactionType} transaction type is not supported by ${coordinatorName} coordinator`}</div>
  );
}
