import fs from 'node:fs';
import path from 'node:path';

const MIRROR_ROOT = path.join(process.cwd(), 'mirror');

export const pageEntries = [
  { route: '/', source: 'index.html' },
  { route: '/contacto/', source: 'contacto/index.html' },
  { route: '/appointment/', source: 'appointment/index.html' },
  { route: '/acreditacion-nist/', source: 'acreditacion-nist/index.html' },
  { route: '/aviso-de-privacidad/', source: 'aviso-de-privacidad/index.html' },
  { route: '/en/', source: 'en/index.html' },
  { route: '/en/contacto/', source: 'en/contacto/index.html' },
  { route: '/en/appointment/', source: 'en/appointment/index.html' },
  { route: '/en/acreditacion-nist/', source: 'en/acreditacion-nist/index.html' },
  { route: '/en/aviso-de-privacidad/', source: 'en/aviso-de-privacidad/index.html' },
  { route: '/fr/', source: 'fr/index.html' },
  { route: '/fr/contacto/', source: 'fr/contacto/index.html' },
  { route: '/fr/appointment/', source: 'fr/appointment/index.html' },
  { route: '/fr/acreditacion-nist/', source: 'fr/acreditacion-nist/index.html' },
  { route: '/fr/aviso-de-privacidad/', source: 'fr/aviso-de-privacidad/index.html' },
];

const pageMap = new Map(pageEntries.map((entry) => [entry.route, entry.source]));

function getAttributeValue(attributes, name) {
  const pattern = new RegExp(`${name}="([^"]*)"`, 'i');
  return attributes.match(pattern)?.[1] ?? '';
}

function parseMirrorDocument(html) {
  const headHtml = html.match(/<head>([\s\S]*?)<\/head>/i)?.[1];
  const bodyMatch = html.match(/<body(?:\s+([^>]*))?>([\s\S]*?)<\/body>/i);
  const htmlAttributes = html.match(/<html(?:\s+([^>]*))?>/i)?.[1] ?? '';

  if (!headHtml || !bodyMatch) {
    throw new Error('Unable to parse mirrored HTML document.');
  }

  return {
    bodyClass: getAttributeValue(bodyMatch[1] ?? '', 'class'),
    bodyHtml: bodyMatch[2],
    headHtml,
    lang: getAttributeValue(htmlAttributes, 'lang'),
  };
}

export function loadMirrorRoute(route) {
  const source = pageMap.get(route);
  if (!source) {
    throw new Error(`Unknown Astro mirror route: ${route}`);
  }

  const filePath = path.join(MIRROR_ROOT, source);
  const html = fs.readFileSync(filePath, 'utf8');
  return parseMirrorDocument(html);
}
