'use client';

import useSearch from '@/lib/hooks/useSearch';
// import { ELanguage } from '@/models/language.model';
import { EUrlSearchParam } from '@/models/url.model';
import { Button } from '../ui/button';
import { X } from 'lucide-react';
import { Input } from '../ui/input';

// interface IFilterProps {
//   startUrl: string;
//   lang: ELanguage;
//   idName: string;
//   placeholder: string;
//   labelTitle: string;
//   searchQueryTitle: EUrlSearchParam;
//   resetButton?: { ariaLabel: string; content: string };
// }

export default function SearchInput({ startUrl }: { startUrl: string }) {
  const { searchValue, inputRef, handleSearchDebounced, cancelClickHandler } =
    useSearch(startUrl, EUrlSearchParam.QUERY, 700);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <Input
        ref={inputRef}
        type="text"
        defaultValue={searchValue}
        onChange={(e) => handleSearchDebounced(e.target.value)}
        placeholder="🔍 Введіть пошуковий запит..."
        className="pr-10"
        aria-label="Пошук статей у блозі"
      />

      {searchValue && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-primary/20"
          onClick={cancelClickHandler}
          aria-label="Очистити пошук"
        >
          <X className="size-5 text-gray-500" />
        </Button>
      )}
    </div>
  );
}
