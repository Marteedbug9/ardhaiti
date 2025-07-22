/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['en', 'fr', 'ht', 'es'],
    defaultLocale: 'en',
    localeDetection: false, // ou true, mais doit être un booléen (et non une string)
  },
};

module.exports = nextConfig;
