import { createRoot } from "react-dom/client";
import { ReactComponent as Logo } from "./assets/chat_gpt_logo.svg";
import "./style.css";

const Root = () => {
  return (
    <div className="flex justify-center items-center">
      <Logo width={24} height={24} fill="#aaaaaa" />
    </div>
  );
};

const render = () => {
  const appContainer = document.querySelector("#tg_gpt_helper_root");
  if (appContainer) {
    document.removeChild(appContainer);
  }
  const input = document.querySelector(".new-message-wrapper");
  if (!input) return;
  const container = document.createElement("div");
  container.className = "btn-icon";
  input.append(container);
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
