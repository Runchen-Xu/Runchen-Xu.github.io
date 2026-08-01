'use client';

import Profile from '@/components/home/Profile';
import About from '@/components/home/About';
import SelectedPublications from '@/components/home/SelectedPublications';
import News, { NewsItem } from '@/components/home/News';
import PublicationsList from '@/components/publications/PublicationsList';
import TextPage from '@/components/pages/TextPage';
import CardPage from '@/components/pages/CardPage';
import type { SiteConfig } from '@/lib/config';
import { Publication } from '@/types/publication';
import { CardPageConfig, PublicationPageConfig, TextPageConfig } from '@/types/page';
import { useLocaleStore } from '@/lib/stores/localeStore';

interface SectionConfig {
  id: string;
  type: 'markdown' | 'publications' | 'list';
  title?: string;
  source?: string;
  filter?: string;
  limit?: number;
  content?: string;
  publications?: Publication[];
  items?: NewsItem[];
}

type PageData =
  | { type: 'about'; id: string; sections: SectionConfig[] }
  | { type: 'publication'; id: string; config: PublicationPageConfig; publications: Publication[] }
  | { type: 'text'; id: string; config: TextPageConfig; content: string }
  | { type: 'card'; id: string; config: CardPageConfig };

export interface HomePageLocaleData {
  author: SiteConfig['author'];
  social: SiteConfig['social'];
  features: SiteConfig['features'];
  enableOnePageMode?: boolean;
  researchInterests?: string[];
  pagesToShow: PageData[];
}

interface HomePageClientProps {
  dataByLocale: Record<string, HomePageLocaleData>;
  defaultLocale: string;
}

export default function HomePageClient({ dataByLocale, defaultLocale }: HomePageClientProps) {
  const locale = useLocaleStore((state) => state.locale);
  const fallback = dataByLocale[defaultLocale] || Object.values(dataByLocale)[0];
  const data = dataByLocale[locale] || fallback;

  if (!data) {
    return null;
  }

  return (
    <div className="site-page">
      {data.pagesToShow.map((page) => {
        if (page.type === 'about') {
          let introRendered = false;

          return (
            <section key={page.id}>
              {page.sections.map((section) => {
                if (section.type === 'markdown' && !introRendered) {
                  introRendered = true;
                  return (
                    <Profile
                      key={section.id}
                      author={data.author}
                      social={data.social}
                      bioContent={section.content || ''}
                    />
                  );
                }

                if (section.type === 'markdown') {
                  return (
                    <About
                      key={section.id}
                      content={section.content || ''}
                      title={section.title}
                    />
                  );
                }

                if (section.type === 'list') {
                  return (
                    <News
                      key={section.id}
                      items={section.items || []}
                      title={section.title}
                    />
                  );
                }

                if (section.type === 'publications') {
                  return (
                    <SelectedPublications
                      key={section.id}
                      publications={section.publications || []}
                      title={section.title}
                      enableOnePageMode={data.enableOnePageMode}
                    />
                  );
                }

                return null;
              })}
            </section>
          );
        }

        if (page.type === 'publication') {
          return (
            <section key={page.id} className="section-block">
              <PublicationsList
                config={page.config}
                publications={page.publications}
                embedded={true}
              />
            </section>
          );
        }

        if (page.type === 'text') {
          return (
            <section key={page.id} className="section-block">
              <TextPage
                config={page.config}
                content={page.content}
                embedded={true}
              />
            </section>
          );
        }

        return (
          <section key={page.id} className="section-block">
            <CardPage
              config={page.config}
              embedded={true}
            />
          </section>
        );
      })}
    </div>
  );
}
