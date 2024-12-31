import { TSearchParams } from '@/models/url.model';

export const makeUrlSearchParams = (
  searchParams: TSearchParams
): URLSearchParams => {
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else {
        params.set(key, value);
      }
    }
  });

  return params;
};

export const createURLWithParams = (
  baseURL: string,
  searchParams?: TSearchParams
): URL => {
  const url = new URL(baseURL);
  if (!searchParams) return url;

  const params = makeUrlSearchParams(searchParams);
  url.search = params.toString();

  return url;
};
