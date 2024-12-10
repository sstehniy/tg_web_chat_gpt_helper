import { FC } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { MdContentCopy, MdOutlineInput } from "react-icons/md";
import { useTheme } from "../context/themeProvider";

type ResponseSuggestionsProps = {
  selectedSuggestionIndex: number;
  setSelectedSuggestionIndex: (index: number) => void;
  suggestions: string[];
};

export const ResponseSuggestions: FC<ResponseSuggestionsProps> = ({
  selectedSuggestionIndex,
  setSelectedSuggestionIndex,
  suggestions
}) => {
  const theme = useTheme();
  return (
    <div className="relative text-xs items-center">
      <div className="absolute flex gap-0.5 top-3 left-0">
        <button
          className={`btn-xs -me-1`}
          onClick={() => {
            setSelectedSuggestionIndex(
              Math.max(0, selectedSuggestionIndex - 1)
            );
          }}
          disabled={selectedSuggestionIndex === 0}
        >
          <FaChevronLeft
            style={{
              fill: theme.vars.primaryTextColor,
              opacity: selectedSuggestionIndex > 0 ? 1 : 0.2
            }}
          />
        </button>
        <span
          style={{
            lineHeight: "1.8",
            color: theme.vars.primaryTextColor,
            fontVariantNumeric: "tabular-nums"
          }}
        >
          {selectedSuggestionIndex + 1} / {suggestions.length}
        </span>
        <button
          className={`btn-xs -ms-1`}
          onClick={() => {
            setSelectedSuggestionIndex(
              Math.min(suggestions.length - 1, selectedSuggestionIndex + 1)
            );
          }}
          disabled={selectedSuggestionIndex === suggestions.length - 1}
        >
          <FaChevronRight
            style={{
              fill: theme.vars.primaryTextColor,
              opacity:
                selectedSuggestionIndex === suggestions.length - 1 ? 0.2 : 1
            }}
          />
        </button>
      </div>
      <textarea
        rows={2}
        className="ps-20 textarea textarea-bordered w-full pe-14"
        value={suggestions[selectedSuggestionIndex]}
        style={{
          backgroundColor: theme.vars.inputSearchBackgroundColor,
          textOverflow: "ellipsis",
          color: theme.vars.secondaryTextColor,
          resize: "none"
        }}
        readOnly
      />
      <div className="absolute top-2 right-2 flex gap-1.5">
        <div className="tooltip p-0" data-tip="Copy message">
          <button
            className="btn-sm px-1"
            onClick={() => {
              navigator.clipboard.writeText(
                suggestions[selectedSuggestionIndex]
              );
            }}
          >
            <MdContentCopy
              style={{
                fill: theme.vars.primary
              }}
            />
          </button>
        </div>
        <div className="tooltip p-0" data-tip="Insert message">
          <button
            className="btn-sm px-1"
            onClick={() => {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              document.querySelector(theme.selectors.chatInput)!.textContent =
                suggestions[selectedSuggestionIndex];
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
      </div>
    </div>
  );
};
