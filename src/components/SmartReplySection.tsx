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
    return `> ${message.isOwn ? "ME" : "OTHER"}: ${message.content}`;
  });
  const logsMessages: ChatCompletionRequestMessage[] = logs.map((log) => ({
    content: log,
    role: "user"
  }));
  logsMessages.push({
    content: `> SELECTED: ${targetMessage.content}`,
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
          <div className="relative text-xs items-center">
            <div className="absolute flex gap-0.5 top-3 left-2">
              <button
                className="btn-xs"
                disabled={selectedsmartReplyIdx === 0}
                onClick={() => {
                  setSelectedSmartReplyIdx(
                    Math.max(0, selectedsmartReplyIdx - 1)
                  );
                }}
              >
                <FaChevronLeft
                  style={{
                    fill: "var(--primary-text-color)",
                    opacity: selectedsmartReplyIdx > 0 ? 1 : 0.2
                  }}
                />
              </button>
              <span
                style={{
                  lineHeight: "1.8",
                  color: "var(--primary-text-color)",
                  fontVariantNumeric: "tabular-nums"
                }}
              >
                {selectedsmartReplyIdx + 1} / {messages.length}
              </span>
              <button
                className="btn-xs"
                disabled={selectedsmartReplyIdx === messages.length - 1}
                onClick={() => {
                  setSelectedSmartReplyIdx(
                    Math.min(messages.length - 1, selectedsmartReplyIdx + 1)
                  );
                }}
              >
                <FaChevronRight
                  style={{
                    fill: "var(--primary-text-color)",
                    opacity:
                      selectedsmartReplyIdx === messages.length - 1 ? 0.2 : 1
                  }}
                />
              </button>
            </div>
            <textarea
              rows={2}
              className="ps-24 textarea textarea-bordered w-full pe-14"
              value={messages[selectedsmartReplyIdx]}
              style={{
                backgroundColor: "var(--input-search-background-color)",
                textOverflow: "ellipsis",
                color: "var(--secondary-text-color)",
                resize: "none"
              }}
              readOnly
            />
            <div className="absolute top-2 right-2 flex gap-1.5">
              <div className="tooltip" data-tip="Copy message">
                <button
                  className="btn-sm px-1"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      messages[selectedsmartReplyIdx]
                    );
                  }}
                >
                  <MdContentCopy
                    style={{
                      fill: "var(--primary-color)"
                    }}
                  />
                </button>
              </div>
              <div className="tooltip" data-tip="Insert message">
                <button
                  className="btn-sm px-1"
                  onClick={() => {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    document.querySelector(
                      ".input-message-input.i18n.scrollable.scrollable-y.no-scrollbar"
                    )!.textContent = messages[selectedsmartReplyIdx];
                    document
                      .querySelector(
                        ".input-message-input.i18n.scrollable.scrollable-y.no-scrollbar"
                      )
                      ?.dispatchEvent(new Event("input"));
                  }}
                >
                  <MdOutlineInput
                    style={{
                      fill: "var(--primary-color)"
                    }}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
