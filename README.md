# Telegram Web ChatGPT Helper

The Telegram Web ChatGPT Helper is a browser extension designed to enhance the experience of using Telegram Web by integrating ChatGPT functionalities. This extension allows users to generate smart replies and custom responses based on the context of their conversations.

## Features

- **Smart Reply**: Automatically suggests responses based on the selected message in the chat.

- **Custom Reply**: Allows users to specify the tone and style for the ChatGPT-generated responses.

- **Theme Integration**: Adapts to the Telegram Web theme for a seamless user experience.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/sstehniy/tg_web_chat_gpt_helper.git
```

2. Navigate to the project directory:

```bash
cd tg_web_chat_gpt_helper
```

3. Install dependencies:

```bash
npm install
```

4. Build the extension:

```bash
npm run build
```

5. Load the `tg_web_chat_gpt_helper` directory as an unpacked extension in your browser.

## Usage

After installation, navigate to [Telegram Web](https://web.telegram.org). You will see a new ChatGPT icon in the chat input area. Clicking on this icon will open the ChatGPT Helper menu, where you can choose between generating a smart reply or crafting a custom response.

### Smart Reply

Select a message in your chat and click on the lightning icon to generate a smart reply.

### Custom Reply

Select a message and click on the play icon to open the custom reply form. Here, you can specify the desired tone and writing style for the response.

## Development

To contribute to the development of this extension, you can start the development server with live reloading:
  
```bash
npm run watch
```

This will automatically rebuild the extension on file changes.

## Configuration

The extension's behavior can be customized by editing the `src/propmpts_config.ts` file, which contains the templates for smart and custom prompts used by ChatGPT.
