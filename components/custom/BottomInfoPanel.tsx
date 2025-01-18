import { ReactNode } from 'react';
import { localeStringMaker } from '@/lib/utils/localeStringMaker';
import { TBottomInfoPanelCaption } from '@/models/infoPanel.model';
import { ELanguage } from '@/models/language.model';

export interface IBottomInfoPanelItem {
  caption: TBottomInfoPanelCaption;
  value: ReactNode | null;
}

interface IBottomInfoPanel {
  items: IBottomInfoPanelItem[];
  lang: ELanguage;
}

const BottomInfoPanel = ({ items, lang }: IBottomInfoPanel) => {
  const filteredItems = items.filter((item) => item.value);

  return (
    <ul
      className="font-verdana text-xs flex gap-4 list-none"
      data-testid="BottomInfoPanel"
    >
      {filteredItems.map(({ caption: { title, icon }, value }, i) => (
        <li key={i}>
          <figure
            className={
              'flex gap-2 [&>svg]:size-4 [&>svg]:text-muted-foreground'
            }
            key={i}
          >
            {icon}
            <span className="sr-only">{title[lang]}</span>
            <figcaption>
              {typeof value === 'number' ? localeStringMaker(value) : value}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
};

export default BottomInfoPanel;
