import React from 'react';

type FaqItem = {
  q: string;
  a: string;
};

type SchemaProps = {
  pageUrl: string;
  pageName: string;
  pageDescription?: string;
  faqs?: FaqItem[];
  type?: 'WebPage' | 'Service' | 'Organization';
};

export default function SchemaMarkup({ 
  pageUrl, 
  pageName, 
  pageDescription, 
  faqs, 
  type = 'WebPage' 
}: SchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ariosetech.com';
  // pageUrl may arrive absolute (from BuilderRenderer) or relative — never double the origin.
  const fullUrl = pageUrl.startsWith('http') ? pageUrl : `${baseUrl}${pageUrl}`;

  const schemaObjects: any[] = [];

  // Main Page/Service Schema
  if (type === 'Service') {
    schemaObjects.push({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: pageName,
      description: pageDescription,
      provider: {
        '@type': 'Organization',
        name: 'Ariosetech',
        url: baseUrl,
      },
      url: fullUrl,
    });
  } else if (type === 'WebPage') {
    schemaObjects.push({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: pageName,
      description: pageDescription,
      url: fullUrl,
      publisher: {
        '@type': 'Organization',
        name: 'Ariosetech',
      }
    });
  } else if (type === 'Organization') {
    schemaObjects.push({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Ariosetech',
      url: baseUrl,
      logo: `${baseUrl}/logo.png`, // Update if needed
      description: pageDescription,
    });
  }

  // FAQ Schema
  if (faqs && faqs.length > 0) {
    schemaObjects.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.a,
        },
      })),
    });
  }

  return (
    <>
      {schemaObjects.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
