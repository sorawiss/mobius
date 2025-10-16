import { type APP_LOCALES } from 'twenty-shared/translations';

type AppLocale = keyof typeof APP_LOCALES;
export const getDateFnsLocaleImport = (locale: AppLocale) => {
  switch (locale) {
    case 'en':
      return import('date-fns/locale/en-US');
    case 'th-TH':
      return import('date-fns/locale/th');
    default: {
      return import('date-fns/locale/en-US');
    }
  }
};

export const getDateFnsLocale = async (localeString?: string | null) => {
  return getDateFnsLocaleImport(localeString as AppLocale)
    .then((m) => m.default as unknown as Locale)
    .catch((_e) => undefined);
};
