import { useMemo, useState } from "react";
import { ChatCompletionRequestMessageRoleEnum } from "openai";
import { FaPlay } from "react-icons/fa";
import { MdContentCopy, MdOutlineInput } from "react-icons/md";
import { useChat } from "../hooks/useChat";

export const ChatForm = () => {
  const [inputMessage, setInputMessage] = useState("");
  const [hoveredId, setHoveredId] = useState<string>("");
  const { error, generate, loading, messages } = useChat();
  const messageGroups = useMemo(() => {
    const groups: {
      role: ChatCompletionRequestMessageRoleEnum;
      messages: string[];
    }[] = [];
    messages.forEach((message) => {
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
    <div className="w-96">
      <div
        className={`w-full rounded-lg mt-5 p-2 overflow-y-auto shadow-inner ${
          !messageGroups.length
            ? "flex flex-col justify-center items-center"
            : ""
        }`}
        style={{
          backgroundColor: "var(--input-search-background-color)",
          minHeight: "250px",
          maxHeight: "450px"
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
            className={`flex w-full mb-3 ${
              group.role === ChatCompletionRequestMessageRoleEnum.Assistant
                ? "justify-start"
                : "justify-end"
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
                    backgroundColor:
                      "var(--light-filled-message-out-primary-color)",
                    minWidth: 60
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
                          backgroundColor:
                            "var(--light-filled-message-primary-color)"
                        }}
                        onClick={() => {
                          navigator.clipboard.writeText(message);
                        }}
                      >
                        <MdContentCopy
                          style={{
                            fill: "var(--primary-color)"
                          }}
                        />
                      </button>
                      <button
                        className="btn btn-square btn-sm"
                        style={{
                          backgroundColor:
                            "var(--light-filled-message-primary-color)"
                        }}
                        onClick={() => {
                          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                          document.querySelector(
                            ".input-message-input.i18n.scrollable.scrollable-y.no-scrollbar"
                          )!.textContent = message;
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
                  ) : null}
                  <span style={{ color: "var(--primary-text-color))" }}>
                    {message}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-3">
        <input
          name="chat_prompt"
          id="chat_prompt"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={"Please enter a message"}
          style={{
            resize: "none",
            backgroundColor: "var(--input-search-background-color)",
            color: "var(--secondary-text-color)"
          }}
          className="input input-bordered rounded-lg w-full shadow-sm"
        />
        <button
          className="btn btn-square btn-outline"
          style={{ backgroundColor: "var(--primary-color)", color: "white" }}
          disabled={!inputMessage}
          onClick={() => {
            generate(inputMessage);
            setInputMessage("");
          }}
        >
          <FaPlay style={{ fontSize: "1.2rem" }} />
        </button>
      </div>
    </div>
  );
};
