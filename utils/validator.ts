export const validCoordinator = (transactionType: string, coordinator) => {
  return coordinator.transactionTypes.includes(transactionType);
};
