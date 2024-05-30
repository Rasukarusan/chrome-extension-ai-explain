import React from 'react';
import { createRoot } from 'react-dom/client';
import Content from './Content';
import { MantineProvider } from '@mantine/core';
import { ActionIcon, Image } from '@mantine/core';
// import '../global.css';
import { useSetAtom } from 'jotai';
import { selectedTextAtom } from '../store/selectedText/atom';

const Icon = ({ selectedText, x, y }: { selectedText: string; x: number; y: number }) => {
  const setSelectedText = useSetAtom(selectedTextAtom);
  const handleClick = async () => {
    removeIcon();
    setSelectedText(selectedText);
    showDialog(selectedText);
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
          left: x,
          top: y,
          zIndex: 2147483550,
          backgroundColor: '#fff',
          borderRadius: '100px',
        }}
      >
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
            <Image
              src={chrome.runtime.getURL('images/extension_128.png')}
              sx={{ backgroundColor: '#fff' }}
            />
          </div>
        </ActionIcon>
      </div>
    </div>
  );
};

function showDialog(selectedText: string) {
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
      <MantineProvider>
        <Content orect={oRect} selectedText={selectedText} />
      </MantineProvider>
    );
  }
}

function removeIcon() {
  for (let i = 0; i < document.getElementsByTagName('my-extension-root-icon').length; i++) {
    document.getElementsByTagName('my-extension-root-icon')[i].remove();
  }
}

function existIcon() {
  return document.getElementsByTagName('my-extension-root-icon').length > 0;
}

chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
  if (message.type === 'SHOW') {
    showDialog(message.data.selectedText);
  }
});

document.addEventListener('mouseup', (e) => {
  const selection = window.getSelection();
  if (!selection) {
    removeIcon();
    return;
  }
  if (selection.toString().length > 0) {
    if (existIcon()) {
      return;
    }
    for (let i = 0; i < document.getElementsByTagName('my-extension-root').length; i++) {
      // document.getElementsByTagName('my-extension-root')[i].remove();
    }
    const container = document.createElement('my-extension-root-icon');
    document.body.after(container);
    createRoot(container).render(
      <Icon selectedText={selection.toString()} x={e.pageX} y={e.pageY} />
    );
  } else {
    removeIcon();
  }
});

document.addEventListener('mousedown', async () => {});
