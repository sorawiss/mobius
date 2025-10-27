import { fromNavigator, fromStorage, fromUrl } from '@lingui/detect-locale';
import { APP_LOCALES } from 'twenty-shared/translations';
import { isDefined, isValidLocale, normalizeLocale } from 'twenty-shared/utils';
import { dynamicActivate } from '~/utils/i18n/dynamicActivate';

export const initialI18nActivate = () => {
  const urlLocale = fromUrl('locale');
  const storageLocale = fromStorage('locale');
  // Do not use navigator locale for self-host Thai default; rely on storage or default
  const navigatorLocale = null;

  let locale: keyof typeof APP_LOCALES = APP_LOCALES['th-TH'];

  const normalizedUrlLocale = isDefined(urlLocale)
    ? normalizeLocale(urlLocale)
    : null;
  const normalizedStorageLocale = isDefined(storageLocale)
    ? normalizeLocale(storageLocale)
    : null;
  const normalizedNavigatorLocale = isDefined(navigatorLocale)
    ? normalizeLocale(navigatorLocale)
    : null;

  if (isDefined(normalizedUrlLocale) && isValidLocale(normalizedUrlLocale)) {
    locale = normalizedUrlLocale;
  } else if (
    isDefined(normalizedStorageLocale) &&
    isValidLocale(normalizedStorageLocale)
  ) {
    locale = normalizedStorageLocale;
  }

  // Persist the resolved locale to storage so next visits keep Thai by default
  try {
    localStorage.setItem('locale', locale);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Failed to save locale to localStorage:', error);
  }

  dynamicActivate(locale);
};
