/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['en', 'fr', 'ht', 'es'],
    defaultLocale: 'en',
    localeDetection: true,
  },
};

module.exports = nextConfig;
