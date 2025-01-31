import { EUrlSearchParam } from '@/models/url.model';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRef, useMemo } from 'react';
import { useDebouncedCallback } from 'use-debounce';

const useSearch = (
  startUrl: string,
  searchQueryTitle: EUrlSearchParam,
  debounceDelay = 300
) => {
  const searchParams = useSearchParams();
  const { replace, refresh } = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Отримуємо поточне значення пошуку динамічно
  const searchValue = useMemo(
    () => searchParams.get(searchQueryTitle)?.toString() || '',
    [searchParams, searchQueryTitle]
  );

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString()); // Явне копіювання

    const page = params.get(EUrlSearchParam.PAGE);

    if (page && page !== '1') params.set(EUrlSearchParam.PAGE, '1');

    if (term) {
      params.set(searchQueryTitle, term);
    } else {
      // eslint-disable-next-line drizzle/enforce-delete-with-where
      params.delete(searchQueryTitle);
    }

    replace(`${startUrl}?${params.toString()}`);
    refresh(); // Завжди оновлюємо сторінку для актуального стану
  };

  const handleSearchDebounced = useDebouncedCallback(
    handleSearch,
    debounceDelay
  );

  const cancelClickHandler = () => {
    if (!inputRef.current) return;
    handleSearch('');
    inputRef.current.value = '';
  };

  return {
    searchValue,
    inputRef,
    handleSearchDebounced,
    cancelClickHandler,
  };
};

export default useSearch;
