import { ChatCompletionRequestMessage } from "openai";
import { useState, useEffect } from "react";
import { FaPlay, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { MdContentCopy, MdOutlineInput } from "react-icons/md";
import {
  customPromptLanguages,
  customPromptStyles,
  customPromptTones
} from "../constants";
import { prompts } from "../propmpts_config";
import { ContextMessage } from "../types";
import { useChatCompelition } from "../hooks/useChatCompelition";
import { useChatObserver } from "../context/chatObserver";
import { HiOutlineRefresh } from "react-icons/hi";

const consturctCustomPrompt = (
  targetMessage: ContextMessage,
  contextMessages: ContextMessage[],
  customPrompt: string,
  customLanguage: string,
  customTone: string,
  customStyle: string
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
  const promptTemplate = prompts.CUSTOM_PROMPT;
  const requestPrompt = promptTemplate
    .replace(
      "{{OUTPUT_LANGUAGE}}",
      customLanguage === "Default language"
        ? "The language of the last message"
        : customLanguage
    )
    .replace("{{CUSTOM_PROMPT}}", customPrompt || "none")
    .replace("{{OUTPUT_TONE}}", customTone)
    .replace("{{OUTPUT_WRITING_STYLE}}", customStyle);

  console.log([{ content: requestPrompt, role: "user" }, ...logsMessages]);
  return [{ content: requestPrompt, role: "user" }, ...logsMessages];
};

export const CustomReplySection = () => {
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [customLanguage, setCustomLanguage] = useState<string>(
    customPromptLanguages[0]
  );
  const [customStyle, setCustomStyle] = useState<string>(customPromptStyles[0]);
  const [customTone, setCustomTone] = useState<string>(customPromptTones[0]);
  const [selectedCustomReplyIdx, setSelectedCustomReplyIdx] =
    useState<number>(0);
  const { error, generate, loading, messages } = useChatCompelition();
  const { selectedMessage, handleUpdateContextMessages, contextMessages } =
    useChatObserver();

  useEffect(() => {
    if (messages.length > 0) {
      setSelectedCustomReplyIdx(messages.length - 1);
    }
  }, [messages]);
  return (
    <div>
      <label className="label pt-0 pb-0.5" htmlFor="selected_message">
        <span
          style={{ color: "var(--secondary-text-color)" }}
          className="label-text"
        >
          Tell how you want to reply the message
        </span>
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          name="custom_prompt"
          id="custom_prompt"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder={
            selectedMessage
              ? "Please enter a custom prompt"
              : "Please select a message to reply to"
          }
          disabled={!selectedMessage || loading}
          readOnly={!selectedMessage || loading}
          style={{
            backgroundColor: "var(--input-search-background-color)",
            filter: selectedMessage ? "none" : "opacity(0.75)",
            textOverflow: "ellipsis",
            color: "var(--secondary-text-color)"
          }}
          className="input input-bordered rounded-lg w-full  shadow-sm"
        />
        {loading ? (
          <button
            className="btn btn-square btn-outline"
            style={{ backgroundColor: "var(--primary-color)", color: "white" }}
            disabled={!selectedMessage || loading}
          >
            ...
          </button>
        ) : messages.length ? (
          <button
            className="btn btn-square btn-outline"
            style={{ backgroundColor: "var(--primary-color)", color: "white" }}
            disabled={!selectedMessage}
            onClick={() => {
              if (!selectedMessage) return;
              handleUpdateContextMessages();
              generate(
                consturctCustomPrompt(
                  selectedMessage,
                  contextMessages,
                  customPrompt,
                  customLanguage,
                  customTone,
                  customStyle
                )
              );
            }}
          >
            <HiOutlineRefresh
              height={24}
              width={24}
              style={{ fontSize: "1.2rem" }}
            />
          </button>
        ) : (
          <button
            className="btn btn-square btn-outline"
            style={{ backgroundColor: "var(--primary-color)", color: "white" }}
            disabled={!selectedMessage}
            onClick={() => {
              if (!selectedMessage) return;
              handleUpdateContextMessages();
              generate(
                consturctCustomPrompt(
                  selectedMessage,
                  contextMessages,
                  customPrompt,
                  customLanguage,
                  customTone,
                  customStyle
                )
              );
            }}
          >
            <FaPlay style={{ fontSize: "1.2rem" }} />
          </button>
        )}
      </div>
      <div className="flex mt-3 gap-2 justify-between">
        <div>
          <label className="label pt-0 pb-0.5" htmlFor="language_select">
            <span
              style={{ color: "var(--secondary-text-color)" }}
              className="label-text"
            >
              Output in
            </span>
          </label>
          <select
            className="select select-bordered select-sm"
            style={{
              backgroundColor: "transparent",
              color: "var(--primary-text-color)"
            }}
            value={customLanguage}
            name="language_select"
            id="language_select"
            onChange={(e) => {
              setCustomLanguage(e.target.value);
            }}
          >
            {customPromptLanguages.map((language, idx) => (
              <option
                key={"language_" + language.toLowerCase() + idx}
                value={language}
              >
                {language}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label pt-0 pb-0.5" htmlFor="tone_select">
            <span
              style={{ color: "var(--secondary-text-color)" }}
              className="label-text"
            >
              Tone
            </span>
          </label>
          <select
            className="select select-bordered select-sm"
            style={{
              backgroundColor: "transparent",
              color: "var(--primary-text-color)"
            }}
            value={customTone}
            name="tone_select"
            id="tone_select"
            onChange={(e) => {
              console.log(e.target.value);
              setCustomTone(e.target.value);
            }}
          >
            {customPromptTones.map((tone, idx) => (
              <option key={"tone_" + tone.toLowerCase() + idx} value={tone}>
                {tone}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label pt-0 pb-0.5" htmlFor="style_select">
            <span
              style={{ color: "var(--secondary-text-color)" }}
              className="label-text"
            >
              Writing Style
            </span>
          </label>
          <select
            className="select select-bordered select-sm"
            style={{
              backgroundColor: "transparent",
              color: "var(--primary-text-color)"
            }}
            value={customStyle}
            name="style_select"
            id="style_select"
            onChange={(e) => {
              console.log(e.target.value);
              setCustomStyle(e.target.value);
            }}
          >
            {customPromptStyles.map((style, idx) => (
              <option key={"style_" + style.toLowerCase() + idx} value={style}>
                {style}
              </option>
            ))}
          </select>
        </div>
      </div>
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
                disabled={selectedCustomReplyIdx === 0}
                onClick={() => {
                  setSelectedCustomReplyIdx(
                    Math.max(0, selectedCustomReplyIdx - 1)
                  );
                }}
              >
                <FaChevronLeft
                  style={{
                    fill: "var(--primary-text-color)",
                    opacity: selectedCustomReplyIdx > 0 ? 1 : 0.2
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
                {selectedCustomReplyIdx + 1} / {messages.length}
              </span>
              <button
                className="btn-xs"
                disabled={selectedCustomReplyIdx === messages.length - 1}
                onClick={() => {
                  setSelectedCustomReplyIdx(
                    Math.min(messages.length - 1, selectedCustomReplyIdx + 1)
                  );
                }}
              >
                <FaChevronRight
                  style={{
                    fill: "var(--primary-text-color)",
                    opacity:
                      selectedCustomReplyIdx === messages.length - 1 ? 0.2 : 1
                  }}
                />
              </button>
            </div>
            <textarea
              rows={2}
              className="ps-24 textarea textarea-bordered w-full pe-14"
              value={messages[selectedCustomReplyIdx]}
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
                      messages[selectedCustomReplyIdx]
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
                    )!.textContent = messages[selectedCustomReplyIdx];
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
