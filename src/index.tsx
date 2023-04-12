import { createRoot } from "react-dom/client";
import { BackgroundMessageEnum } from "./types";

const Root = () => {
  return <div>Hello world</div>;
};

const render = () => {
  const appContainer = document.querySelector("#tg_gpt_helper_root");
  if (appContainer) {
    document.removeChild(appContainer);
  }
  const input = document.querySelector(".new-message-wrapper");
  console.warn(JSON.stringify(input));
  if (!input) return;
  const container = document.createElement("div");
  container.id = "tg_gpt_helper_root";
  input.prepend(container);
  const root = createRoot(container);
  root.render(<Root />);
};

const observer = new MutationObserver(() => {
  if (document.querySelector(".new-message-wrapper")) {
    render();
    observer.disconnect();
  }
});
observer.observe(document.body, { childList: true });
