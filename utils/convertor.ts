export const convertQueryParamToString = (param: string | string[]): string => {
  return Array.isArray(param) ? param[0] : param;
};

export function scriptTypeToString(scriptType: string): string {
  switch (scriptType.toLowerCase()) {
    case 'witness_v0_keyhash':
      return 'P2WPKH (bc1q...)';
    case 'witness_v0_scripthash':
      return 'P2WSH (Lightning Channel)';
    case 'witness_v1_taproot':
      return 'Taproot (bc1p...)';
    case 'scripthash':
      return 'P2SH (3...)';
    case 'pubkeyhash':
      return 'P2PKH (1...)';
    case 'pubkey':
      return 'P2PK (Legacy)';
    default:
      return scriptType;
  }
}

export const fetcher = (url) => fetch(url).then((res) => res.json());

export const truncate = (input) =>
  input.length > 16
    ? `${input.substring(0, 8)}...${input.substring(input.length - 8)}`
    : input;

export const getNetworkString = (network: string) => {
  let str = network.toLowerCase();
  if (str === 'testnet3') str = str.slice(0, -1);
  return str;
};

export const getMempoolLink = (networkString: string, extension: string) => {
  let link = 'https://mempool.space/';
  if (networkString !== 'mainnet') link = link + networkString + '/';
  return `${link}${extension}`;
};
