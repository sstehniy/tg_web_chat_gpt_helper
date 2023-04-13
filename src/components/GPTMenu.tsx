import { forwardRef, useState } from "react";
import { useGptApi } from "../context/gptApi";
import { KeySetup } from "./KeySetup";
import { PropmtForm } from "./PromptForm";

export const GptMenu = forwardRef<HTMLUListElement, unknown>((_, ref) => {
  const { isAuthorized } = useGptApi();

  return (
    <ul
      className="text text-lg !ps-4 p-4 rounded-2xl absolute bottom-11 right-0 shadow-xl w-auto"
      style={{
        backgroundColor: "var(--surface-color)",
        color: "var(--primary-text-color)"
      }}
      ref={ref}
    >
      <h3 className="m-0">ChatGPT Telegram Assistant</h3>
      {!isAuthorized ? <KeySetup /> : <PropmtForm />}
    </ul>
  );
});
