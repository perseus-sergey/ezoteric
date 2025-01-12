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

interface EBreadcrumb {
  title: string;
  href?: string;
}

const BrCrumb = ({
  items,
  lang,
}: {
  items: EBreadcrumb[];
  lang: ELanguage;
}) => (
  <Breadcrumb className="w-fit my-2 py-2 px-4 bg-gradient-to-b from-tertiary/20 to-tertiary/20 via-tertiary rounded-lg">
    <BreadcrumbList className="text-foreground font-bold">
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link href={`/${lang}`} className="hover:text-muted-foreground">
            Home
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
