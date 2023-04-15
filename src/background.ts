import { BackgroundMessageEnum } from "./types";

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    tab.url?.startsWith("https://web.telegram.org")
  ) {
    console.log("onUpdated", tabId, changeInfo, tab);

    chrome.tabs
      .sendMessage(tabId, {
        url: tab.url
      })
      .then((response) => {
        console.warn("onUpdated response", response);
      });
  }
});
