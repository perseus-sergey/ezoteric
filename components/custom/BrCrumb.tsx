import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ELanguage } from '@/models/language.model';
import Link from 'next/link';
import { Fragment } from 'react';
import { HomeIcon } from './icons';
import { EBreadcrumb, homeAriaLabel } from '@/models/breadcrumb.model';

const BrCrumb = ({
  items,
  lang,
}: {
  items: EBreadcrumb[];
  lang: ELanguage;
}) => (
  <Breadcrumb className="w-fit my-2 py-2 px-4 bg-tertiary-gradient rounded-lg">
    <BreadcrumbList className="text-foreground font-bold">
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link href={`/${lang}`} className="hover:text-muted-foreground">
            <HomeIcon className="size-4" />
            <span className="sr-only">{homeAriaLabel[lang]}</span>
          </Link>
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbSeparator />

      {items.map(({ title, href }) =>
        href ? (
          <Fragment key={href}>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href={`/${lang}/${href}`}
                  className="hover:text-muted-foreground"
                >
                  {title}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />
          </Fragment>
        ) : (
          <BreadcrumbItem key={title}>
            <BreadcrumbPage>{title}</BreadcrumbPage>
          </BreadcrumbItem>
        )
      )}
    </BreadcrumbList>
  </Breadcrumb>
);

export default BrCrumb;
