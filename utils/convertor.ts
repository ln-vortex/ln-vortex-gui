export const outPointString = (outPoint: any) => {
  return outPoint.txid + ':' + outPoint.vout;
};
