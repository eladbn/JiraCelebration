chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    // URL has changed, send a message to the content script
    if (tab.url){
      if (tab.url.includes('atlassian.net')){
        chrome.tabs.sendMessage(tabId, {urlChanged: true});
      }
    }
  }
});