import { ELanguage } from '@/models/language.model';
import BottomInfoPanel, { IBottomInfoPanelItem } from './BottomInfoPanel';
import { Card, CardContent, CardFooter, CardTitle } from '../ui/card';
import SeoLink from './SeoLink';

interface IArticleCardProps {
  lang: ELanguage;
  articleTitle: React.ReactNode;
  href: string;
  seoCardLinkTitle: string;
  image: React.ReactNode;
  // isTitleCentered?: boolean;
  articleDescription: React.ReactNode;
  infoPanelItems: IBottomInfoPanelItem[];
}

const ArticleCard = ({
  lang,
  articleDescription,
  articleTitle,
  image,
  infoPanelItems,
  href,
  seoCardLinkTitle,
  // isTitleCentered = false,
}: IArticleCardProps) => (
  <Card className="min-h-[410px] flex">
    <SeoLink
      href={href}
      title={seoCardLinkTitle}
      className="min-h-full flex flex-col md:flex-row items-center justify-between gap-4 p-4"
    >
      <div className="h-full flex flex-col flex-1 justify-between">
        <CardTitle className="p-6">{articleTitle}</CardTitle>
        <CardContent>
          <p className="text-muted-foreground">{articleDescription}</p>
        </CardContent>
        <CardFooter>
          <BottomInfoPanel items={infoPanelItems} lang={lang} />
        </CardFooter>
      </div>
      {image}
    </SeoLink>
  </Card>
);

export default ArticleCard;
