import { setupI18n, type I18n, type Messages } from '@lingui/core';
import { type APP_LOCALES } from 'twenty-shared/translations';
import { isDefined } from 'twenty-shared/utils';
import { messages as enMessages } from '../locales/generated/en';
import { messages as thMessages } from '../locales/generated/th-TH';

const messages: Record<keyof typeof APP_LOCALES, Messages> = {
  en: enMessages,
  'th-TH': thMessages,
};

const i18nInstancesMap: Partial<Record<keyof typeof APP_LOCALES, I18n>> = {};

export const createI18nInstance = (locale: keyof typeof APP_LOCALES): I18n => {
  if (isDefined(i18nInstancesMap[locale])) {
    return i18nInstancesMap[locale];
  }

  const i18nInstance = setupI18n();
  const localeMessages = messages[locale] ?? messages.en;

  i18nInstance.load(locale, localeMessages);
  i18nInstance.activate(locale);

  i18nInstancesMap[locale] = i18nInstance;

  return i18nInstance;
};
