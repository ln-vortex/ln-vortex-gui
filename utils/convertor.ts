export const convertQueryParamToString = (param: string | string[]): string => {
  return Array.isArray(param) ? param[0] : param;
};

export const fetcher = (url) => fetch(url).then((res) => res.json());
