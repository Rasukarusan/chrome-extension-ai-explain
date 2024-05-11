import {
  ActionIcon,
  Avatar,
  Box,
  CopyButton,
  Divider,
  Flex,
  Group,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { useClickOutside } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { MdDone, MdOutlineContentCopy } from 'react-icons/md';
import { useAtomValue } from 'jotai';
import { explainTextAtom } from '../store/explainText/atom';
import ReactMarkdown from 'react-markdown';
import { useChat } from './useChat';

export interface DialogBoxProps {
  selectedText: string;
}

export const DialogBox = (props: DialogBoxProps) => {
  const { selectedText } = props;
  const [opened, setOpened] = useState(true);
  const [diaglog, setDialog] = useState<HTMLDivElement | null>(null);
  const explainText = useAtomValue(explainTextAtom);
  const { chat } = useChat();

  useEffect(() => {
    (async () => {
      await chat(props.selectedText);
    })();
  }, []);

  useClickOutside(() => setOpened(false), null, [diaglog]);
  const IconUrl = 'https://avatars.githubusercontent.com/u/54850923?s=200&v=4';

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
        <Group position="right" spacing="xs">
          <CopyButton value={explainText}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? '訳文をコピーしました' : 'クリップボードにコピー'} withArrow>
                <ActionIcon onClick={copy} size="md">
                  {copied ? <MdDone /> : <MdOutlineContentCopy />}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
        </Group>
      </Stack>
    </Box>
  ) : (
    <></>
  );
};
