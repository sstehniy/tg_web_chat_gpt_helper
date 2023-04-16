import { useEffect, useState } from "react";
import { useChatObserver } from "../context/chatObserver";

import { ReactComponent as PlayIcon } from "../assets/play.svg";
import { FaChevronLeft, FaChevronRight, FaPlay } from "react-icons/fa";
import { MdContentCopy, MdOutlineInput } from "react-icons/md";
import { HiOutlineRefresh } from "react-icons/hi";
import { BsFillLightningChargeFill } from "react-icons/bs";
import {
  customPromptLanguages,
  customPromptStyles,
  customPromptTones
} from "../constants";
import { useGptApi } from "../context/gptApi";

export const PropmtForm = () => {
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [customLanguage, setCustomLanguage] = useState<string>(
    customPromptLanguages[0]
  );
  const [customStyle, setCustomStyle] = useState<string>(customPromptStyles[0]);
  const [customTone, setCustomTone] = useState<string>(customPromptTones[0]);
  const {
    handleCreateSmartReply,
    handleCreateCustomReply,
    currentCustomReplies,
    currentSmartReplies
  } = useGptApi();
  const [selectedsmartReplyIdx, setSelectedSmartReplyIdx] = useState<number>(0);
  const [selectedCustomReplyIdx, setSelectedCustomReplyIdx] =
    useState<number>(0);

  const { selectedMessage, handleUpdateContextMessages } = useChatObserver();

  useEffect(() => {
    if (currentSmartReplies.length > 0) {
      setSelectedSmartReplyIdx(currentSmartReplies.length - 1);
    }
  }, [currentSmartReplies]);

  useEffect(() => {
    if (currentCustomReplies.length > 0) {
      setSelectedCustomReplyIdx(currentCustomReplies.length - 1);
    }
  }, [currentCustomReplies]);

  useEffect(() => {
    console.log(selectedMessage);
  }, [selectedMessage]);
  return (
    <div className="w-full">
      <div className="flex flex-col w-full border-opacity-50">
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
            className="input input-bordered rounded-lg w-full bg-base shadow-sm"
          />

          {currentSmartReplies.length === 0 ? (
            <button
              className="btn glass w-full gap-2 mt-3"
              style={{
                backgroundColor: "var(--primary-color)",
                color: "white"
              }}
              onClick={() => {
                handleUpdateContextMessages();
                handleCreateSmartReply();
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
                handleUpdateContextMessages();
                handleCreateSmartReply();
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
          {currentSmartReplies.length > 0 && (
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
                    {selectedsmartReplyIdx + 1} / {currentSmartReplies.length}
                  </span>
                  <button
                    className="btn-xs"
                    disabled={
                      selectedsmartReplyIdx === currentSmartReplies.length - 1
                    }
                    onClick={() => {
                      setSelectedSmartReplyIdx(
                        Math.min(
                          currentSmartReplies.length - 1,
                          selectedsmartReplyIdx + 1
                        )
                      );
                    }}
                  >
                    <FaChevronRight
                      style={{
                        fill: "var(--primary-text-color)",
                        opacity:
                          selectedsmartReplyIdx ===
                          currentSmartReplies.length - 1
                            ? 0.2
                            : 1
                      }}
                    />
                  </button>
                </div>
                <textarea
                  rows={2}
                  className="ps-24 textarea textarea-bordered w-full pe-11"
                  value={currentSmartReplies[selectedsmartReplyIdx]}
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
                          currentSmartReplies[selectedsmartReplyIdx]
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
                        )!.textContent =
                          currentSmartReplies[selectedsmartReplyIdx];
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
        <div className="divider">or</div>
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
            readOnly={!selectedMessage}
            style={{
              backgroundColor: "var(--input-search-background-color)",
              filter: selectedMessage ? "none" : "opacity(0.75)",
              textOverflow: "ellipsis",
              color: "var(--secondary-text-color)"
            }}
            className="input input-bordered rounded-lg w-full bg-base shadow-sm"
          />
          <button
            className="btn btn-square btn-outline"
            style={{ backgroundColor: "var(--primary-color)", color: "white" }}
            disabled={!selectedMessage}
            onClick={() => {
              handleUpdateContextMessages();
              handleCreateCustomReply(
                customPrompt,
                customLanguage,
                customTone,
                customStyle
              );
            }}
          >
            <FaPlay style={{ fontSize: "1.2rem" }} />
          </button>
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
                <option
                  key={"style_" + style.toLowerCase() + idx}
                  value={style}
                >
                  {style}
                </option>
              ))}
            </select>
          </div>
        </div>
        {currentCustomReplies.length > 0 && (
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
                    setSelectedSmartReplyIdx(
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
                  {selectedCustomReplyIdx + 1} / {currentCustomReplies.length}
                </span>
                <button
                  className="btn-xs"
                  disabled={
                    selectedCustomReplyIdx === currentCustomReplies.length - 1
                  }
                  onClick={() => {
                    setSelectedSmartReplyIdx(
                      Math.min(
                        currentCustomReplies.length - 1,
                        selectedCustomReplyIdx + 1
                      )
                    );
                  }}
                >
                  <FaChevronRight
                    style={{
                      fill: "var(--primary-text-color)",
                      opacity:
                        selectedCustomReplyIdx ===
                        currentCustomReplies.length - 1
                          ? 0.2
                          : 1
                    }}
                  />
                </button>
              </div>
              <textarea
                rows={2}
                className="ps-24 textarea textarea-bordered w-full pe-11"
                value={currentCustomReplies[selectedCustomReplyIdx]}
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
                        currentCustomReplies[selectedCustomReplyIdx]
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
                      )!.textContent =
                        currentCustomReplies[selectedCustomReplyIdx];
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
    </div>
  );
};
