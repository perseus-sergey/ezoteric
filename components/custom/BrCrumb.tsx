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
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link href={`/${lang}`}>Home</Link>
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbSeparator />

      {items.map(({ title, href }) =>
        href ? (
          <Fragment key={href}>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/${lang}/${href}`}>{title}</Link>
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
