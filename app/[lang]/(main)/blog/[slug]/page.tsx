import * as React from 'react';

import BottomInfoPanel from '@/components/custom/BottomInfoPanel';
import DangerHtml from '@/components/custom/DangerHtml';
import TextUnderH1 from '@/components/custom/TextUnderH1';
import { Title } from '@/components/custom/Title';
import { getArticleBySlug, updateArticleView } from '@/db/queriesArticle';
import { getFormattedDateStrYearFirst } from '@/lib/utils/dates';
import { getELangKey } from '@/lib/utils/getLanguage';
import { isFileExists } from '@/lib/utils/imagePathValidate';
import { IMG_PROPERTIES } from '@/models/image.model';
import { INFO_PANEL_TITLES } from '@/models/infoPanel.model';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ESegment, TParams } from '@/models/url.model';
import BrCrumb from '@/components/custom/BrCrumb';
import { ARTICLE_IMG, ARTICLE_LIST } from '@/models/article.model';
import { isAdminAuth } from '@/lib/utils/loggedUser';
import Link from 'next/link';
import { PencilLine } from 'lucide-react';

const { MASTER, BLOG, ARTICLE_EDIT } = ESegment;

export default async function Page({ params }: { params: TParams }) {
  const p = await params;
  const lang = getELangKey(p.lang);
  const { slug } = p;

  const article = await getArticleBySlug({ lang, slug });

  if (!article) notFound();

  const { title, text, description, updatedAt, imageName, view, id } = article;

  const currDate = getFormattedDateStrYearFirst(updatedAt);

  const imgPath = `${ARTICLE_IMG.path}${imageName || `${slug}.jpg`}`;
  const isImgExists = isFileExists(imgPath);

  const isAdmin = await isAdminAuth();

  await updateArticleView(id);

  return (
    <article className="relative mx-auto">
      <BrCrumb
        items={[
          {
            title: ARTICLE_LIST.h1Title[lang],
            href: ESegment.BLOG,
          },
          { title },
        ]}
        lang={lang}
      />

      <Title>{title}</Title>

      {isAdmin && (
        <Link href={`/${lang}/${MASTER}/${BLOG}/${ARTICLE_EDIT}/${id}`}>
          <PencilLine className="size-4 text-muted-foreground" />
        </Link>
      )}

      {description && <TextUnderH1>{description}</TextUnderH1>}

      {isImgExists && (
        <Image
          className="my-4 mx-auto sm:border-2 border-white sm:shadow-md rounded"
          src={imgPath}
          alt={ARTICLE_IMG.getAlt(title)[lang]}
          placeholder="blur"
          blurDataURL={IMG_PROPERTIES.defaultImgBlur}
          {...ARTICLE_IMG.size}
        />
      )}

      <div className="article-text px-4 py-2">
        <DangerHtml text={text} />
      </div>

      <BottomInfoPanel
        items={[
          {
            name: INFO_PANEL_TITLES.views[lang],
            value: (view || 0) + 1,
          },
          {
            name: INFO_PANEL_TITLES.date[lang],
            value: <time dateTime={currDate}>{currDate}</time>,
          },
        ]}
      />
    </article>
  );
}
