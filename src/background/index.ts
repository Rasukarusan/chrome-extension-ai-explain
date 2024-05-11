chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'explain',
    title: 'AI要約',
    contexts: ['selection'],
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab) {
    return;
  }
  switch (info.menuItemId) {
    case 'explain': {
      const selectedText = info.selectionText;
      chrome.tabs.sendMessage(tab.id as number, { type: 'SHOW', data: { selectedText } });
      break;
    }
  }
});

export {};
