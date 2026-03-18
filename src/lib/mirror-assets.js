const SANITIZABLE_EXTENSIONS = [
  'avif',
  'css',
  'eot',
  'gif',
  'ico',
  'jpeg',
  'jpg',
  'js',
  'json',
  'map',
  'mp4',
  'pdf',
  'png',
  'svg',
  'txt',
  'webp',
  'woff',
  'woff2',
  'xml',
];

const EXTENSION_GROUP = SANITIZABLE_EXTENSIONS.join('|');
const FILE_SUFFIX_PATTERN = new RegExp(
  `^(.+?\\.(?:${EXTENSION_GROUP}))(?:\\?.*|%3[fF].*)$`,
  'i',
);
const URL_SUFFIX_PATTERN = new RegExp(
  `((?:https?:\\\\/\\\\/|https?:\\/\\/|[^"'()\\s<])+?\\.(?:${EXTENSION_GROUP}))(?:%3[fF][^"'()\\s<]*|\\?[^"'()\\s<]*)`,
  'g',
);

export const MANAGED_ASSET_PATHS = [
  'wp-content',
  'wp-includes',
  'en/wp-content',
  'en/wp-includes',
  'fr/wp-content',
  'fr/wp-includes',
];

export const TEXT_ASSET_EXTENSIONS = new Set([
  '.css',
  '.js',
  '.json',
  '.map',
  '.svg',
  '.txt',
  '.xml',
]);

export function sanitizeFileName(name) {
  return name.replace(FILE_SUFFIX_PATTERN, '$1');
}

export function sanitizeAssetUrlReferences(value) {
  return value.replace(URL_SUFFIX_PATTERN, '$1');
}
