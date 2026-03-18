import { LOCALE_CONFIG, SITE_NAME, SITE_URL, getPageSeo } from './site.js';

const REMOVAL_PATTERNS = [
  /<title>[\s\S]*?<\/title>\s*/gi,
  /<meta\b[^>]+name=(['"])description\1[^>]*>\s*/gi,
  /<meta\b[^>]+name=(['"])robots\1[^>]*>\s*/gi,
  /<meta\b[^>]+property=(['"])og:[^'"]+\1[^>]*>\s*/gi,
  /<meta\b[^>]+name=(['"])twitter:[^'"]+\1[^>]*>\s*/gi,
  /<script\b[^>]+type=(['"])application\/ld\+json\1[^>]*>[\s\S]*?<\/script>\s*/gi,
  /<link\b[^>]+rel=(['"])canonical\1[^>]*>\s*/gi,
  /<link\b[^>]+hreflang=(['"])[^'"]+\1[^>]*>\s*/gi,
  /<link\b[^>]+rel=(['"])shortlink\1[^>]*>\s*/gi,
  /<link\b[^>]+rel=(['"])https:\/\/api\.w\.org\/\1[^>]*>\s*/gi,
  /<link\b[^>]+rel=(['"])EditURI\1[^>]*>\s*/gi,
  /<link\b[^>]+type=(['"])application\/rss\+xml\1[^>]*>\s*/gi,
  /<link\b[^>]+title=(['"])JSON\1[^>]*>\s*/gi,
  /<link\b[^>]+type=(['"])application\/json\+oembed\1[^>]*>\s*/gi,
  /<link\b[^>]+type=(['"])text\/xml\+oembed\1[^>]*>\s*/gi,
  /<meta\b[^>]+name=(['"])generator\1[^>]*>\s*/gi,
  /<style\b[^>]+id=(['"])classic-theme-styles-inline-css\1[^>]*>[\s\S]*?<\/style>\s*/gi,
  /<style\b[^>]+id=(['"])global-styles-inline-css\1[^>]*>[\s\S]*?<\/style>\s*/gi,
  /<style\b[^>]+id=(['"])wp-emoji-styles-inline-css\1[^>]*>[\s\S]*?<\/style>\s*/gi,
  /<script\b[^>]*>[\s\S]*?window\._wpemojiSettings[\s\S]*?<\/script>\s*/gi,
];

function escapeAttribute(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeHtml(value) {
  return escapeAttribute(value).replace(/'/g, '&#39;');
}

function buildStructuredData(seo) {
  const organization = {
    '@type': 'Organization',
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    logo: seo.ogImage,
  };

  switch (seo.pageType) {
    case 'home':
      return [
        {
          '@context': 'https://schema.org',
          ...organization,
        },
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: SITE_NAME,
          url: seo.canonicalUrl,
          description: seo.description,
          inLanguage: seo.locale,
        },
      ];
    case 'contact':
      return [
        {
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: seo.title,
          url: seo.canonicalUrl,
          description: seo.description,
          inLanguage: seo.locale,
          about: organization,
        },
      ];
    case 'service':
      return [
        {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: seo.title,
          url: seo.canonicalUrl,
          description: seo.description,
          inLanguage: seo.locale,
          serviceType: seo.serviceTypes[seo.locale],
          provider: organization,
        },
      ];
    case 'appointment':
      return [
        {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: seo.title,
          url: seo.canonicalUrl,
          description: seo.description,
          inLanguage: seo.locale,
          isPartOf: {
            '@type': 'WebSite',
            name: SITE_NAME,
            url: `${SITE_URL}/`,
          },
        },
      ];
    case 'privacy':
      return [
        {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: seo.title,
          url: seo.canonicalUrl,
          description: seo.description,
          inLanguage: seo.locale,
          about: organization,
        },
      ];
    default:
      return [];
  }
}

function buildSeoTags(route) {
  const seo = getPageSeo(route);
  const alternateLocaleTags = seo.alternates
    .filter((alternate) => alternate.locale !== seo.locale)
    .map(
      (alternate) =>
        `<meta property="og:locale:alternate" content="${LOCALE_CONFIG[alternate.locale].ogLocale}" />`,
    );

  const hreflangLinks = [
    ...seo.alternates.map(
      (alternate) =>
        `<link rel="alternate" href="${alternate.url}" hreflang="${alternate.hrefLang}" />`,
    ),
    `<link rel="alternate" href="${seo.defaultUrl}" hreflang="x-default" />`,
  ];

  const structuredData = buildStructuredData(seo).map(
    (entry) =>
      `<script type="application/ld+json">${JSON.stringify(entry)}</script>`,
  );

  return [
    `<title>${escapeHtml(seo.title)}</title>`,
    `<meta name="description" content="${escapeAttribute(seo.description)}" />`,
    '<meta name="robots" content="index, follow, max-image-preview:large" />',
    `<link rel="canonical" href="${seo.canonicalUrl}" />`,
    ...hreflangLinks,
    '<meta property="og:type" content="website" />',
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:locale" content="${seo.ogLocale}" />`,
    ...alternateLocaleTags,
    `<meta property="og:title" content="${escapeAttribute(seo.title)}" />`,
    `<meta property="og:description" content="${escapeAttribute(seo.description)}" />`,
    `<meta property="og:url" content="${seo.canonicalUrl}" />`,
    `<meta property="og:image" content="${seo.ogImage}" />`,
    `<meta property="og:image:alt" content="${SITE_NAME}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escapeAttribute(seo.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttribute(seo.description)}" />`,
    `<meta name="twitter:image" content="${seo.ogImage}" />`,
    ...structuredData,
  ].join('\n');
}

function stripWordPressHeadTags(headHtml) {
  return REMOVAL_PATTERNS.reduce(
    (cleanHeadHtml, pattern) => cleanHeadHtml.replace(pattern, ''),
    headHtml,
  )
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function dedupeGoogleFontLinks(headHtml) {
  const seen = new Set();

  return headHtml.replace(/<link\b[^>]+href=(['"])(https:\/\/fonts\.googleapis\.com[^'"]+)\1[^>]*>\s*/gi, (match, _quote, href) => {
    const normalizedHref = href
      .replace(/&#0?38;|&amp;/gi, '&')
      .replace(/\+/g, ' ')
      .replace(/%20/gi, ' ')
      .replace(/([?&])ver=[^&]+/gi, '$1')
      .replace(/[?&]$/, '');
    const rel = match.match(/\brel=(['"])([^'"]+)\1/i)?.[2] ?? '';
    const key = `${rel.toLowerCase()}|${normalizedHref.toLowerCase()}`;

    if (seen.has(key)) {
      return '';
    }

    seen.add(key);
    return match;
  });
}

function hasContactFormMarkup(bodyHtml) {
  return /class=(['"])[^'"]*\bwpcf7\b[^'"]*\1|<form\b[^>]*\bwpcf7-form\b/i.test(bodyHtml);
}

function stripUnusedHeadAssets(headHtml, bodyHtml) {
  const hasContactForm = hasContactFormMarkup(bodyHtml);

  let cleanedHeadHtml = headHtml
    .replace(/<link\b[^>]+id=(['"])hostinger-reach-subscription-block-css\1[^>]*>\s*/gi, '')
    .replace(/<link\b[^>]+id=(['"])elementor-gf-urbanist-css\1[^>]*>\s*/gi, '')
    .replace(/<link\b[^>]+id=(['"])elementor-gf-ibmplexmono-css\1[^>]*>\s*/gi, '');

  if (!hasContactForm) {
    cleanedHeadHtml = cleanedHeadHtml.replace(
      /<link\b[^>]+id=(['"])contact-form-7-css\1[^>]*>\s*/gi,
      '',
    );
  }

  return dedupeGoogleFontLinks(cleanedHeadHtml);
}

export function buildSanitizedHeadHtml(route, headHtml, bodyHtml = '') {
  const sanitizedHeadHtml = stripUnusedHeadAssets(stripWordPressHeadTags(headHtml), bodyHtml);
  const seoTags = buildSeoTags(route);

  return [sanitizedHeadHtml, seoTags].filter(Boolean).join('\n');
}
