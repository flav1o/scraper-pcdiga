import {
  StorageKeys,
  StorageKeysStrings,
  StorageSchema,
} from "@/hooks/useStorage";

export const getExtensionStorageKey = async <K extends StorageKeys>(
  key: K | StorageKeysStrings
): Promise<StorageSchema[K] | null> => {
  return new Promise((resolve) => {
    chrome.storage.local.get(key.toString(), (result) => {
      const value = result[key.toString()];
      resolve(value === undefined ? null : value);
    });
  });
};

export const setExtensionStorageKey = async <K extends StorageKeys>(
  key: K | StorageKeys | StorageKeysStrings,
  value: StorageSchema[K]
): Promise<void> => {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [key.toString()]: value }, resolve);
  });
};
