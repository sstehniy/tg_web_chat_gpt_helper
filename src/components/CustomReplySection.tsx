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
import { ResponseSuggestions } from "./ResponseSuggestions";

const consturctCustomPrompt = (
  targetMessage: ContextMessage,
  contextMessages: ContextMessage[],
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
  console.log(customLanguage);
  const promptTemplate = prompts.CUSTOM_PROMPT;
  const requestPrompt = promptTemplate
    .replace(
      "{{OUTPUT_LANGUAGE}}",
      customLanguage === "Default language"
        ? "the primary language of the conversation"
        : customLanguage
    )
    .replace("{{OUTPUT_TONE}}", customTone)
    .replace("{{OUTPUT_WRITING_STYLE}}", customStyle);

  console.log([{ content: requestPrompt, role: "user" }, ...logsMessages]);
  return [{ content: requestPrompt, role: "user" }, ...logsMessages];
};

export const CustomReplySection = () => {
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
      <div className="flex mt-3 gap-2 justify-between">
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
            className="select select-bordered"
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
            className="select select-bordered"
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
        <div className="flex flex-col justify-end">
          {loading ? (
            <button
              className="btn btn-square btn-outline gap-2"
              style={{
                backgroundColor: "var(--primary-color)",
                color: "white"
              }}
              disabled={!selectedMessage || loading}
            >
              ...
            </button>
          ) : messages.length ? (
            <button
              className="btn btn-square btn-outline gap-2"
              style={{
                backgroundColor: "var(--primary-color)",
                color: "white"
              }}
              disabled={!selectedMessage}
              onClick={() => {
                if (!selectedMessage) return;
                handleUpdateContextMessages();
                generate(
                  consturctCustomPrompt(
                    selectedMessage,
                    contextMessages,

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
              className="btn btn-square btn-outline gap-2"
              style={{
                backgroundColor: "var(--primary-color)",
                color: "white"
              }}
              disabled={!selectedMessage}
              onClick={() => {
                if (!selectedMessage) return;
                handleUpdateContextMessages();
                generate(
                  consturctCustomPrompt(
                    selectedMessage,
                    contextMessages,
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
          <ResponseSuggestions
            selectedSuggestionIndex={selectedCustomReplyIdx}
            setSelectedSuggestionIndex={setSelectedCustomReplyIdx}
            suggestions={messages}
          />
        </div>
      )}
    </div>
  );
};
