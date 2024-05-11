import { ActionIcon, Avatar, Box, Divider, Flex, Stack, Text, Input } from '@mantine/core';
import { useClickOutside } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { BsFillSendFill } from 'react-icons/bs';
import { useAtom, useAtomValue } from 'jotai';
import { explainTextAtom } from '../store/explainText/atom';
import ReactMarkdown from 'react-markdown';
import { useChat } from './useChat';
import { TfiReload } from 'react-icons/tfi';
import { selectedTextAtom } from '../store/selectedText/atom';

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

  useEffect(() => {
    setSelectedText(props.selectedText);
    (async () => {
      await chat(props.selectedText ? props.selectedText : selectedText);
    })();
  }, []);

  useClickOutside(() => setOpened(false), null, [diaglog]);
  const IconUrl = chrome.runtime.getURL('images/extension_128.png');

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
        <ReactMarkdown>{explainText}</ReactMarkdown>
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Input
            placeholder="メッセージ..."
            width="100%"
            style={{ width: '90%' }}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
          />
          <ActionIcon
            onClick={async () => {
              await chat(input);
              setSelectedText(input);
              setInput('');
            }}
            size="md"
          >
            <BsFillSendFill />
          </ActionIcon>
          <ActionIcon
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              await chat(selectedText);
            }}
            size="md"
          >
            <TfiReload />
          </ActionIcon>
        </div>
      </Stack>
    </Box>
  ) : (
    <></>
  );
};
