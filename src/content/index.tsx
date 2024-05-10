import React from 'react';
import { createRoot } from 'react-dom/client';
import Content from './Content';
import { MantineProvider } from '@mantine/core';
import { ActionIcon, Image, Tooltip } from '@mantine/core';

const Icon = ({ selectedText, orect }: { selectedText: string; orect: DOMRect }) => {
  const handleClick = async () => {
    console.log('hei');
    removeIcon();
    chrome.runtime.sendMessage({
      type: 'EXPLAIN',
      data: {
        selectionText: selectedText,
      },
    });
  };

  return (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        left: '0px',
        top: '0px',
        zIndex: 2147483550,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: window.scrollX + orect.right,
          top: window.scrollY + orect.bottom,
          zIndex: 2147483550,
        }}
      >
        <Tooltip label="選択したテキストを解説" withArrow>
          <ActionIcon
            radius="xl"
            variant="default"
            size="lg"
            sx={{
              boxShadow: '0 0 10px rgba(0,0,0,.3);',
              zIndex: 2147483550,
            }}
            onClick={handleClick}
          >
            <div
              style={{
                width: '20px',
                height: '20px',
                zIndex: 2147483550,
              }}
            >
              <Image src={chrome.runtime.getURL('images/extension_128.png')} />
            </div>
          </ActionIcon>
        </Tooltip>
      </div>
    </div>
  );
};

chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
  console.log('mess====>', message);
  if (message.type === 'SHOW') {
    const selection = window.getSelection();
    if (selection?.toString()) {
      const oRange = selection.getRangeAt(0);
      const oRect = oRange.getBoundingClientRect();
      if (selection.toString().length === 0) {
        return;
      }
      if (document.getElementsByTagName('my-extension-root').length > 0) {
        document.getElementsByTagName('my-extension-root')[0].remove();
      }

      const container = document.createElement('my-extension-root');
      document.body.after(container);

      createRoot(container).render(
        <React.StrictMode>
          <MantineProvider>
            <Content
              orect={oRect}
              explainText={message.data.explainText}
              originalText={message.data.originalText}
            />
          </MantineProvider>
        </React.StrictMode>
      );
    }
  }
});

function removeIcon() {
  for (let i = 0; i < document.getElementsByTagName('my-extension-root-icon').length; i++) {
    document.getElementsByTagName('my-extension-root-icon')[i].remove();
  }
}

document.addEventListener('mouseup', () => {
  console.log('mouseup');
  const selection = window.getSelection();
  console.log(selection?.toString());
  if (!selection) {
    return;
  }
  if (selection.toString().length > 0) {
    const oRange = selection.getRangeAt(0);
    const oRect = oRange.getBoundingClientRect();
    if (document.getElementsByTagName('my-extension-root-icon').length > 0) {
      return;
    }
    for (let i = 0; i < document.getElementsByTagName('my-extension-root').length; i++) {
      document.getElementsByTagName('my-extension-root')[i].remove();
    }
    removeIcon();
    const container = document.createElement('my-extension-root-icon');
    document.body.after(container);
    createRoot(container).render(<Icon selectedText={selection.toString()} orect={oRect} />);
  }
});

document.addEventListener('mousedown', () => {
  console.log('down');
  const selection = window.getSelection();
});
