import { createRoot } from "react-dom/client";
import { Root } from "./Root";
import "./style.css";
import { ChatObserverProvider } from "./context/chatObserver";
import { OpenaiClientProvider } from "./context/openaiClient";
import { TelegramTheme, tgSelectorsAndStyles } from "./tgSelectorsAndStyles";
import { ThemeProvider } from "./context/themeProvider";

const render = (theme: TelegramTheme, rootNode: string) => {
  const appContainer = document.querySelector("#tg_gpt_helper_root");
  if (appContainer) {
    document.removeChild(appContainer);
  }
  const input = document.querySelector(rootNode);
  if (!input) return;
  const container = document.createElement("div");
  container.style.position = "static";
  if (theme.classNames.attachMenu) {
    container.classList.add(theme.classNames.attachMenu);
  }
  input.append(container);
  const root = createRoot(container);
  root.render(
    <ThemeProvider theme={theme}>
      <OpenaiClientProvider>
        <ChatObserverProvider>
          <Root />
        </ChatObserverProvider>
      </OpenaiClientProvider>
    </ThemeProvider>
  );
};

const observer = new MutationObserver(() => {
  if (document.querySelector(".new-message-wrapper")) {
    render(tgSelectorsAndStyles.k, ".new-message-wrapper");
    observer.disconnect();
  }
  if (document.querySelector(".message-input-wrapper")) {
    render(tgSelectorsAndStyles.z, ".message-input-wrapper");
    observer.disconnect();
  }
});
observer.observe(document.body, { childList: true, subtree: true });
