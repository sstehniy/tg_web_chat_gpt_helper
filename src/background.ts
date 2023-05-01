chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  chrome.tabs
    .sendMessage(tabId, {
      url: tab.url
    })
    .then((response) => {
      console.warn("onUpdated response", response);
    });
});
