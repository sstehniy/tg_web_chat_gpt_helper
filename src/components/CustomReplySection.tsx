import { ChatCompletionRequestMessage } from "openai";
import { useState, useEffect } from "react";
import { FaPlay } from "react-icons/fa";
import { customPromptStyles, customPromptTones } from "../constants";
import { prompts } from "../propmpts_config";
import { ContextMessage } from "../types";
import { useChatCompelition } from "../hooks/useChatCompelition";
import { useChatObserver } from "../context/chatObserver";
import { HiOutlineRefresh } from "react-icons/hi";
import { ResponseSuggestions } from "./ResponseSuggestions";
import { useTheme } from "../context/themeProvider";
import { Select } from "./Select";

const consturctCustomPrompt = (
  targetMessage: ContextMessage,
  contextMessages: ContextMessage[],
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
  const promptTemplate = prompts.CUSTOM_PROMPT;
  const requestPrompt = promptTemplate
    .replace("{{OUTPUT_TONE}}", customTone)
    .replace("{{OUTPUT_WRITING_STYLE}}", customStyle);

  return [{ content: requestPrompt, role: "system" }, ...logsMessages];
};

export const CustomReplySection = () => {
  const [customStyle, setCustomStyle] = useState<string>(customPromptStyles[0]);
  const [customTone, setCustomTone] = useState<string>(customPromptTones[0]);
  const [selectedCustomReplyIdx, setSelectedCustomReplyIdx] =
    useState<number>(0);
  const { error, generate, loading, messages } = useChatCompelition();
  const { selectedMessage, handleUpdateContextMessages, contextMessages } =
    useChatObserver();
  const theme = useTheme();

  useEffect(() => {
    if (messages.length > 0) {
      setSelectedCustomReplyIdx(messages.length - 1);
    }
  }, [messages]);
  return (
    <div>
      <label className="label mb-0 pt-0 pb-0.5" htmlFor="selected_message">
        <span
          style={{ color: theme.vars.secondaryTextColor }}
          className="label-text"
        >
          Tell how you want to reply the message
        </span>
      </label>
      <div className="flex mt-3 gap-2 justify-between">
        <div className="flex-1">
          <label className="label mb-0 pt-0 pb-0.5" htmlFor="tone_select">
            <span
              style={{ color: theme.vars.secondaryTextColor }}
              className="label-text"
            >
              Tone
            </span>
          </label>
          <Select
            options={customPromptTones.map((tone) => ({
              label: tone,
              value: tone
            }))}
            onChange={(val) => {
              if (!val) return;
              setCustomTone(val.value);
            }}
          />
        </div>
        <div className="flex-1">
          <label className="label mb-0 pt-0 pb-0.5" htmlFor="style_select">
            <span
              style={{ color: theme.vars.secondaryTextColor }}
              className="label-text"
            >
              Writing Style
            </span>
          </label>
          <Select
            options={customPromptStyles.map((tone) => ({
              label: tone,
              value: tone
            }))}
            onChange={(val) => {
              if (!val) return;
              setCustomStyle(val.value);
            }}
          />
        </div>
        <div className="flex flex-col justify-end">
          {loading ? (
            <button
              className={`btn btn-square btn-outline gap-2`}
              style={{
                backgroundColor: theme.vars.primary,
                color: "white"
              }}
              disabled={!selectedMessage || loading}
            >
              ...
            </button>
          ) : messages.length ? (
            <button
              className={`btn btn-square ${!selectedMessage} btn-outline gap-2`}
              style={{
                backgroundColor: theme.vars.primary,
                color: "white"
              }}
              onClick={() => {
                if (!selectedMessage) return;
                handleUpdateContextMessages();
                generate(
                  consturctCustomPrompt(
                    selectedMessage,
                    contextMessages,
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
              className={`btn btn-square  btn-outline gap-2`}
              style={{
                backgroundColor: theme.vars.primary,
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
          <label className="label mb-0 pb-1" htmlFor="smart_reply_output">
            <span
              style={{ color: theme.vars.secondaryTextColor }}
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
