import { Companies } from "../../general.types";

export const docByClass = (className: string) => {
  return document.getElementsByClassName(className);
};

export const docById = (id: string) => {
  return document.getElementById(id);
};

export const docQuerySelector = (path: string) => {
  return document.querySelector(path);
};

export const getDomainFromHost = (url: string): Companies | "UNKNOWN" => {
  const regex = /(?:https?:\/\/)?(?:www\.)?([^/]+)/;
  const domain = url.match(regex)?.[1];

  if (!domain) return "UNKNOWN";

  const availableDomains: string[] = Object.values(Companies);
  const isAvailable = availableDomains.includes(domain);

  return isAvailable ? (domain as Companies) : "UNKNOWN";
};

export const log = (content: unknown) => {
  console.log("DEBUG - ", content);
};
