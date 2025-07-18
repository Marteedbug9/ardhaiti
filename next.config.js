/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['en', 'fr', 'ht', 'es'],
    defaultLocale: 'en',
    localeDetection: true, // ou false selon ton besoin, mais PAS "true"/"false"
  },
};

module.exports = nextConfig;
