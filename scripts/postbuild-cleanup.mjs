import fs from 'node:fs';
import path from 'node:path';

const DIST_DIR = path.join(process.cwd(), 'dist');
const REMOVED_SEGMENTS = new Set(['comments', 'feed', 'wp-json']);
const REMOVED_FILES = new Set(['en/robots.txt', 'fr/robots.txt']);

function shouldRemove(relativePath, isDirectory) {
  const normalizedPath = relativePath.split(path.sep).join('/');
  const segments = normalizedPath.split('/');

  if (segments.some((segment) => REMOVED_SEGMENTS.has(segment))) {
    return true;
  }

  if (!isDirectory && normalizedPath.includes('?')) {
    return true;
  }

  if (!isDirectory && path.posix.basename(normalizedPath).startsWith('xmlrpc.php')) {
    return true;
  }

  return !isDirectory && REMOVED_FILES.has(normalizedPath);
}

function pruneDirectory(relativeDirectory = '') {
  const absoluteDirectory = path.join(DIST_DIR, relativeDirectory);

  for (const entry of fs.readdirSync(absoluteDirectory, { withFileTypes: true })) {
    const relativePath = relativeDirectory
      ? path.join(relativeDirectory, entry.name)
      : entry.name;
    const absolutePath = path.join(absoluteDirectory, entry.name);

    if (shouldRemove(relativePath, entry.isDirectory())) {
      fs.rmSync(absolutePath, { force: true, recursive: true });
      continue;
    }

    if (entry.isDirectory()) {
      pruneDirectory(relativePath);

      if (fs.existsSync(absolutePath) && fs.readdirSync(absolutePath).length === 0) {
        fs.rmdirSync(absolutePath);
      }
    }
  }
}

if (fs.existsSync(DIST_DIR)) {
  pruneDirectory();
}
