import { executeQuery as executeDatoQuery } from '@datocms/cda-client';

const DEFAULT_DATOCMS_API_URL = 'https://graphql.datocms.com/';

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function asText(value) {
  if (!value) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'object' && typeof value.value === 'string') {
    return value.value;
  }

  return '';
}

function normalizeImage(image) {
  if (!image || typeof image !== 'object') {
    return null;
  }

  const url = image.url || null;
  if (!url) {
    return null;
  }

  return {
    alt: image.alt || '',
    height: image.height || null,
    url,
    width: image.width || null,
  };
}

function normalizeMenuItem(item) {
  if (!item || typeof item !== 'object') {
    return null;
  }

  const label = item.label || item.title || item.text || '';
  const url = item.url || item.link || item.href || '#';

  if (!label) {
    return null;
  }

  return { label, url };
}

export function getDatoCmsConfig() {
  const token = import.meta.env.DATOCMS_CDA_TOKEN || import.meta.env.DATOCMS_API_TOKEN;
  const environment = import.meta.env.DATOCMS_ENVIRONMENT || 'main';
  const apiUrl = import.meta.env.DATOCMS_API_URL || DEFAULT_DATOCMS_API_URL;

  return {
    apiUrl,
    environment,
    isConfigured: Boolean(token),
    token,
  };
}

export function isDatoCmsEnabled() {
  return getDatoCmsConfig().isConfigured;
}

export async function executeQuery(query, variables = {}) {
  const { token, environment, apiUrl, isConfigured } = getDatoCmsConfig();

  if (!isConfigured) {
    throw new Error(
      'DatoCMS is not configured. Set DATOCMS_CDA_TOKEN (or DATOCMS_API_TOKEN) in your environment.',
    );
  }

  return executeDatoQuery(query, {
    autoRetry: true,
    environment,
    requestInitOptions: {
      headers: {
        Accept: 'application/json',
      },
    },
    token,
    variables,
    ...(apiUrl !== DEFAULT_DATOCMS_API_URL ? { fetchFn: (url, init) => fetch(apiUrl, init) } : {}),
  });
}

export const datoCmsRequest = executeQuery;

async function tryQueriesSequentially(queries, variables = {}) {
  const errors = [];

  for (const query of queries) {
    try {
      return await executeQuery(query, variables);
    } catch (error) {
      errors.push(error);
    }
  }

  throw errors[errors.length - 1];
}

const BLOCK_FIELDS = `
  __typename
  ... on HeroBlockRecord {
    id
    title
    subtitle
    image { url alt width height }
    button_text
    button_link
  }
  ... on SectionBlockRecord {
    id
    title
    text
  }
  ... on CtablockRecord {
    id
    title
    text
    button_text
    button_link
  }
  ... on ImageTextBlockRecord {
    id
    title
    text
    image_position
    image { url alt width height }
  }
`;

const HOME_QUERIES = [
  `
    query GetHome {
      home {
        title
        hero_title: heroTitle
        hero_subtitle: heroSubtitle
        hero_image: heroImage { url alt width height }
        content { value }
        section { ${BLOCK_FIELDS} }
      }
    }
  `,
  `
    query GetHomeNoBlocks {
      home {
        title
        hero_title: heroTitle
        hero_subtitle: heroSubtitle
        hero_image: heroImage { url alt width height }
        content { value }
      }
    }
  `,
];

const SETTINGS_QUERIES = [
  `
    query GetSettings {
      setting {
        logo { url alt width height }
        footer
        social_link: socialLink
        menu
        menu_items: menuItems {
          label
          link
        }
      }
    }
  `,
  `
    query GetSettingsLegacy {
      setting {
        logo { url alt width height }
        footer
        social_link: socialLink
        menu
      }
    }
  `,
];

const PAGE_QUERY_VARIANTS = [
  `
    query GetPageBySlug($slug: String) {
      page(filter: { slug: { eq: $slug } }) {
        title
        slug
        seo {
          title
          description
          image { url alt width height }
        }
        content { value }
        section { ${BLOCK_FIELDS} }
        sections { ${BLOCK_FIELDS} }
      }
    }
  `,
  `
    query GetPageBySlugSection($slug: String) {
      page(filter: { slug: { eq: $slug } }) {
        title
        slug
        seo {
          title
          description
          image { url alt width height }
        }
        content { value }
        section { ${BLOCK_FIELDS} }
      }
    }
  `,
  `
    query GetPageBySlugSections($slug: String) {
      page(filter: { slug: { eq: $slug } }) {
        title
        slug
        seo {
          title
          description
          image { url alt width height }
        }
        content { value }
        sections { ${BLOCK_FIELDS} }
      }
    }
  `,
  `
    query GetPageBySlugContent($slug: String) {
      page(filter: { slug: { eq: $slug } }) {
        title
        slug
        seo {
          title
          description
          image { url alt width height }
        }
        content { value }
      }
    }
  `,
];

const PAGES_SLUGS_QUERIES = [
  `
    query GetPageSlugs {
      allPages {
        slug
      }
    }
  `,
];

function normalizeBlocks(pageOrHome) {
  if (!pageOrHome || typeof pageOrHome !== 'object') {
    return [];
  }

  return toArray(pageOrHome.section).length
    ? toArray(pageOrHome.section)
    : toArray(pageOrHome.sections);
}

export async function getHome() {
  const data = await tryQueriesSequentially(HOME_QUERIES);
  const home = data?.home;

  if (!home) {
    return null;
  }

  return {
    content: asText(home.content),
    hero_image: normalizeImage(home.hero_image),
    hero_subtitle: home.hero_subtitle || '',
    hero_title: home.hero_title || '',
    section: normalizeBlocks(home),
    title: home.title || '',
  };
}

export async function getSettings() {
  const data = await tryQueriesSequentially(SETTINGS_QUERIES);
  const settings = data?.setting;

  if (!settings) {
    return null;
  }

  return {
    footer: settings.footer || '',
    logo: normalizeImage(settings.logo),
    menu: toArray(settings.menu).map(normalizeMenuItem).filter(Boolean),
    menu_items: toArray(settings.menu_items).map(normalizeMenuItem).filter(Boolean),
    social_link: settings.social_link || '',
  };
}

export async function getPageBySlug(slug) {
  const data = await tryQueriesSequentially(PAGE_QUERY_VARIANTS, { slug });
  const page = data?.page;

  if (!page) {
    return null;
  }

  return {
    content: asText(page.content),
    section: normalizeBlocks(page),
    seo: page.seo || null,
    slug: page.slug || slug,
    title: page.title || '',
  };
}

export async function getAllPageSlugs() {
  const data = await tryQueriesSequentially(PAGES_SLUGS_QUERIES);
  return toArray(data?.allPages)
    .map((entry) => (entry?.slug || '').trim())
    .filter(Boolean);
}

export async function fetchDatoCmsSiteInfo() {
  const data = await executeQuery(`
    query SiteInfo {
      _site {
        name
      }
    }
  `);

  return data?._site || null;
}
