import { createNavigation } from 'next-intl/navigation';
import { getRequestConfig } from 'next-intl/server';

// Define all supported locales
export const locales = ['en', 'es', 'pt'] as const;
export type Locale = (typeof locales)[number];

// Create shared pathnames navigation
export const { Link, redirect, usePathname, useRouter } = createNavigation({ locales });

// Dictionary cache
const dictionaries: Record<Locale, any> = {} as Record<Locale, any>;

// Load dictionary function
export async function getDictionary(locale: Locale) {
  if (dictionaries[locale]) {
    return dictionaries[locale];
  }

  try {
    // Load the dictionary for the locale
    const dictionary = await import(`../dictionaries/${locale}.json`);

    // Cache the dictionary
    dictionaries[locale] = dictionary.default || dictionary;

    return dictionaries[locale];
  } catch (error) {
    console.error(`Error loading dictionary for locale: ${locale}`, error);

    // Fallback to default locale (Spanish)
    if (locale !== 'es') {
      return getDictionary('es');
    }

    throw error;
  }
}

// Configuration for next-intl
export async function getMessages({ locale }: { locale: Locale }) {
  return await getDictionary(locale);
}

export default getRequestConfig(async ({ locale }: { locale: Locale }) => {
  return {
    messages: await getDictionary(locale),
  };
});
