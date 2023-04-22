import { useEffect, useState } from "react";
import { ContextMessage } from "../types";
import { ChatCompletionRequestMessage } from "openai";
import { prompts } from "../propmpts_config";
import { useChatCompelition } from "../hooks/useChatCompelition";
import { useChatObserver } from "../context/chatObserver";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { HiOutlineRefresh } from "react-icons/hi";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { MdContentCopy, MdOutlineInput } from "react-icons/md";
import { ResponseSuggestions } from "./ResponseSuggestions";

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
  console.log([
    { content: prompts.SMART_PROMPT, role: "user" },
    ...logsMessages
  ]);
  return [{ content: prompts.SMART_PROMPT, role: "user" }, ...logsMessages];
};

export const SmartReplySection = () => {
  const [selectedsmartReplyIdx, setSelectedSmartReplyIdx] = useState<number>(0);
  const { messages, error, generate, loading } = useChatCompelition();
  const { selectedMessage, contextMessages } = useChatObserver();
  useEffect(() => {
    if (messages.length > 0) {
      setSelectedSmartReplyIdx(messages.length - 1);
    }
  }, [messages]);
  return (
    <div>
      <label className="label" htmlFor="selected_message">
        <span
          style={{ color: "var(--secondary-text-color)" }}
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
          backgroundColor: "var(--input-search-background-color)",
          filter: selectedMessage ? "none" : "opacity(0.75)",
          textOverflow: "ellipsis",
          color: "var(--secondary-text-color)"
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
          className="btn w-full gap-2 mt-3"
          style={{
            backgroundColor: "var(--primary-color)",
            color: "white"
          }}
          disabled={!selectedMessage || loading}
        >
          Loading...
        </button>
      ) : messages.length === 0 ? (
        <button
          className="btn glass w-full gap-2 mt-3"
          style={{
            backgroundColor: "var(--primary-color)",
            color: "white"
          }}
          onClick={() => {
            if (!selectedMessage) return;
            generate(consturctSmartPrompt(selectedMessage, contextMessages));
          }}
          disabled={!selectedMessage}
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
          className="btn glass w-full gap-2 mt-3"
          style={{
            backgroundColor: "var(--primary-color)",
            color: "white"
          }}
          onClick={() => {
            if (!selectedMessage) return;
            generate(consturctSmartPrompt(selectedMessage, contextMessages));
          }}
          disabled={!selectedMessage}
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
          <label className="label pb-1" htmlFor="smart_reply_output">
            <span
              style={{ color: "var(--secondary-text-color)" }}
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
