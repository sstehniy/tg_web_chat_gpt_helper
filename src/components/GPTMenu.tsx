import { forwardRef, useEffect, useState } from "react";
import { KeySetup } from "./KeySetup";
import { ReplyForm } from "./ReplyForm";
import { BiChat } from "react-icons/bi";
import { ChatForm } from "./ChatForm";
import { MdQuickreply } from "react-icons/md";
import { useOpenaiClient } from "../context/openaiClient";

export const GptMenu = forwardRef<HTMLUListElement, unknown>((_, ref) => {
  const { isAuthorized } = useOpenaiClient();
  const [menuBottomProp, setMenuBottomProp] = useState(0);
  const [activeTab, setActiveTab] = useState<"smart_reply" | "chat">(
    "smart_reply"
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
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
      className="text text-lg !ps-4 p-4 rounded-2xl absolute  right-0 shadow-xl"
      style={{
        backgroundColor: "var(--surface-color)",
        color: "var(--primary-text-color)",
        bottom: menuBottomProp
      }}
      ref={ref}
    >
      <h3 className="m-0">ChatGPT Telegram Assistant</h3>
      {isAuthorized && (
        <div className="btn-group absolute top-4 right-4">
          <button
            className="btn btn-sm rounded-sm"
            onClick={() => setActiveTab("smart_reply")}
            style={{
              fontSize: "1.3rem",
              color: "white",
              backgroundColor:
                activeTab === "smart_reply"
                  ? "var(--primary-color)"
                  : "var(--secondary-color)"
            }}
          >
            <MdQuickreply />
          </button>
          <button
            className="btn btn-sm rounded-sm"
            onClick={() => setActiveTab("chat")}
            style={{
              fontSize: "1.3rem",
              color: "white",
              backgroundColor:
                activeTab === "chat"
                  ? "var(--primary-color)"
                  : "var(--secondary-color)"
            }}
          >
            <BiChat />
          </button>
        </div>
      )}
      {!isAuthorized ? (
        <KeySetup />
      ) : (
        <>
          <div
            style={{ display: activeTab === "smart_reply" ? "block" : "none" }}
          >
            <ReplyForm />
          </div>
          <div style={{ display: activeTab === "chat" ? "block" : "none" }}>
            <ChatForm />
          </div>
        </>
      )}
    </ul>
  );
});
