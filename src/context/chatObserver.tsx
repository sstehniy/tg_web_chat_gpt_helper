import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react";
import { ContextMessage, OutputMessageType } from "../types";

type ChatObserverContextType = {
  contextMessages: ContextMessage[];
  selectedMessage: ContextMessage | null;
  updatedUrl: string;
  handleUpdateContextMessages: () => void;
};

const ChatObserverContext = createContext(
  null as unknown as ChatObserverContextType
);

export const useChatObserver = () => useContext(ChatObserverContext);

export const ChatObserverProvider: FC<PropsWithChildren<unknown>> = ({
  children
}) => {
  const [updatedUrl, setUpdatedUrl] = useState("");
  const [contextMessages, setContextMessages] = useState<ContextMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContextMessage | null>(
    null
  );
  const [companion, setCompanion] = useState<string | null>(null);

  useEffect(() => {
    const handleOnMessage = (message: any) => {
      if (message.url !== updatedUrl) {
        setUpdatedUrl(message.url);
      }
    };
    chrome.runtime.onMessage.addListener(handleOnMessage);
  }, [updatedUrl]);

  const handleUpdateContextMessages = useCallback(() => {
    const latestBubbles = Array.from(
      document.querySelectorAll(".bubbles-group")
    );
    if (!latestBubbles.length) {
      return;
    }
    const flatBubbles = latestBubbles.flatMap((bubblesGroup) => {
      return Array.from(bubblesGroup.querySelectorAll(".bubble"));
    });
    const bubblesWithTextWrappers = flatBubbles.flatMap((bubble) => {
      const isOwn = bubble.classList.contains("is-out");
      return Array.from(
        bubble.querySelectorAll(
          ".message.spoilers-container:not(.call-message):not(.document-message)"
        )
      ).map((contentWrapper) => {
        return { contentWrapper, isOwn };
      });
    });
    const newContextMessages = bubblesWithTextWrappers.map(
      ({ contentWrapper, isOwn }) => {
        const content =
          contentWrapper.childNodes.length === 1
            ? ""
            : contentWrapper.firstChild?.textContent || "";

        return { content, isOwn };
      }
    );

    setContextMessages(newContextMessages.filter((message) => message.content));
  }, []);

  useEffect(() => {
    console.log("contextMessages", contextMessages);
  }, [contextMessages]);

  useEffect(() => {
    const titleObserver = new MutationObserver(() => {
      if (document.querySelector(".top .user-title")?.firstChild) {
        setCompanion(
          document.querySelector(".top .user-title")!.firstChild!.textContent
        );
        titleObserver.disconnect();
      }
    });
    titleObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }, [updatedUrl]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isHelperActive = document.querySelector(
        ".chat.tabs-tab.active.is-helper-active"
      );
      if (!isHelperActive) {
        setSelectedMessage(null);
        return;
      } else {
        const replyToPeer = document.querySelector(
          ".reply-wrapper .reply-title > .peer-title"
        )?.textContent;
        if (!replyToPeer) {
          return;
        }

        const messageType: OutputMessageType = companion
          ? replyToPeer === companion
            ? OutputMessageType.REPLY
            : OutputMessageType.COMPLEMENT
          : OutputMessageType.COMPLEMENT;
        const content = document.querySelector(
          ".reply-wrapper .reply-subtitle"
        )?.textContent;
        if (!content) {
          return;
        }
        const newSelectedMessage: ContextMessage = {
          content,
          isOwn: messageType === OutputMessageType.COMPLEMENT
        };

        if (
          !selectedMessage ||
          selectedMessage.content !== newSelectedMessage.content
        ) {
          setSelectedMessage(newSelectedMessage);
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    return () => {
      observer.disconnect();
    };
  }, [companion, selectedMessage, updatedUrl]);

  useEffect(() => {
    const chatObserver = new MutationObserver(() => {
      if (!companion) return;
      handleUpdateContextMessages();
    });
    chatObserver.observe(document.querySelector(".bubbles-inner")!, {
      childList: true,
      subtree: true
    });
  }, [handleUpdateContextMessages, updatedUrl, companion]);

  useEffect(() => {
    if (!companion) return;
    if (document.querySelector(".chat-input.is-hidden")) {
      return;
    }

    const goDownButton = document.querySelector(
      ".btn-circle.btn-corner.z-depth-1.bubbles-corner-button.chat-secondary-button.bubbles-go-down.tgico-arrow_down.rp"
    )! as HTMLButtonElement;
    goDownButton.click();
  }, [companion, updatedUrl]);

  return (
    <ChatObserverContext.Provider
      value={{
        contextMessages,
        selectedMessage,
        updatedUrl,
        handleUpdateContextMessages
      }}
    >
      {children}
    </ChatObserverContext.Provider>
  );
};
