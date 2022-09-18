export const validCoordinator = (transactionType: string, coordinator) => {
  return coordinator.transactionTypes.includes(transactionType);
};

export const zeroFeeCheck = (utxosSelected: Array<any>, amount: number = 0) => {
  if (utxosSelected.length != 1) return false;
  else if (utxosSelected[0].anonSet > 1 && utxosSelected[0].amount == amount)
    return true;
  else return false;
};

export const transactionEnabled = (
  roundAmount: number = 0,
  zeroFees: boolean,
  coordinatorFee: number = 0,
  satsSelected: number
) => {
  if (!zeroFees) {
    roundAmount += coordinatorFee;
  }
  return satsSelected >= roundAmount;
};
