import { useEffect, useState } from "react";
import { ContextMessage } from "../types";
import { ChatCompletionRequestMessage } from "openai";
import { prompts } from "../propmpts_config";
import { useChatCompelition } from "../hooks/useChatCompelition";
import { useChatObserver } from "../context/chatObserver";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { HiOutlineRefresh } from "react-icons/hi";
import { ResponseSuggestions } from "./ResponseSuggestions";
import { useTheme } from "../context/themeProvider";

const consturctSmartPrompt = (
  targetMessage: ContextMessage,
  contextMessages: ContextMessage[]
): ChatCompletionRequestMessage[] => {
  const cutMessages = [];
  for (const message of contextMessages) {
    cutMessages.push(message);
    if (message.content === targetMessage.content) {
      break;
    }
  }

  const logs = cutMessages.map((message) => {
    return ` ${message.isOwn ? "ME" : "OTHER"}: ${message.content}`;
  });
  const logsMessages: ChatCompletionRequestMessage[] = logs.map((log) => ({
    content: log,
    role: "user"
  }));
  logsMessages.push({
    content: ` SELECTED: ${targetMessage.content}`,
    role: "user"
  });

  return [{ content: prompts.SMART_PROMPT, role: "system" }, ...logsMessages];
};

export const SmartReplySection = () => {
  const [selectedsmartReplyIdx, setSelectedSmartReplyIdx] = useState<number>(0);
  const { messages, error, generate, loading } = useChatCompelition();
  const { selectedMessage, contextMessages } = useChatObserver();
  const theme = useTheme();
  useEffect(() => {
    if (messages.length > 0) {
      setSelectedSmartReplyIdx(messages.length - 1);
    }
  }, [messages]);
  return (
    <div>
      <label className="label mb-0 mb-0" htmlFor="selected_message">
        <span
          style={{ color: theme.vars.secondaryTextColor }}
          className="label-text"
        >
          Selected Message
        </span>
      </label>
      <input
        type="text"
        name="selected_message"
        id="selected_message"
        value={selectedMessage?.content || ""}
        readOnly
        placeholder="Please select a message to reply to"
        style={{
          backgroundColor: theme.vars.inputSearchBackgroundColor,
          filter: selectedMessage ? "none" : "opacity(0.75)",
          textOverflow: "ellipsis",
          color: theme.vars.secondaryTextColor
        }}
        className="input input-bordered rounded-lg w-full  shadow-sm"
      />
      {error && (
        <p className="text-error">
          An error occured while generating the smart reply. Please try again
        </p>
      )}
      {loading ? (
        <button
          className={`btn w-full gap-2 mt-3`}
          style={{
            backgroundColor: theme.vars.primary,
            color: "white"
          }}
          disabled={!selectedMessage || loading}
        >
          Loading...
        </button>
      ) : messages.length === 0 ? (
        <button
          className={`btn glass w-full gap-2 mt-3`}
          style={{
            backgroundColor: theme.vars.primary,
            color: "white"
          }}
          disabled={!selectedMessage}
          onClick={() => {
            if (!selectedMessage) return;
            generate(consturctSmartPrompt(selectedMessage, contextMessages));
          }}
        >
          <BsFillLightningChargeFill
            height={24}
            width={24}
            style={{ fontSize: "1.2rem" }}
          />
          SMART REPLY
        </button>
      ) : (
        <button
          className={`btn glass w-full gap-2 mt-3`}
          style={{
            backgroundColor: theme.vars.primary,
            color: "white"
          }}
          disabled={!selectedMessage}
          onClick={() => {
            if (!selectedMessage) return;
            generate(consturctSmartPrompt(selectedMessage, contextMessages));
          }}
        >
          <HiOutlineRefresh
            height={24}
            width={24}
            style={{ fontSize: "1.2rem" }}
          />
          Regenerate
        </button>
      )}
      {messages.length > 0 && (
        <div className="w-full mt-2">
          <label className="label mb-0 pb-1" htmlFor="smart_reply_output">
            <span
              style={{ color: theme.vars.secondaryTextColor }}
              className="label-text"
            >
              Generated suggestion
            </span>
          </label>
          <ResponseSuggestions
            selectedSuggestionIndex={selectedsmartReplyIdx}
            setSelectedSuggestionIndex={setSelectedSmartReplyIdx}
            suggestions={messages}
          />
        </div>
      )}
    </div>
  );
};
