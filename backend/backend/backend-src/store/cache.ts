import NodeCache from 'node-cache';

const cache = new NodeCache();

export const saveValue = (key: string, value: string) => {
  return cache.set(key, value);
};

export const getValue = (key: string) => {
  return cache.get(key);
};

export const deleteValue = (key: string) => {
  return cache.del(key);
};
