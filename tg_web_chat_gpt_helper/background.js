!function(){"use strict";chrome.tabs.onUpdated.addListener((function(e,s){s.url&&chrome.tabs.sendMessage(e,{message:"urlUpdate",url:s.url})}))}();
//# sourceMappingURL=background.js.map
