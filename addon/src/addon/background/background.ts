chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "SCRAPED_DATA") {
    chrome.runtime.sendMessage({
      type: "FORWARD_TO_APP",
      payload: message.payload,
    });
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    chrome.tabs.sendMessage(tabId, {
      message: "URL_CHANGED",
      url: changeInfo.url,
      data: {
        tabId,
        changeInfo,
        tab,
      },
    });
  }
});

chrome.runtime.onStartup.addListener(async () => {
  await chrome.storage.local.remove("USER_SESSION");
});
