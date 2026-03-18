import fs from 'node:fs';
import path from 'node:path';
import {
  MANAGED_ASSET_PATHS,
  TEXT_ASSET_EXTENSIONS,
  sanitizeAssetUrlReferences,
  sanitizeFileName,
} from '../src/lib/mirror-assets.js';

const MIRROR_ROOT = path.join(process.cwd(), 'mirror');
const PUBLIC_ROOT = path.join(process.cwd(), '.astro-public');

function copyTextFile(sourcePath, destinationPath) {
  const source = fs.readFileSync(sourcePath, 'utf8');
  fs.writeFileSync(destinationPath, sanitizeAssetUrlReferences(source));
}

function copyFile(sourcePath, destinationPath) {
  fs.mkdirSync(path.dirname(destinationPath), { recursive: true });

  if (TEXT_ASSET_EXTENSIONS.has(path.extname(destinationPath).toLowerCase())) {
    copyTextFile(sourcePath, destinationPath);
    return;
  }

  fs.copyFileSync(sourcePath, destinationPath);
}

function copyDirectory(sourceDirectory, destinationDirectory) {
  fs.mkdirSync(destinationDirectory, { recursive: true });

  for (const entry of fs.readdirSync(sourceDirectory, { withFileTypes: true })) {
    const sourcePath = path.join(sourceDirectory, entry.name);
    const sanitizedName = sanitizeFileName(entry.name);
    const destinationPath = path.join(destinationDirectory, sanitizedName);

    if (entry.isDirectory()) {
      copyDirectory(sourcePath, destinationPath);
      continue;
    }

    copyFile(sourcePath, destinationPath);
  }
}

fs.rmSync(PUBLIC_ROOT, { force: true, recursive: true });
fs.mkdirSync(PUBLIC_ROOT, { recursive: true });

for (const relativePath of MANAGED_ASSET_PATHS) {
  const sourcePath = path.join(MIRROR_ROOT, relativePath);
  const destinationPath = path.join(PUBLIC_ROOT, relativePath);

  if (!fs.existsSync(sourcePath)) {
    continue;
  }

  copyDirectory(sourcePath, destinationPath);
}
