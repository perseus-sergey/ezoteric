import { generatePostJsonLd } from '@/lib/utils/generatePostJsonLd';
import { getELangKey } from '@/lib/utils/getLanguage';
import { DEFAULT_META_DATA } from '@/models/meta/default.model';
import { MAIN_TEXT, NUMEROLOGY_JSX } from '@/models/meta/home.model';
import { MAIN_URL } from '@/models/url.model';
import { NextResponse } from 'next/server';
import main_h1_21 from '@/public/images/main_h1_21.jpg';

const { h1, startBlock, ourServices } = MAIN_TEXT;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || MAIN_URL;

export async function GET(request: Request) {
  try {
    const { renderToStaticMarkup } = await import('react-dom/server');

    const url = new URL(request.url);
    const lang = getELangKey(url.searchParams.get('lang') || '');

    const jsonLD = generatePostJsonLd({
      lang,
      imgHeight: main_h1_21.height,
      imgWidth: main_h1_21.width,
      article: {
        id: 0,
        slug: '',
        createdAt: new Date('2024-12-01'),
        updatedAt: new Date(),
        imageSrc: `${BASE_URL}/images/main_h1_21.jpg`,
        viewCount: 1,
        ...DEFAULT_META_DATA[lang],
        text: [
          `<h1>${h1[lang]}</h1>`,
          renderToStaticMarkup(startBlock[lang]),
          `<h2>${ourServices.title[lang]}</h2>`,
          renderToStaticMarkup(ourServices.text[lang]),
          `<ul">
          ${ourServices.serviceList[lang].map((li) => `<li><strong>${li[0]}</strong>: ${li[1]}</li>`)}
          </ul>`,
          renderToStaticMarkup(NUMEROLOGY_JSX[lang]),
        ]
          .join('')
          .replace(/\sclass="[^"]*"/g, '') // Видаляє всі class="..."
          .replace(/<svg[^>]*>[\s\S]*?<\/svg>/g, ''), // Видаляє всі SVG,
      },
    });

    return NextResponse.json(jsonLD, {
      headers: {
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
      },
    });
  } catch (error) {
    console.error('❌ API error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
