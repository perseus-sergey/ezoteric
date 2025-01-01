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
  date: Date;
}

const ArticleCard = ({
  // lang,
  articleDescription,
  articleTitle,
  image,
  infoPanelItems,
  href,
  seoCardLinkTitle,
  date,
  // isTitleCentered = false,
}: IArticleCardProps) => (
  <Card>
    <SeoLink href={href} title={seoCardLinkTitle}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4">
        <div>
          <CardHeader>
            <CardTitle>{articleTitle}</CardTitle>
            <CardDescription>
              {date.toLocaleDateString('en-CA')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{articleDescription}</p>
          </CardContent>
          <CardFooter>
            <BottomInfoPanel items={infoPanelItems} />
          </CardFooter>
        </div>
        {image && image}
      </div>
    </SeoLink>
  </Card>
);

export default ArticleCard;
