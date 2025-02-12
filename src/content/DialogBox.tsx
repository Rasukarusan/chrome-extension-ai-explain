import { ActionIcon, Avatar, Divider, Flex, Stack, Text, Textarea } from '@mantine/core';
import { useClickOutside } from '@mantine/hooks';
import { useEffect, useRef, useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { explainTextAtom } from '../store/explainText/atom';
import ReactMarkdown from 'react-markdown';
import { useChat } from './useChat';
import { selectedTextAtom } from '../store/selectedText/atom';
import '../global.css';
import { getBucket } from '@extend-chrome/storage';
import { FaArrowUp } from 'react-icons/fa';

export interface DialogBoxProps {
  selectedText: string;
}

export const DialogBox = (props: DialogBoxProps) => {
  const [selectedText, setSelectedText] = useAtom(selectedTextAtom);
  const [input, setInput] = useState('');
  const [opened, setOpened] = useState(true);
  const explainText = useAtomValue(explainTextAtom);
  const { chat } = useChat();
  const bucket = getBucket('chat_history');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedText(props.selectedText);
    (async () => {
      const messages = [
        {
          role: 'system',
          content:
            'あなたは優秀なAIアシスタントです。以下を要約もしくは解説してください。極限までわかりやすく説明してください。もし英語だった場合、要約はせず、日本語に翻訳するだけにしてください。前置きは出力しないでいきなり本文から出力してください。',
        },
        {
          role: 'user',
          content: props.selectedText ? props.selectedText : selectedText,
        },
      ];
      await bucket.set({ messages });
      await chat(messages);
    })();
  }, []);

  useClickOutside(
    () => {
      bucket.clear();
      setCanMove(false);
      setOpened(false);
    },
    null,
    [dialogRef.current]
  );
  const IconUrl = chrome.runtime.getURL('images/extension_128.png');

  const onSubmit = async () => {
    const history = await bucket.get();
    const messages = [
      ...history.messages,
      {
        role: 'user',
        content: input,
      },
    ];
    await chat(messages);
    setSelectedText(input);
    setInput('');
  };

  const handleKeyDown = (event) => {
    if (!canMove) {
      return;
    }
    if (event.key === 'ArrowRight') {
      setPosition((prev) => {
        return { ...prev, x: prev.x + 30 };
      });
    } else if (event.key === 'ArrowLeft') {
      setPosition((prev) => {
        return { ...prev, x: prev.x - 30 };
      });
    } else if (event.key === 'ArrowDown') {
      setPosition((prev) => {
        return { ...prev, y: prev.y + 30 };
      });
    } else if (event.key === 'ArrowUp') {
      setPosition((prev) => {
        return { ...prev, y: prev.y - 30 };
      });
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [canMove]);

  if (!opened) return null;
  return (
    <div
      style={{
        padding: '16px',
        backgroundColor: 'white',
        boxShadow: '0px 0px 10px rgba(0,0,0,.3)',
        borderRadius: '8px',
        zIndex: 2147483550,
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '800px',
      }}
      draggable={false}
      ref={dialogRef}
      onPointerMove={(event) => {
        const dialog = dialogRef.current;
        // ボタンが押されている場合に処理を実行
        if (event.buttons) {
          // 現在の左位置にマウスの移動量を加算
          dialog.style.left = dialog.offsetLeft + event.movementX + 'px';
          // 現在の上位置にマウスの移動量を加算
          dialog.style.top = dialog.offsetTop + event.movementY + 'px';
          // 位置指定を有効にするため、positionをabsoluteに設定
          dialog.style.position = 'absolute';
          // ドラッグ操作を無効にする
          dialog.draggable = false;
          // ポインターキャプチャを設定
          dialog.setPointerCapture(event.pointerId);
        }
      }}
    >
      <Flex pb="xs" gap="xs" justify="flex-start" align="center">
        <Avatar src={IconUrl} />
        <Text size="md" c="dark">
          原文：{selectedText}
        </Text>
      </Flex>
      <Divider />
      <Stack pt="sm" spacing="xs" style={{ textAlign: 'left' }}>
        <ReactMarkdown
          className="text-black"
          components={{
            ul: ({ ...props }) => <ul style={{ marginLeft: '14px' }}>{props.children}</ul>,
            ol: ({ ...props }) => <ol style={{ marginLeft: '18px' }}>{props.children}</ol>,
            li: ({ ...props }) => <li style={{ listStyle: 'auto' }}>{props.children}</li>,
          }}
        >
          {explainText}
        </ReactMarkdown>
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Textarea
            onFocus={() => setCanMove(false)}
            onBlur={() => setCanMove(true)}
            minRows={1}
            placeholder="メッセージ..."
            style={{ width: '100%', marginRight: '8px' }}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && e.shiftKey) {
                setInput(input);
              } else if (e.key === 'Enter') {
                onSubmit();
              }
            }}
          />
          <ActionIcon onClick={onSubmit} size="xl">
            <FaArrowUp className="text-gray" size={20} />
          </ActionIcon>
        </div>
      </Stack>
    </div>
  );
};
