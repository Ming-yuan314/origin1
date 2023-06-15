import en_US from '@/locale/en_US';
import zh_CN from '@/locale/zh_CN'; // import defined messages in Chinese
import zh_HK from '@/locale/zh_HK';
import { useState } from 'react';
import { createIntl, createIntlCache } from 'react-intl';

export const messages: Record<string, Record<string, string>> = {
  'en-US': en_US,
  'zh-CN': zh_CN,
  'zh-HK': zh_HK,
};

export default function useIntl(initialLocale = 'en-US') {
  const [locale, setLocale] = useState(initialLocale);
  const cache = createIntlCache();
  const [intl, setIntl] = useState(
    createIntl({ locale: initialLocale, messages: messages[initialLocale] }, cache),
  );

  let t = (id: string) => {
    return intl.formatMessage({ id });
  };

  const changeLanguage = (newLocale: string): void => {
    const _intl = createIntl({ locale: newLocale, messages: messages[newLocale] }, cache);
    t = (id: string) => {
      return intl.formatMessage({ id });
    };
    setIntl(_intl);
    setLocale(newLocale);
    document.documentElement.lang = newLocale;
  };

  return {
    locale,
    intl,
    t,
    changeLanguage,
  };
}
