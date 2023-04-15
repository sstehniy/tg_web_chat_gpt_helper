import { createRoot } from "react-dom/client";
import { GptApiProvider } from "./context/gptApi";
import { Root } from "./Root";
import "./style.css";
import { ChatObserverProvider } from "./context/chatObserver";

const renderK = () => {
  const appContainer = document.querySelector("#tg_gpt_helper_root");
  if (appContainer) {
    document.removeChild(appContainer);
  }
  const input = document.querySelector(".new-message-wrapper");
  if (!input) return;
  const container = document.createElement("div");
  container.style.position = "static";
  input.append(container);
  const root = createRoot(container);
  root.render(
    <ChatObserverProvider>
      <GptApiProvider>
        <Root />
      </GptApiProvider>
    </ChatObserverProvider>
  );
};

const observer = new MutationObserver(() => {
  if (document.querySelector(".new-message-wrapper")) {
    renderK();
    observer.disconnect();
  }
});
observer.observe(document.body, { childList: true });
