import { makeUrlSearchParams } from '@/lib/utils/urlMaker';
import { BLOG_PAGINATION_PARAMS } from '@/models/blog.model';
import { ELanguage } from '@/models/language.model';
import {
  ESegment,
  EUrlSearchParam,
  TUrlSearchParams,
} from '@/models/url.model';
import { TooltipSimple } from './TooltipSimple';
import SeoLink from './SeoLink';

const {
  nextPageTitle,
  previousPageTitle,
  firstPageTitle,
  lastPageTitle,
  linkTitle,
} = BLOG_PAGINATION_PARAMS;

interface IPaginationProps {
  page: number;
  offsetNumber: number;
  totalPages: number;
  searchParams?: TUrlSearchParams;
  startUrl?: string;
  lang: ELanguage;
}

const getPageNumbers = ({
  offsetNumber,
  totalPages,
  currentPage,
}: {
  offsetNumber: number;
  totalPages: number;
  currentPage: number;
}): number[] => {
  const pageNumbers = [];

  for (
    let i = currentPage - offsetNumber;
    i <= currentPage + offsetNumber;
    i += 1
  ) {
    if (i >= 1 && i <= totalPages) {
      pageNumbers.push(i);
    }
  }

  return pageNumbers;
};

const minSizeSmallStyle = 'min-w-7 min-h-7';
const minSizeBigStyle = 'sm:min-w-9 sm:min-h-9';
const listItemBaseStyle = `${minSizeSmallStyle} ${minSizeBigStyle} flex flex-wrap justify-center items-center font-normal no-underline border border-solid border-black/25 border-l-0`;
const listItemStyle = `${listItemBaseStyle} text-white/85 hover:bg-white/20 active:border-l-[1px] active:shadow shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.35)]`;
const currentPageNStyle = `${listItemBaseStyle} pt-0.5 sm:pt-1 text-white bg-white/35 cursor-default pointer-events-none shadow-[inset_0px_2px_1px_0px_rgba(0,0,0,0.25)]`;

const Pagination = ({
  page,
  offsetNumber,
  totalPages,
  searchParams,
  startUrl,
  lang,
}: IPaginationProps) => {
  if (!searchParams && startUrl === undefined) return null;

  const setPageUrl = (value: number): string => {
    const urlSearchParams = makeUrlSearchParams(searchParams || {});

    if (startUrl !== undefined) {
      if (value === 1) return `${startUrl}?${urlSearchParams.toString()}`;

      return `${startUrl}/${ESegment.PAGE}/${value}?${urlSearchParams.toString()}`;
    }

    if (value === 1) {
      //eslint-disable-next-line drizzle/enforce-delete-with-where
      urlSearchParams.delete(EUrlSearchParam.PAGE);
    } else {
      urlSearchParams.set(EUrlSearchParam.PAGE, `${value}`);
    }

    return `?${urlSearchParams.toString()}`;
  };

  const pageNumbers = getPageNumbers({
    currentPage: page,
    offsetNumber,
    totalPages,
  });

  return (
    totalPages > 1 && (
      <nav
        className="flex justify-center py-4"
        role="navigation"
        aria-label="pagination"
      >
        <ul
          className={`shadow-[0px_3px_5px_rgba(0,0,0,0.25)] w-fit p-0 sm:p-2 bg-white/60 flex justify-center items-center border rounded`}
        >
          <Controls
            isDisabled={page === 1}
            controls={[
              {
                ariaLabel: linkTitle.firstPage[lang],
                href: setPageUrl(1),
                innerText: firstPageTitle,
              },
              {
                ariaLabel: linkTitle.previousPage[lang],
                href: setPageUrl(page - 1 || 1),
                innerText: previousPageTitle,
              },
            ]}
          />

          {pageNumbers.map((pageNumber, index) => (
            <ControlButton
              key={index}
              ariaLabel={
                page === pageNumber
                  ? `${linkTitle.currentPage[lang]}${pageNumber}`
                  : `${linkTitle.pageStartStr[lang]}${pageNumber}`
              }
              href={setPageUrl(pageNumber)}
              innerText={pageNumber}
              className={
                page === pageNumber ? currentPageNStyle : listItemStyle
              }
            />
          ))}

          <Controls
            isDisabled={page === totalPages}
            controls={[
              {
                ariaLabel: linkTitle.nextPage[lang],
                href: setPageUrl(page + 1),
                innerText: nextPageTitle,
              },
              {
                ariaLabel: linkTitle.lastPage[lang],
                href: setPageUrl(totalPages),
                innerText: lastPageTitle,
              },
            ]}
          />
        </ul>
      </nav>
    )
  );
};

interface IPrps extends React.HTMLAttributes<HTMLElement> {
  ariaLabel: string;
  href: string;
  innerText: string | number;
}

const ControlButton = ({ ariaLabel, href, innerText, className }: IPrps) => (
  <li className="bg-cyan-600">
    <TooltipSimple content={ariaLabel}>
      <SeoLink
        className={className || listItemStyle}
        href={href}
        title={ariaLabel}
      >
        {innerText}
      </SeoLink>
    </TooltipSimple>
  </li>
);

const ControlDisabled = ({ innerText }: { innerText: string | number }) => (
  <li>
    <div
      className={`${listItemStyle} bg-stone-500/70 text-stone-200 cursor-default pointer-events-none`}
      aria-disabled="true"
    >
      {innerText}
    </div>
  </li>
);

interface IControlsProps extends React.HTMLAttributes<HTMLElement> {
  controls: IPrps[];
  isDisabled: boolean;
}

const Controls = ({ controls, isDisabled }: IControlsProps) =>
  isDisabled
    ? controls.map((contr) => (
        <ControlDisabled key={contr.innerText} innerText={contr.innerText} />
      ))
    : controls.map((attr) => <ControlButton {...attr} key={attr.innerText} />);

export default Pagination;
