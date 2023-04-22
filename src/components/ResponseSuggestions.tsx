import { FC } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { MdContentCopy, MdOutlineInput } from "react-icons/md";

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
  return (
    <div className="relative text-xs items-center">
      <div className="absolute flex gap-0.5 top-3 left-0">
        <button
          className="btn-xs -me-1"
          disabled={selectedSuggestionIndex === 0}
          onClick={() => {
            setSelectedSuggestionIndex(
              Math.max(0, selectedSuggestionIndex - 1)
            );
          }}
        >
          <FaChevronLeft
            style={{
              fill: "var(--primary-text-color)",
              opacity: selectedSuggestionIndex > 0 ? 1 : 0.2
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
          {selectedSuggestionIndex + 1} / {suggestions.length}
        </span>
        <button
          className="btn-xs -ms-1"
          disabled={selectedSuggestionIndex === suggestions.length - 1}
          onClick={() => {
            setSelectedSuggestionIndex(
              Math.min(suggestions.length - 1, selectedSuggestionIndex + 1)
            );
          }}
        >
          <FaChevronRight
            style={{
              fill: "var(--primary-text-color)",
              opacity:
                selectedSuggestionIndex === suggestions.length - 1 ? 0.2 : 1
            }}
          />
        </button>
      </div>
      <textarea
        rows={1}
        className="ps-20 textarea textarea-bordered w-full pe-14 h-14"
        value={suggestions[selectedSuggestionIndex]}
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
                suggestions[selectedSuggestionIndex]
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
              )!.textContent = suggestions[selectedSuggestionIndex];
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
  );
};
