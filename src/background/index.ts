chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'explain',
    title: 'AI解説',
    contexts: ['selection'],
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (tab !== undefined) {
    switch (info.menuItemId) {
      case 'explain': {
        const text = info.selectionText;
        const explain = '解説';
        console.log(text);
        chrome.tabs.sendMessage(tab.id as number, {
          type: 'SHOW',
          data: {
            text,
            explain,
          },
        });
        break;
      }
    }
  }
});

chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
  console.log(message);
  if (message.type === 'EXPLAIN') {
    const selectedText = message.data.selectionText ?? '';
    console.log({ explainText: 'explaintext', originalText: selectedText });
    chrome.tabs.sendMessage(sender.tab?.id as number, {
      type: 'SHOW',
      data: {
        explainText: 'explaintext',
        originalText: selectedText,
      },
    });
  }
});

export {};
