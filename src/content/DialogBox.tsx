import {
  ActionIcon,
  Avatar,
  Box,
  CopyButton,
  Divider,
  Flex,
  Group,
  Select,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { useClickOutside } from '@mantine/hooks';
import { useState } from 'react';
import { MdDone, MdOutlineContentCopy, MdVolumeUp } from 'react-icons/md';

export interface DialogBoxProps {
  explainText: string;
  originalText: string;
}

export const DialogBox = (props: DialogBoxProps) => {
  console.log(props);
  const [opened, setOpened] = useState(true);
  const [diaglog, setDialog] = useState<HTMLDivElement | null>(null);
  const [text, setText] = useState(props.explainText);

  useClickOutside(() => setOpened(false), null, [diaglog]);
  const IconUrl = chrome.runtime.getURL('images/extension_128.png');

  return opened ? (
    <Box
      sx={(theme) => ({
        textAlign: 'left',
        padding: theme.spacing.md,
        maxWidth: 400,
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
          原文：{props.originalText}
        </Text>
      </Flex>
      <Divider />
      <Stack pt="sm" spacing="xs" style={{ textAlign: 'left' }}>
        <Text size="sm" c="dark">
          {text}
        </Text>
        <Group position="right" spacing="xs">
          <Tooltip label="音声読み上げ" withArrow>
            <ActionIcon>
              <MdVolumeUp />
            </ActionIcon>
          </Tooltip>
          <CopyButton value={text}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? '訳文をコピーしました' : 'クリップボードにコピー'} withArrow>
                <ActionIcon onClick={copy}>
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
