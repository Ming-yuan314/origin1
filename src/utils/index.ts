export const checkIsMobile = () => {
  const ua = navigator.userAgent.toLowerCase();

  if (/mobile|android|iphone|ipad|phone|micromessenger/i.test(ua)) {
    return true;
  }
  return false;
};

export const getCssStable = (elem: string, attr: string) => {
  const x = document.createElement(elem);
  const styles = window.getComputedStyle(x);
  const styleList = Object.keys(styles);
  return styleList.indexOf(attr) !== -1;
};

export const INPUT_REG = (p: number) => new RegExp(`^\\d{0,8}(\\.?\\d{0,${p}})`, 'g');
