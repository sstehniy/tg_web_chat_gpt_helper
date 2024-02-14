import { useMemo, useState } from "react";
import { ChatCompletionRequestMessageRoleEnum } from "openai";
import { FaPlay } from "react-icons/fa";
import { MdContentCopy, MdOutlineInput } from "react-icons/md";
import { useChat } from "../hooks/useChat";
import { useTheme } from "../context/themeProvider";

export const ChatForm = () => {
  const [inputMessage, setInputMessage] = useState("");
  const [hoveredId, setHoveredId] = useState<string>("");
  const { generate, loading, messages } = useChat();
  const theme = useTheme();

  const messageGroups = useMemo(() => {
    const groups: {
      role: ChatCompletionRequestMessageRoleEnum;
      messages: string[];
    }[] = [];
    messages.forEach((message) => {
      if (!message.content) return;
      const lastGroup = groups[groups.length - 1];
      if (lastGroup && lastGroup.role === message.role) {
        lastGroup.messages.push(message.content);
      } else {
        groups.push({
          role: message.role,
          messages: [message.content]
        });
      }
    });
    return groups;
  }, [messages]);

  return (
    <div className="w-80">
      <div
        className={`w-full rounded-lg mt-5 p-2 overflow-y-auto ${
          !messageGroups.length
            ? "flex flex-col justify-center items-center"
            : ""
        }`}
        style={{
          backgroundColor: theme.vars.inputSearchBackgroundColor,
          minHeight: "250px",
          border: "1px solid hsl(220 13.376% 69.216% / 0.2)",
          maxHeight: "350px"
        }}
      >
        {!messageGroups.length && (
          <p className="text-sm label-text">
            Enter your first message to the chatbot
          </p>
        )}
        {messageGroups.map((group, g_idx) => (
          <div
            key={group.role + g_idx}
            className={`flex flex-col w-full gap-3 mb-3 ${
              group.role === ChatCompletionRequestMessageRoleEnum.Assistant
                ? "items-start"
                : "items-end"
            }`}
          >
            {group.messages.map((message, m_idx) => (
              <div className="relative" style={{ maxWidth: "70%" }}>
                <div
                  key={message + g_idx + m_idx}
                  className="px-3 py-1.5 text-sm rounded-md shadow-sm"
                  onMouseEnter={() => setHoveredId(message + g_idx + m_idx)}
                  onMouseLeave={() => setHoveredId("")}
                  style={{
                    backgroundColor: theme.vars.messageBackground,
                    minWidth: 40
                  }}
                >
                  {group.role ===
                    ChatCompletionRequestMessageRoleEnum.Assistant &&
                  hoveredId === message + g_idx + m_idx ? (
                    <div
                      className="absolute flex gap-1"
                      style={{
                        top: -20,
                        right: -40
                      }}
                    >
                      <button
                        className="btn btn-square btn-sm"
                        style={{
                          backgroundColor: theme.vars.tooltipBackground
                        }}
                        onClick={() => {
                          navigator.clipboard.writeText(message);
                        }}
                      >
                        <MdContentCopy
                          style={{
                            fill: theme.vars.primary
                          }}
                        />
                      </button>
                      <button
                        className="btn btn-square btn-sm"
                        style={{
                          backgroundColor: theme.vars.tooltipBackground
                        }}
                        onClick={() => {
                          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                          document.querySelector(
                            theme.selectors.chatInput
                          )!.textContent = message;
                          document
                            .querySelector(theme.selectors.chatInput)
                            ?.dispatchEvent(new Event("input"));
                          document
                            .querySelector(theme.selectors.chatInput)
                            ?.dispatchEvent(new Event("change"));
                        }}
                      >
                        <MdOutlineInput
                          style={{
                            fill: theme.vars.primary
                          }}
                        />
                      </button>
                    </div>
                  ) : null}
                  <span style={{ color: theme.vars.primaryTextColor }}>
                    {message}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ))}
        {loading && (
          <div
            className="px-3 py-1.5 text-sm rounded-md shadow-sm w-9"
            style={{
              backgroundColor: theme.vars.messageBackground
            }}
          >
            <span
              className="loading-dot"
              style={{ color: theme.vars.primaryTextColor }}
            >
              .
            </span>
            <span
              className="loading-dot"
              style={{ color: theme.vars.primaryTextColor }}
            >
              .
            </span>
            <span
              className="loading-dot"
              style={{ color: theme.vars.primaryTextColor }}
            >
              .
            </span>
          </div>
        )}
      </div>
      <div className="flex gap-2 mt-3">
        <input
          name="chat_prompt"
          id="chat_prompt"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => {
            if (loading) return;
            if (e.key === "Enter") {
              e.preventDefault();
              generate(inputMessage);
              setInputMessage("");
              e.target.dispatchEvent(new Event("blur"));
            }
          }}
          readOnly={loading}
          placeholder={"Please enter a message"}
          style={{
            resize: "none",
            backgroundColor: theme.vars.inputSearchBackgroundColor,
            color: theme.vars.secondaryTextColor
          }}
          className="input input-bordered rounded-lg w-full shadow-sm"
        />
        {loading ? (
          <button
            className={`btn btn-square btn-outline`}
            style={{ backgroundColor: theme.vars.primary, color: "white" }}
            onClick={() => {
              generate(inputMessage);
              setInputMessage("");
            }}
            disabled={!inputMessage}
          >
            ...
          </button>
        ) : (
          <button
            className={`btn btn-square btn-outline`}
            style={{ backgroundColor: theme.vars.primary, color: "white" }}
            onClick={() => {
              generate(inputMessage);
              setInputMessage("");
            }}
            disabled={!inputMessage}
          >
            <FaPlay style={{ fontSize: "1.2rem" }} />
          </button>
        )}
      </div>
    </div>
  );
};
