import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://securyti.mx',
  publicDir: './mirror',
  trailingSlash: 'always',
});
