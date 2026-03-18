import fs from 'node:fs';
import path from 'node:path';
import { cleanupMirrorBodyHtml } from './content-cleanup.js';
import { sanitizeAssetUrlReferences } from './mirror-assets.js';
import { buildSanitizedHeadHtml } from './seo.js';

const MIRROR_ROOT = path.join(process.cwd(), 'mirror');
const EXCLUDED_SEGMENTS = new Set([
  'comments',
  'wp-admin',
  'wp-content',
  'wp-includes',
  'wp-json',
]);
const EXCLUDED_ROUTE_SUFFIXES = ['/feed/'];

function walkFiles(directory, relativeDirectory = '') {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const relativePath = relativeDirectory
      ? `${relativeDirectory}/${entry.name}`
      : entry.name;
    const absolutePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return walkFiles(absolutePath, relativePath);
    }

    return [relativePath];
  });
}

function toRoute(relativePath) {
  if (relativePath === 'index.html') {
    return '/';
  }

  return `/${relativePath.slice(0, -'index.html'.length)}`;
}

function isRoutablePage(relativePath) {
  if (!relativePath.endsWith('index.html')) {
    return false;
  }

  if (relativePath.includes('?')) {
    return false;
  }

  const segments = relativePath.split('/');
  if (segments.some((segment) => EXCLUDED_SEGMENTS.has(segment))) {
    return false;
  }

  const route = toRoute(relativePath);
  return !EXCLUDED_ROUTE_SUFFIXES.some((suffix) => route.endsWith(suffix));
}

function getAttributeValue(attributes, name) {
  const pattern = new RegExp(`${name}="([^"]*)"`, 'i');
  return attributes.match(pattern)?.[1] ?? '';
}

function parseMirrorDocument(route, html) {
  const headHtml = html.match(/<head>([\s\S]*?)<\/head>/i)?.[1];
  const bodyMatch = html.match(/<body(?:\s+([^>]*))?>([\s\S]*?)<\/body>/i);
  const htmlAttributes = html.match(/<html(?:\s+([^>]*))?>/i)?.[1] ?? '';

  if (!headHtml || !bodyMatch) {
    throw new Error('Unable to parse mirrored HTML document.');
  }

  return {
    bodyClass: getAttributeValue(bodyMatch[1] ?? '', 'class'),
    bodyHtml: cleanupMirrorBodyHtml(route, sanitizeAssetUrlReferences(bodyMatch[2])),
    headHtml: buildSanitizedHeadHtml(route, sanitizeAssetUrlReferences(headHtml)),
    lang: getAttributeValue(htmlAttributes, 'lang'),
  };
}

export const pageEntries = walkFiles(MIRROR_ROOT)
  .filter(isRoutablePage)
  .map((source) => ({
    route: toRoute(source),
    source,
  }))
  .sort((left, right) => left.route.localeCompare(right.route));

const pageMap = new Map(pageEntries.map((entry) => [entry.route, entry.source]));

export function loadMirrorRoute(route) {
  const source = pageMap.get(route);

  if (!source) {
    throw new Error(`Unknown Astro mirror route: ${route}`);
  }

  const filePath = path.join(MIRROR_ROOT, source);
  const html = fs.readFileSync(filePath, 'utf8');
  return parseMirrorDocument(route, html);
}
