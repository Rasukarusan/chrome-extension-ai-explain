import { useSetAtom } from 'jotai';
import { explainTextAtom } from '../store/explainText/atom';

export const useChat = () => {
  const setExplainText = useSetAtom(explainTextAtom);

  const chat = async (selectedText: string) => {
    setExplainText('');
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: `あなたは優秀なAIアシスタントです。必ず日本語で回答してください。以下を要約してください。もし英語だった場合、要約はせず、日本語に翻訳するだけにしてください。前置きは出力しないでいきなり本文から出力してください。\n${selectedText}`,
          },
        ],
        // model: 'llama3-8b-8192',
        model: 'llama3-70b-8192',
        stream: true,
      }),
    });
    const reader = res.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();
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
            return;
          }
          const chunk = JSON.parse(json);
          const text = chunk.choices[0].delta.content || '';
          setExplainText((prev) => prev + text);
        } catch (e) {}
      }
    }
  };
  return { chat };
};
