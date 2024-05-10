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
import { useEffect, useState } from 'react';
import { MdDone, MdOutlineContentCopy, MdVolumeUp } from 'react-icons/md';
import { getBucket } from '@extend-chrome/storage';

export interface DialogBoxProps {
  selectedText: string;
}

export const DialogBox = (props: DialogBoxProps) => {
  const [opened, setOpened] = useState(true);
  const [diaglog, setDialog] = useState<HTMLDivElement | null>(null);
  const [text, setText] = useState('');
  const bucket = getBucket('my_bucket', 'local');

  useEffect(() => {
    setInterval(() => {
      (async () => {
        const explainText = (await bucket.get('explainText')).explainText;
        setText(explainText);
      })();
    }, 100);
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
          原文：{props.selectedText}
        </Text>
      </Flex>
      <Divider />
      <Stack pt="sm" spacing="xs" style={{ textAlign: 'left' }}>
        <Text size="md" c="dark">
          {text}
        </Text>
        <Group position="right" spacing="xs">
          <CopyButton value={text}>
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
