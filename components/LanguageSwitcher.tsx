import { useRouter } from "next/router";

export default function LanguageSwitcher() {
  const router = useRouter();
  const { locales = [], locale, asPath } = router;

  return (
    <span className="language-switcher">
      {locales.map((lng) => (
        <button
          key={lng}
          type="button"
          className={`lang-btn${lng === locale ? " active" : ""}`}
          onClick={() => router.push(asPath, asPath, { locale: lng })}
          disabled={lng === locale}
          aria-label={`Switch language to ${lng.toUpperCase()}`}
        >
          {lng.toUpperCase()}
        </button>
      ))}
    </span>
  );
}
