import Lockr from 'lockr';
import { createContext, ReactNode, useContext, useState } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import en_US from '../../locale/en_US';
import zh_CN from '../../locale/zh_CN'; // import defined messages in Chinese
import zh_HK from '../../locale/zh_HK';

export const messages: Record<string, Record<string, string>> = {
  'en-US': en_US,
  'zh-CN': zh_CN,
  'zh-HK': zh_HK,
};

const BridgeIntlProvider = createContext<
  | {
      locale: string;
      intl: any;
      t: (id: string, params?: Record<string, string>) => string | ReactNode;
      changeLanguage: (newLocale: string) => void;
    }
  | undefined
>(undefined);

export const IntlProvider = ({ children }: { children: ReactNode }) => {
  const initialLocale = (Lockr.get('curLang') as string) || 'en-US';
  const [locale, setLocale] = useState(initialLocale);
  const cache = createIntlCache();
  const [intl, setIntl] = useState(
    createIntl({ locale: initialLocale, messages: messages[initialLocale] }, cache),
  );

  let t = (id: string, params?: Record<string, string>) => {
    return intl.formatMessage({ id }, params);
  };

  const changeLanguage = (newLocale: string): void => {
    const _intl = createIntl({ locale: newLocale, messages: messages[newLocale] }, cache);
    t = (id: string, params?: Record<string, string>) => {
      return intl.formatMessage({ id }, params);
    };
    setIntl(_intl);
    setLocale(newLocale);
    sessionStorage.setItem('landCurrentLanguage', newLocale);
    document.documentElement.lang = newLocale;
  };

  return (
    <RawIntlProvider key={locale} value={intl}>
      <BridgeIntlProvider.Provider
        value={{
          locale,
          intl,
          t,
          changeLanguage,
        }}
      >
        {children}
      </BridgeIntlProvider.Provider>
    </RawIntlProvider>
  );
};

export const useIntl = () => {
  const context = useContext(BridgeIntlProvider);

  if (!context) {
    throw new Error('useIntl must be used in BridgeIntlProvider');
  } else {
    return context;
  }
};
