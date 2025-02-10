chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "searchMedia",
      title: "Search Media",
      contexts: ["all"]
    });
  });
  
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "searchMedia") {
      chrome.tabs.sendMessage(tab.id, { action: "ping" }, (response) => {
        if (chrome.runtime.lastError) {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js', 'context_menu_catcher.js']
          })
        }
      });
    }
  });

 chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "contextMenuClicked") {
      chrome.tabs.sendMessage(sender.tab.id, {
        action: "searchMedia",
        x: request.x,
        y: request.y
      });
    }
  });