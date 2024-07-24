import { useSetAtom } from 'jotai';
import { explainTextAtom } from '../store/explainText/atom';
import { getBucket } from '@extend-chrome/storage';

export const useChat = () => {
  const setExplainText = useSetAtom(explainTextAtom);
  const bucket = getBucket('chat_history');

  const chat = async (messages: Record<string, string>[]) => {
    setExplainText('');
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        // model: 'llama3-8b-8192',
        // model: 'llama3-70b-8192',
        model: 'llama-3.1-70b-versatile',
        stream: true,
      }),
    });
    const reader = res.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();
    let wholeText = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;
      const lines = decoder.decode(value);
      // console.log(JSON.parse(lines).choices[0].message.content);
      // setExplainText(JSON.parse(lines).choices[0].message.content);
      const jsons = lines
        .split('data: ')
        .map((line) => line.trim())
        .filter((s) => s);
      for (const json of jsons) {
        try {
          if (json === '[DONE]') {
            bucket.set({
              messages: [
                ...messages,
                {
                  role: 'assistant',
                  content: wholeText,
                },
              ],
            });
            wholeText = '';
            return;
          }
          const chunk = JSON.parse(json);
          const text = chunk.choices[0].delta.content || '';
          wholeText += text;
          setExplainText((prev) => prev + text);
        } catch (e) {}
      }
    }
  };
  return { chat };
};
