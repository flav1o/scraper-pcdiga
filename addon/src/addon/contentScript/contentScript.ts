import { genCheckSum } from "../helpers/check-sum";
import { getDomainFromHost, log } from "../helpers/document";
import { getProduct } from "../scrapers/mapper";
import { AddonService } from "../services";

const scrapePage = async (url: string): Promise<void> => {
  const companyUrl = getDomainFromHost(url);
  const scrapedData = getProduct(companyUrl);

  console.log("scrapedData", scrapedData);

  if (!scrapedData?.product?.price?.original || companyUrl === "UNKNOWN") {
    return;
  }

  try {
    const checkSum = genCheckSum(scrapedData);
    const userSessionId = await AddonService.getSessionId();
    if (!userSessionId) await AddonService.generateSession();

    await AddonService.saveProduct({
      product: scrapedData.product,
      checkSum: checkSum,
      store: companyUrl,
      productUrl: url,
    });
  } catch (error) {
    log({ error });
  }

  chrome.storage.local.set({ scrapedData }, () => {
    chrome.runtime.sendMessage({
      type: "SCRAPED_DATA_SAVE",
      payload: scrapedData,
    });
  });
};

chrome.runtime.onMessage.addListener((request) => {
  if (request.message === "URL_CHANGED") {
    console.log("aqui");
    return scrapePage(request.url);
  }
});
