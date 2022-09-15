export const convertQueryParamToString = (param: string | string[]): string => {
  return Array.isArray(param) ? param[0] : param;
};
