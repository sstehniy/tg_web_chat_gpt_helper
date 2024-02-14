import { forwardRef, useState } from "react";
import { KeySetup } from "./KeySetup";
import { ReplyForm } from "./ReplyForm";
import { BiChat } from "react-icons/bi";
import { ChatForm } from "./ChatForm";
import { MdQuickreply } from "react-icons/md";
import { availableModels, useOpenaiClient } from "../context/openaiClient";
import { useTheme } from "../context/themeProvider";
import { Select } from "./Select";

export const GptMenu = forwardRef<HTMLDivElement, unknown>((_, ref) => {
  const { isAuthorized, setSelectedModel } = useOpenaiClient();
  const [activeTab, setActiveTab] = useState<"smart_reply" | "chat">(
    "smart_reply"
  );
  const theme = useTheme();

  return (
    <div
      className="gpt-menu text text-lg !ps-4 p-4 rounded-2xl  right-0 shadow-xl"
      style={{
        backgroundColor: theme.vars.surfaceColor,
        color: theme.vars.primaryTextColor
      }}
      ref={ref}
    >
      {isAuthorized && (
        <>
          <div className="w-full mb-3">
            <label className="label mb-0 pt-0 pb-0.5" htmlFor="tone_select">
              <span
                style={{ color: theme.vars.secondaryTextColor }}
                className="label-text"
              >
                Model
              </span>
            </label>
            <Select
              isSearchable={false}
              placement="bottom"
              options={availableModels.map(({ label, value }) => ({
                label,
                value
              }))}
              onChange={(val) => {
                if (!isAuthorized) return;

                setSelectedModel(val as (typeof availableModels)[number]);
              }}
            />
          </div>
          <div className="btn-group flex w-full justify-stretch">
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
                  activeTab === "chat"
                    ? theme.vars.primary
                    : theme.vars.secondary
              }}
            >
              <BiChat style={{ fontSize: "1.3rem" }} />
              Chat
            </button>
          </div>
        </>
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
    </div>
  );
});
