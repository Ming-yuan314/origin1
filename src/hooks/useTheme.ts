import { useEffect, useState } from 'react';
// import {updateTheme} from 'store/globalConfig'

export default function useTheme(defaultTheme = { mode: 'dark', textZoom: 'normal' }) {
  function getInitialTheme() {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? JSON.parse(savedTheme) : defaultTheme;
  }

  const [theme, _setTheme] = useState(getInitialTheme);

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(theme));
    // dispatch({ type: 'SET_MAIN_THEME', theme })
    // updateTheme(theme)
  }, [theme]);

  return {
    ...theme,
    setTheme: ({ setTheme, ...otherTheme }: { setTheme: () => void }) =>
      _setTheme(otherTheme),
  };
}
