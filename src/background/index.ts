import { CohereClient } from 'cohere-ai';

const cohere = new CohereClient({
  token: import.meta.env.VITE_COHERE_API_KEY,
});

async function explain(tabId: number, selectedText: string) {
  chrome.tabs.sendMessage(tabId as number, {
    type: 'SHOW',
    data: {
      selectedText: selectedText,
    },
  });

  const prompt = '以下を要約してください。もし英語だった場合、日本語にしてください。';
  const response = await cohere.chatStream({
    model: 'command-r-plus',
    message: `${prompt}\n${selectedText}`,
  });
  const encoder = new TextEncoder();
  new ReadableStream({
    async start(controller) {
      for await (const event of response) {
        if (event.eventType === 'text-generation') {
          controller.enqueue(encoder.encode(event.text));
          chrome.tabs.sendMessage(tabId, {
            type: 'RESULT',
            data: {
              text: event.text,
            },
          });
        }
      }
      controller.close();
    },
  });
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'explain',
    title: 'AI解説',
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
      explain(tab.id as number, selectedText as string);
      break;
    }
  }
});

chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
  if (message.type === 'EXPLAIN') {
    const selectedText = message.data.selectionText ?? '';
    explain(sender.tab?.id as number, selectedText);
  }
  return true;
});

export {};
