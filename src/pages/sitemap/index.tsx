import { FC, ReactNode } from 'react';

import { Link } from 'react-router-dom';

import {
  Briefcase,
  Building2,
  ChevronRight,
  FileCheck,
  FileText,
  Globe,
  Home,
} from 'lucide-react';

import { SEO } from '@/components/layout/SEO';
import { config } from '@/lib/lguConfig';
import { lguLabels } from '@/lib/lguLabels';

interface SitemapSection {
  title: string;
  icon: ReactNode;
  links: {
    title: string;
    url: string;
    description?: string;
  }[];
}

const SitemapPage: FC = () => {
  const sitemapSections: SitemapSection[] = [
    {
      title: 'Main Pages',
      icon: <Home className='w-5 h-5' />,
      links: [
        { title: 'Home', url: '/', description: 'Main landing page' },
        {
          title: 'About',
          url: '/about',
          description: `About ${config.portal.name}`,
        },
        { title: 'Search', url: '/search', description: 'Search the portal' },
        {
          title: 'Contribute',
          url: '/contribute',
          description: 'Suggest updates or new data',
        },
        {
          title: 'Accessibility',
          url: '/accessibility',
          description: 'Accessibility statement',
        },
        {
          title: 'Terms of Service',
          url: '/terms-of-service',
          description: 'Terms of use',
        },
      ],
    },
    {
      title: 'Government',
      icon: <Building2 className='w-5 h-5' />,
      links: [
        {
          title: 'Government',
          url: '/government',
          description: `Overview of the ${lguLabels.fullName} government`,
        },
        {
          title: 'Elected Officials',
          url: '/government/elected-officials',
          description: `Mayor, Vice Mayor and the ${lguLabels.body}`,
        },
        {
          title: `${lguLabels.body} Committees`,
          url: '/government/elected-officials/committees',
          description: `Committees of the ${lguLabels.body}`,
        },
        {
          title: `${lguLabels.adjective} Departments`,
          url: '/government/departments',
          description: 'Offices, heads and contact details',
        },
        {
          title: lguLabels.subdivisions,
          url: '/government/barangays',
          description: 'Barangay contacts and officials',
        },
      ],
    },
    {
      title: 'Services',
      icon: <Briefcase className='w-5 h-5' />,
      links: [
        {
          title: 'All Services',
          url: '/services',
          description: "Services from the Citizen's Charter",
        },
        {
          title: 'Business, Trade & Investment',
          url: '/services?category=business-trade-investment',
          description: 'Business permits and licensing',
        },
        {
          title: 'Taxation & Payments',
          url: '/services?category=taxation-payments',
          description: 'Taxes, assessments and certificates',
        },
        {
          title: 'Health & Wellness',
          url: '/services?category=health-wellness',
          description: 'City health services',
        },
        {
          title: 'Infrastructure & Public Works',
          url: '/services?category=infrastructure-public-works',
          description: 'Building and related permits',
        },
        {
          title: 'Environment & Natural Resources',
          url: '/services?category=environment-natural-resources',
          description: 'Environmental clearances and permits',
        },
      ],
    },
    {
      title: 'Legislation (OpenLGU)',
      icon: <FileText className='w-5 h-5' />,
      links: [
        {
          title: 'Documents',
          url: '/openlgu',
          description: `Ordinances of the ${lguLabels.body}`,
        },
        {
          title: 'Officials',
          url: '/openlgu/officials',
          description: 'Council members and their records',
        },
        { title: 'Terms', url: '/openlgu/terms', description: 'Council terms' },
      ],
    },
    {
      title: 'Transparency & Statistics',
      icon: <FileCheck className='w-5 h-5' />,
      links: [
        {
          title: 'Transparency',
          url: '/transparency',
          description: 'Budget, procurement and projects',
        },
        {
          title: 'Financial Data',
          url: '/transparency/financial',
          description: 'Receipts and expenditures (BLGF)',
        },
        {
          title: 'Procurement',
          url: '/transparency/procurement',
          description: 'Bids and awarded contracts',
        },
        {
          title: 'Infrastructure Projects',
          url: '/transparency/infrastructure',
          description: 'Public works projects',
        },
        {
          title: 'Population',
          url: '/statistics/population',
          description: 'Census population by barangay',
        },
        {
          title: `${lguLabels.adjective} Income`,
          url: '/statistics/municipal-income',
          description: 'Annual regular income (BLGF)',
        },
        {
          title: 'Competitiveness',
          url: '/statistics/competitiveness',
          description: 'DTI CMCI scores',
        },
      ],
    },
    {
      title: 'Data & Resources',
      icon: <Globe className='w-5 h-5' />,
      links: [
        {
          title: 'Weather',
          url: '/data/weather',
          description: 'Local weather',
        },
        {
          title: 'Emergency Hotlines',
          url: 'https://hotlines.bettergov.ph/',
          description: 'National emergency hotlines',
        },
      ],
    },
  ];

  return (
    <div className='py-12 min-h-screen bg-kapwa-bg-surface-raised'>
      <SEO
        title='Sitemap'
        description='Complete sitemap — find all pages and services available on this portal.'
        keywords={[
          'sitemap',
          'navigation',
          'government services',
          'taguig government',
          'website map',
        ]}
      />

      <div className='container mx-auto px-4 py-8 md:py-12'>
        <div className='mx-auto max-w-5xl'>
          <div className='overflow-hidden rounded-xl bg-kapwa-bg-surface shadow-xs'>
            <div className='p-6 border-b border-kapwa-border-weak md:p-8'>
              <h1 className='text-kapwa-text-strong kapwa-heading-xl font-extrabold'>
                Sitemap
              </h1>
              <p className='mt-2 text-kapwa-text-support'>
                A complete guide to all pages and services available on
                {config.portal.name}
              </p>
            </div>

            <div className='p-6 md:p-8'>
              <div className='space-y-12'>
                {sitemapSections.map((section, index) => (
                  <div key={index}>
                    <div className='flex items-center mb-4'>
                      <div className='p-2 mr-3 rounded-md bg-kapwa-bg-surface text-kapwa-text-brand'>
                        {section.icon}
                      </div>
                      <h2 className='text-xl font-bold text-kapwa-text-strong'>
                        {section.title}
                      </h2>
                    </div>

                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                      {section.links.map((link, linkIndex) => (
                        <Link
                          key={linkIndex}
                          to={link.url}
                          className='flex flex-col p-4 rounded-lg border transition-colors group hover:border-kapwa-border-brand hover:bg-kapwa-bg-surface-brand border-kapwa-border-weak'
                        >
                          <div className='flex justify-between items-center mb-2'>
                            <h3 className='font-medium group-hover:text-kapwa-text-brand text-kapwa-text-strong'>
                              {link.title}
                            </h3>
                            <ChevronRight className='w-4 h-4 group-hover:text-kapwa-text-link text-kapwa-text-disabled' />
                          </div>
                          {link.description && (
                            <p className='text-sm text-kapwa-text-support'>
                              {link.description}
                            </p>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className='mt-8 text-sm text-center text-kapwa-text-support'>
            <p>
              Can&apos;t find what you&apos;re looking for? Try using our{' '}
              <Link
                to='/search'
                className='text-kapwa-text-brand hover:underline'
              >
                search feature
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SitemapPage;
