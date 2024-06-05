# Chrome Extension: AI Explain

This Chrome extension allows you to select words on a webpage and click an icon to instantly receive AI-generated summaries and explanations in a pop-up dialog.

- Click the icon

![2024-05-28 13-33-01 2024-05-28 13_33_31](https://github.com/Rasukarusan/chrome-extension-ai-explain/assets/17779386/67963e9c-07d4-4d66-9eb3-8098847b6e28)

- Rigth click menu

<img width="475" alt="image" src="https://github.com/Rasukarusan/chrome-extension-ai-explain/assets/17779386/a742de49-2078-40c8-a556-ac4ca72a0762">

## ⚙️ Setup

set your Groq API Key.

`.env`

```sh
VITE_GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx
```

### build

```sh
git clone https://github.com/Rasukarusan/chrome-extension-ai-explain.git
cd chrome-extension-ai-explain
yarn && yarn build
```

### Install

1. [chrome://extensions/](chrome://extensions/)
2. Install `chrome-extension-ai-explain/dist`

## Reference

- [React ではじめる Chrome 拡張開発入門](https://zenn.dev/alvinvin/books/chrome_extension)
- https://github.com/sinanbekar/browser-extension-react-typescript-starter
