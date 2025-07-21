/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['en', 'fr', 'ht', 'es'],
    defaultLocale: 'en',
    localeDetection: true, // ✅ boolean (true ou false)
  },
};

module.exports = nextConfig;
