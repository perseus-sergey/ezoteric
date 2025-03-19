import { SheetClose } from '../ui/sheet';
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

import { ESegment, NUMEROLOGY_FORM_ID } from '@/models/url.model';
import { ELanguage } from '@/models/language.model';
import SeoLink from './SeoLink';
import { HEADER_MODEL } from '@/models/header.model';
import { FileStackIcon } from 'lucide-react';
import { TarotTwoCards } from '@/svg/TarotTwoCards';
import { getHeaderTestCats } from '@/db/queriesTests';
import { NumerologyPictogram } from '@/svg/NumerologyPictogram';
import { CategoriesShape } from '@/svg/CategoriesShape';
import { cn } from '@/lib/utils/utils';

const { TESTS, CATEGORY } = ESegment;
const { links } = HEADER_MODEL;

interface IMenuLink extends React.HTMLAttributes<HTMLElement> {
  isSideMenu: boolean;
  children: React.ReactNode;
  href: string;
  title: string;
}

const MenuLink = ({ isSideMenu, children, ...props }: IMenuLink) =>
  isSideMenu ? (
    <SheetClose asChild>
      <SeoLink {...props}>{children}</SeoLink>
    </SheetClose>
  ) : (
    <SeoLink {...props}>{children}</SeoLink>
  );

interface ITestsMenu extends React.HTMLAttributes<HTMLElement> {
  lang: ELanguage;
  isSideMenu?: boolean;
}

export default async function TestsMenu({
  lang,
  isSideMenu = false,
  className,
}: ITestsMenu) {
  const categoriesFromDb = await getHeaderTestCats(lang);

  return categoriesFromDb ? (
    <DropdownMenu>
      <DropdownMenuTrigger className="font-georgia" asChild>
        <button
          className={cn(
            'font-georgia text-base outline-none px-4 py-2',
            className
          )}
        >
          {links.tests.caption[lang]}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel>{links.tests.subCaption[lang]}</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <MenuLink
              isSideMenu={isSideMenu}
              href={`/${lang}/${TESTS}`}
              className="flex items-center gap-4"
              title={links.tests.dropdownMenu.allTests.ariaLabel[lang]}
            >
              <FileStackIcon className="size-4 opacity-80" />
              {links.tests.dropdownMenu.allTests.caption[lang]}
            </MenuLink>
          </DropdownMenuItem>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <MenuLink
                isSideMenu={isSideMenu}
                href={`/${lang}/${TESTS}`}
                className="flex items-center gap-4"
                title={links.tests.dropdownMenu.allTests.ariaLabel[lang]}
              >
                <TarotTwoCards className="size-4" />
                {links.tests.dropdownMenu.testCategories.caption[lang]}
              </MenuLink>
            </DropdownMenuSubTrigger>

            <DropdownMenuPortal>
              <DropdownMenuSubContent className="font-georgia">
                {categoriesFromDb.map((cat) => (
                  <DropdownMenuItem asChild key={cat.slug}>
                    <MenuLink
                      isSideMenu={isSideMenu}
                      title={`${links.tests.dropdownMenu.testCategories.ariaLabel[lang]}${cat.name}`}
                      href={`/${lang}/${TESTS}/${CATEGORY}/${cat.slug}`}
                      className="flex items-center gap-4"
                    >
                      <CategoriesShape className="size-4" />
                      {cat.name}
                    </MenuLink>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <MenuLink
              isSideMenu={isSideMenu}
              title={links.tests.dropdownMenu.numerologyTest.ariaLabel[lang]}
              href={`/${lang}/#${NUMEROLOGY_FORM_ID}`}
              className="flex items-center gap-4"
            >
              <NumerologyPictogram lang={lang} className="size-4" />
              {links.tests.dropdownMenu.numerologyTest.caption[lang]}
            </MenuLink>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : null;
}
