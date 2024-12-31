// import { ELanguage } from '@/models/language.model';
import BottomInfoPanel, { IBottomInfoPanelItem } from './BottomInfoPanel';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import SeoLink from './SeoLink';

interface IArticleCardProps {
  // lang: ELanguage;
  articleTitle: React.ReactNode;
  href: string;
  seoCardLinkTitle: string;
  image?: React.ReactNode;
  // isTitleCentered?: boolean;
  articleDescription: React.ReactNode;
  infoPanelItems: IBottomInfoPanelItem[];
}

const ArticleCard = ({
  // lang,
  articleDescription,
  articleTitle,
  image,
  infoPanelItems,
  href,
  seoCardLinkTitle,
  // isTitleCentered = false,
}: IArticleCardProps) => (
  <Card>
    <SeoLink href={href} title={seoCardLinkTitle}>
      <CardHeader>
        <CardTitle>{articleTitle}</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4">
          {articleDescription}
          {image && image}
        </div>
      </CardContent>
      <CardFooter>
        <BottomInfoPanel items={infoPanelItems} />
      </CardFooter>
    </SeoLink>
  </Card>
);

export default ArticleCard;
