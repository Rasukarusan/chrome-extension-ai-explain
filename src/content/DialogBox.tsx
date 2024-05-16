import { ActionIcon, Avatar, Box, Divider, Flex, Stack, Text, Textarea } from '@mantine/core';
import { useClickOutside } from '@mantine/hooks';
import { useEffect, useState } from 'react';
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
  const [diaglog, setDialog] = useState<HTMLDivElement | null>(null);
  const explainText = useAtomValue(explainTextAtom);
  const { chat } = useChat();
  const bucket = getBucket('chat_history');

  useEffect(() => {
    setSelectedText(props.selectedText);
    (async () => {
      const messages = [
        {
          role: 'system',
          content:
            'あなたは優秀なAIアシスタントです。必ず日本語で回答してください。以下を要約してください。もし英語だった場合、要約はせず、日本語に翻訳するだけにしてください。前置きは出力しないでいきなり本文から出力してください。',
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
      setOpened(false);
    },
    null,
    [diaglog]
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

  return opened ? (
    <Box
      sx={(theme) => ({
        textAlign: 'left',
        padding: theme.spacing.md,
        maxWidth: 800,
        backgroundColor: 'white',
        borderRadius: theme.radius.md,
        boxShadow: '0px 0px 10px rgba(0,0,0,.3)',
        zIndex: 2147483550,
      })}
      component="div"
      ref={setDialog}
    >
      <Flex pb="xs" gap="xs" justify="flex-start" align="center">
        <Avatar src={IconUrl} />
        <Text size="md" c="dark">
          原文：{selectedText}
        </Text>
      </Flex>
      <Divider />
      <Stack pt="sm" spacing="xs" style={{ textAlign: 'left' }}>
        <ReactMarkdown className="text-black">{explainText}</ReactMarkdown>
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Textarea
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
    </Box>
  ) : (
    <></>
  );
};
