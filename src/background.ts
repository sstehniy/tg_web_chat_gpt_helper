import { BackgroundMessageEnum } from "./types";

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    changeInfo.url?.startsWith("https://web.telegram.org")
  ) {
    console.warn("onUpdated", tabId, changeInfo, tab);

    chrome.tabs
      .sendMessage(tabId, {
        type: "onUpdated",
        message: BackgroundMessageEnum.UrlUpdate,
        url: tab.url
      })
      .then((response) => {
        console.warn("onUpdated response", response);
      });
  }
});
