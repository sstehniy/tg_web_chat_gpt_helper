import { forwardRef, useEffect, useState } from "react";
import { useGptApi } from "../context/gptApi";
import { KeySetup } from "./KeySetup";
import { PropmtForm } from "./PromptForm";

export const GptMenu = forwardRef<HTMLUListElement, unknown>((_, ref) => {
  const { isAuthorized } = useGptApi();
  const [menuBottomProp, setMenuBottomProp] = useState(0);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      const inputHeight = document
        .querySelector(".chat-input-container")
        ?.getBoundingClientRect().height;
      if (inputHeight && inputHeight !== menuBottomProp) {
        setMenuBottomProp(inputHeight - 18);
      }
    });
    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true
    });
    return () => {
      observer.disconnect();
    };
  }, [menuBottomProp]);

  return (
    <ul
      className={`text text-lg !ps-4 p-4 rounded-2xl w-2/3 min-w-fit absolute  right-0 shadow-xl`}
      style={{
        backgroundColor: "var(--surface-color)",
        color: "var(--primary-text-color)",
        bottom: menuBottomProp
      }}
      ref={ref}
    >
      <h3 className="m-0">ChatGPT Telegram Assistant</h3>
      {!isAuthorized ? <KeySetup /> : <PropmtForm />}
    </ul>
  );
});
