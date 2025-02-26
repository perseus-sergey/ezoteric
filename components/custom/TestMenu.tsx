'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ELanguage } from '@/models/language.model';
import { ESegment, NUMEROLOGY_FORM_ID } from '@/models/url.model';
import { FileStackIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getHeaderTestCats } from '@/db/queriesTests';
import { NumerologyPictogram } from '@/svg/NumerologyPictogram';
import { TarotTwoCards } from '@/svg/TarotTwoCards';
import { CategoriesShape } from '@/svg/CategoriesShape';
import { HEADER_MODEL } from '@/models/header.model';
import SeoLink from './SeoLink';

const { CATEGORY, TESTS } = ESegment;

const {
  links: { tests },
} = HEADER_MODEL;

export default function TestMenu({ lang }: { lang: ELanguage }) {
  const [categories, setCategories] = useState<
    { slug: string; name: string }[]
  >([]);

  useEffect(() => {
    const setCats = async () => {
      try {
        const res = await getHeaderTestCats(lang);
        setCategories(res);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setCategories([]);
      }
    };
    setCats();
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="font-georgia" asChild>
        <button className="font-georgia text-base outline-none px-6 py-3">
          {tests.caption[lang]}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel>{tests.subCaption[lang]}</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem>
            <SeoLink
              href={`/${lang}/${TESTS}`}
              className="flex items-center gap-2"
              title={tests.dropdownMenu.allTests.ariaLabel[lang]}
            >
              <FileStackIcon className="size-4 opacity-80" />{' '}
              {tests.dropdownMenu.allTests.caption[lang]}
            </SeoLink>
          </DropdownMenuItem>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <SeoLink
                href={`/${lang}/${TESTS}`}
                className="flex items-center gap-2"
                title={tests.dropdownMenu.allTests.ariaLabel[lang]}
              >
                <TarotTwoCards className="size-4" />{' '}
                {tests.dropdownMenu.testCategories.caption[lang]}
              </SeoLink>
            </DropdownMenuSubTrigger>

            <DropdownMenuPortal>
              <DropdownMenuSubContent className="font-georgia">
                {categories.map((cat) => (
                  <DropdownMenuItem key={cat.slug}>
                    <SeoLink
                      title={`${tests.dropdownMenu.testCategories.ariaLabel[lang]}${cat.name}`}
                      href={`/${lang}/${TESTS}/${CATEGORY}/${cat.slug}`}
                      className="flex items-center gap-2"
                    >
                      <CategoriesShape className="size-4" /> {cat.name}
                    </SeoLink>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          <DropdownMenuItem>
            <SeoLink
              title={tests.dropdownMenu.numerologyTest.ariaLabel[lang]}
              href={`/${lang}/#${NUMEROLOGY_FORM_ID}`}
              className="flex items-center gap-2"
            >
              <NumerologyPictogram lang={lang} className="size-4" />{' '}
              {tests.dropdownMenu.numerologyTest.caption[lang]}
            </SeoLink>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
