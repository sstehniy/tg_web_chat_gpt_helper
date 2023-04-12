import { createRoot } from "react-dom/client";
import { UrlContextProvider, useUrlContext } from "./context/url";

const Root = () => {
  const { isTelegramOpened } = useUrlContext();

  if (!isTelegramOpened) return null;
  return <div>Hello world</div>;
};

const render = () => {
  const input = document.querySelector(".new-message-wrapper");
  if (!input) return;
  const container = document.createElement("div");
  container.id = "tg_gpt_helper_root";
  input.appendChild(container);
  const root = createRoot(container);
  root.render(
    <UrlContextProvider>
      <Root />
    </UrlContextProvider>
  );
};

const observer = new MutationObserver(() => {
  if (document.querySelector(".new-message-wrapper")) {
    render();
  }
});

observer.observe(document.body, {
  childList: true
});
