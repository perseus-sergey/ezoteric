import * as React from 'react';

import BottomInfoPanel from '@/components/custom/BottomInfoPanel';
import DangerHtml from '@/components/custom/DangerHtml';
import TextUnderH1 from '@/components/custom/TextUnderH1';
import { Title } from '@/components/custom/Title';
import { getArticleBySlug, updateArticleView } from '@/db/queriesArticle';
import { getFormattedDateStrYearFirst } from '@/lib/utils/dates';
import { getELangKey } from '@/lib/utils/getLanguage';
import { isFileExists } from '@/lib/utils/imagePathValidate';
import { ARTICLE_IMG } from '@/models/article.model';
import { IMG_PROPERTIES } from '@/models/image.model';
import { INFO_PANEL_TITLES } from '@/models/infoPanel.model';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { TParams } from '@/models/url.model';

export default async function Page({ params }: { params: TParams }) {
  const p = await params;
  const lang = getELangKey(p.lang);
  const { slug } = p;

  const article = await getArticleBySlug({ lang, slug });

  if (!article) notFound();

  const currDate = getFormattedDateStrYearFirst(article.updatedAt);

  const imgPath = `${ARTICLE_IMG.path}${article.imageName || ` ${slug}.jpg`}`;

  const isImgExists = isFileExists(imgPath);

  await updateArticleView(article.id);

  return (
    <article className="relative mx-auto">
      <Title>{article.title}</Title>

      {article.description && <TextUnderH1>{article.description}</TextUnderH1>}

      {isImgExists && (
        <Image
          className="my-4 mx-auto sm:border-2 border-white sm:shadow-md rounded"
          src={imgPath}
          alt={ARTICLE_IMG.getAlt(article.title)[lang]}
          placeholder="blur"
          blurDataURL={IMG_PROPERTIES.defaultImgBlur}
          {...ARTICLE_IMG.size}
        />
      )}

      <div className="article-text">
        <DangerHtml text={article.text} />
      </div>

      <BottomInfoPanel
        items={[
          {
            name: INFO_PANEL_TITLES.views[lang],
            value: (article.view || 0) + 1,
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
