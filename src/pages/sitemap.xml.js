import { pageEntries } from '../lib/mirror-pages.js';
import { getPageSeo } from '../lib/site.js';
import { SPANISH_SERVICE_ROUTES, getSpanishServicePage } from '../lib/spanish-service-pages.js';

export const prerender = true;

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function GET() {
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...pageEntries.map((entry) => {
      const seo = getPageSeo(entry.route);
      const alternates = seo.alternates
        .map(
          (alternate) =>
            `    <xhtml:link rel="alternate" hreflang="${alternate.hrefLang}" href="${escapeXml(alternate.url)}" />`,
        )
        .concat(
          `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(seo.defaultUrl)}" />`,
        )
        .join('\n');

      return [
        '  <url>',
        `    <loc>${escapeXml(seo.canonicalUrl)}</loc>`,
        alternates,
        '  </url>',
      ].join('\n');
    }),
    ...SPANISH_SERVICE_ROUTES.map((route) => {
      const page = getSpanishServicePage(route);

      return [
        '  <url>',
        `    <loc>${escapeXml(page.canonicalUrl)}</loc>`,
        '  </url>',
      ].join('\n');
    }),
    '</urlset>',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
