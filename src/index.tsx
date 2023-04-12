import { createRoot } from "react-dom/client";
import { UrlContextProvider } from "./context/url";

const Root = () => {
  return <div>Hello world</div>;
};

const renderApp = () => {
  const root = createRoot(document.getElementById("root")!);
  root.render(
    <UrlContextProvider>
      <Root />
    </UrlContextProvider>
  );
};

const render = () => {
  renderApp();
};

render();
