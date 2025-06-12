import {
  getExtensionStorageKey,
  setExtensionStorageKey,
} from "@/addon/helpers";

export enum StorageKeys {
  ONBOARDING_VIEWED = "ONBOARDING",
  AUTH_TOKEN = "AUTH_TOKEN",
}

export type StorageKeysStrings = `${StorageKeys}`;

export interface StorageSchema {
  [StorageKeys.ONBOARDING_VIEWED]: boolean;
  [StorageKeys.AUTH_TOKEN]: string;
}

export const useStorage = () => {
  const isChromeAvailable = typeof chrome !== "undefined" && chrome.storage;

  const getKey = async <K extends StorageKeys>(
    key: K | StorageKeysStrings
  ): Promise<StorageSchema[K] | null> => {
    if (isChromeAvailable) {
      return getExtensionStorageKey(key);
    }

    const value = localStorage.getItem(key.toString());
    if (value === undefined || value === null) {
      return null;
    }

    return JSON.parse(value);
  };

  const setKey = async <K extends StorageKeys>(
    key: K | StorageKeys | StorageKeysStrings,
    value: StorageSchema[K]
  ): Promise<void> => {
    if (isChromeAvailable) {
      return setExtensionStorageKey(key, value);
    }

    localStorage.setItem(key.toString(), JSON.stringify(value));
  };

  return { getKey, setKey };
};
