import { EUrlSearchParam, TSearchParams } from '@/models/url.model';

export const validSearchParam = async (
  paramName: EUrlSearchParam,
  searchParams?: TSearchParams
) => {
  const sp = await searchParams;

  return sp && sp[paramName] && typeof sp[paramName] === 'string'
    ? decodeURIComponent(sp[paramName] as string)
    : '';
};

export const validSearchParamArray = async (
  paramName: EUrlSearchParam,
  searchParams?: TSearchParams
): Promise<undefined | string[]> => {
  const sp = await searchParams;

  if (!sp || !sp[paramName]) return undefined;

  const serPar = sp[paramName];
  if (!serPar || (Array.isArray(serPar) && serPar.length === 0))
    return undefined;

  return Array.isArray(serPar)
    ? serPar.map((par) => decodeURIComponent(par))
    : [decodeURIComponent(serPar)];
};
