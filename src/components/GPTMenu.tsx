import { forwardRef, useEffect, useState } from "react";
import { KeySetup } from "./KeySetup";
import { ReplyForm } from "./ReplyForm";
import { BiChat } from "react-icons/bi";
import { ChatForm } from "./ChatForm";
import { MdQuickreply } from "react-icons/md";
import { useOpenaiClient } from "../context/openaiClient";
import { useTheme } from "../context/themeProvider";

export const GptMenu = forwardRef<HTMLUListElement, unknown>((_, ref) => {
  const { isAuthorized } = useOpenaiClient();
  const [menuBottomProp, setMenuBottomProp] = useState(0);
  const [activeTab, setActiveTab] = useState<"smart_reply" | "chat">(
    "smart_reply"
  );
  const theme = useTheme();

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const inputHeight = document
        .querySelector(theme.selectors.chatInputContainer)
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
  }, [menuBottomProp, theme]);

  return (
    <ul
      className="gpt-menu text text-lg !ps-4 p-4 rounded-2xl absolute  right-0 shadow-xl"
      style={{
        backgroundColor: theme.vars.surfaceColor,
        color: theme.vars.primaryTextColor,
        bottom: menuBottomProp
      }}
      ref={ref}
    >
      {isAuthorized && (
        <div className="btn-group flex w-full justify-stretch mb-3">
          <button
            className="btn btn-sm flex-1 gap-2"
            onClick={() => setActiveTab("smart_reply")}
            style={{
              color: "white",
              backgroundColor:
                activeTab === "smart_reply"
                  ? theme.vars.primary
                  : theme.vars.secondary
            }}
          >
            <MdQuickreply style={{ fontSize: "1.3rem" }} />
            Reply
          </button>
          <button
            className="btn btn-sm flex-1 gap-2"
            onClick={() => setActiveTab("chat")}
            style={{
              color: "white",
              backgroundColor:
                activeTab === "chat" ? theme.vars.primary : theme.vars.secondary
            }}
          >
            <BiChat style={{ fontSize: "1.3rem" }} />
            Chat
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
