import * as motion from 'motion/react-client';
import { ELanguage } from '@/models/language.model';
import BottomInfoPanel from './BottomInfoPanel';
import { Card, CardContent, CardFooter, CardTitle } from '../ui/card';
import SeoLink from './SeoLink';
import { IMG_PROPERTIES } from '@/models/image.model';
import { TEST_IMG, TTestLocalized } from '@/models/test.model';
import { TESTS_CARD_IMAGE, getSeoCardLinkTitle } from '@/models/tests.model';
import { ESegment } from '@/models/url.model';
import { cutText } from '@/lib/utils/cutText';
import { getImageSrc } from '@/controllers/articles.controller';
import { INFO_PANEL_CAPTION } from '@/models/infoPanel.model';
import { getFormattedDateStrYearFirst } from '@/lib/utils/dates';
import ValidImage from './ValidImage';
import { Badge } from '../ui/badge';
import Link from 'next/link';

interface ITestCardProps {
  lang: ELanguage;
  test: TTestLocalized;
}

const { TESTS, CATEGORY } = ESegment;

const TestCard = ({ lang, test }: ITestCardProps) => {
  const imgSrc = getImageSrc(test.slug, test.imageSrc);
  const currDate = getFormattedDateStrYearFirst(test.updatedAt);

  return (
    <Card className="min-h-[410px] flex flex-col md:flex-row items-center justify-between gap-4 p-4">
      <div className="h-full flex flex-col flex-1 justify-between">
        <CardTitle className="p-6">
          <SeoLink
            href={`/${lang}/${TESTS}/${test.slug}`}
            title={getSeoCardLinkTitle(test.title)[lang]}
          >
            {test.title}
          </SeoLink>
        </CardTitle>

        <CardContent>
          <p className="text-muted-foreground">
            {cutText(test.description, 250)}
          </p>
        </CardContent>

        <CardFooter className="flex-col items-start gap-4">
          <motion.div
            className="list-none"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: 'spring' }}
          >
            <Badge variant="outline">
              <Link
                className="text-nowrap"
                href={`/${lang}/${TESTS}/${CATEGORY}/${test.category.slug}`}
              >
                {test.category.name}
              </Link>
            </Badge>
          </motion.div>

          <BottomInfoPanel
            items={[
              {
                caption: INFO_PANEL_CAPTION.views,
                value: test.viewCount,
              },
              {
                caption: INFO_PANEL_CAPTION.completed,
                value: test.completedCount || 0,
              },
              {
                caption: INFO_PANEL_CAPTION.date,
                value: <time dateTime={currDate}>{currDate}</time>,
              },
              // { name: commentsTitle[lang], value: comment_count },
            ]}
            lang={lang}
          />
        </CardFooter>
      </div>

      <SeoLink
        href={`/${lang}/${TESTS}/${test.slug}`}
        title={getSeoCardLinkTitle(test.title)[lang]}
      >
        <ValidImage
          defaultSrc={TESTS_CARD_IMAGE.defaultImgSrc}
          className="rounded-sm"
          sizes={`${TESTS_CARD_IMAGE.size.width * 0.7}px`}
          // sizes="(max-width: 768px) 20vw, 10vw"
          src={imgSrc}
          placeholder="blur"
          blurDataURL={IMG_PROPERTIES.defaultImgBlur}
          alt={TEST_IMG.getAlt(test.title)[lang]}
          {...TESTS_CARD_IMAGE.size}
        />
      </SeoLink>
    </Card>
  );
};

export default TestCard;
