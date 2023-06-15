const storage = {
  removeUserFromStorage(address: string): void {
    const savedInfo: any = storage.getLocalStorageObject('userTokenMap', null);
    if (savedInfo[address]) {
      delete savedInfo[address];
    }
    localStorage.setItem('userTokenMap', JSON.stringify(savedInfo));
  },
  setLocalStorageObject(key: string, subKey: string | null, value: any): void {
    const itemStr = localStorage.getItem(key);
    let obj: Record<string, unknown> = {};

    try {
      obj = JSON.parse(itemStr || '{}');
    } catch (e) {
      console.debug(e);
    }

    if (subKey) obj[subKey] = value;

    localStorage.setItem(key, JSON.stringify(obj));
  },

  getLocalStorageObject(key: string, subKey: string | null) {
    const itemStr = localStorage.getItem(key);
    let obj: Record<string, unknown> = {};

    try {
      obj = JSON.parse(itemStr || '{}');
    } catch (e) {
      console.debug(e);
    }
    return subKey ? obj[subKey] : obj;
  },

  getRawStorage(key: string): string | null {
    return localStorage.getItem(key);
  },

  setRawStorage(key: string, value: string): void {
    localStorage.setItem(key, value);
  },
};

export { storage };
