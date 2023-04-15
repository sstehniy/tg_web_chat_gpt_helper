import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useState
} from "react";
import { ContextMessage, OutputMessageType } from "../types";

type ChatObserverContextType = {
  contextMessages: ContextMessage[];
  selectedMessage: ContextMessage | null;
};

const ChatObserverContext = createContext(
  null as unknown as ChatObserverContextType
);

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
      console.log(message.url);
      if (message.url !== updatedUrl) {
        setUpdatedUrl(message.url);
      }
    };
    chrome.runtime.onMessage.addListener(handleOnMessage);
    return () => {
      chrome.runtime.onMessage.removeListener(handleOnMessage);
    };
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
    const bubblesWithTextWrappers = flatBubbles
      .flatMap((bubble) => {
        const isOwn = bubble.classList.contains("is-out");
        return Array.from(
          bubble.querySelectorAll(
            ".message.spoilers-container:not(.call-message):not(.document-message)"
          )
        ).map((contentWrapper) => {
          return { contentWrapper, isOwn };
        });
      })
      .slice(-5);

    const newContextMessages = bubblesWithTextWrappers.map(
      ({ contentWrapper, isOwn }) => {
        const content =
          contentWrapper.childNodes.length === 1
            ? ""
            : contentWrapper.firstChild?.textContent || "";

        return { content, isOwn };
      }
    );
    console.log(newContextMessages);
    setContextMessages(newContextMessages);
  }, []);

  useEffect(() => {
    const titleObserver = new MutationObserver(() => {
      if (document.querySelector(".top .user-title")?.firstChild) {
        console.log("set companion");
        setCompanion(
          document.querySelector(".top .user-title")!.firstChild!.textContent
        );
        titleObserver.disconnect();
      }
    });
    titleObserver.observe(document.querySelector(".top")!, {
      childList: true,
      subtree: true
    });
  }, [updatedUrl]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const replyButton = document.querySelector(".reply-icon");
      if (!replyButton) {
        setSelectedMessage(null);
      } else {
        const replyToPeer = document.querySelector(
          ".reply-wrapper .reply-title > .peer-title"
        )?.textContent;
        if (!replyToPeer) {
          return;
        }
        console.log(replyToPeer, companion);
        const messageType: OutputMessageType = companion
          ? replyToPeer === companion
            ? OutputMessageType.REPLY
            : OutputMessageType.FOLLOWUP
          : OutputMessageType.FOLLOWUP;
        console.log(
          document.querySelectorAll(".reply-wrapper .reply-subtitle")
        );
        const content = document.querySelector(
          ".reply-wrapper .reply-subtitle"
        )?.textContent;
        if (!content) {
          return;
        }
        const selectedMessage: ContextMessage = {
          content,
          isOwn: messageType === OutputMessageType.FOLLOWUP
        };
        setSelectedMessage(selectedMessage);
      }
    });

    observer.observe(document.querySelector(".chat-input")!, {
      attributes: true,
      childList: true,
      subtree: true
    });
  }, [companion, updatedUrl]);

  useEffect(() => {
    const chatObserver = new MutationObserver(() => {
      handleUpdateContextMessages();
      chatObserver.disconnect();
    });
    chatObserver.observe(document.querySelector(".bubbles")!, {
      childList: true,
      subtree: true
    });
  }, [handleUpdateContextMessages, updatedUrl]);

  useEffect(() => {
    if (!companion) return;
    setContextMessages([]);
    setSelectedMessage(null);
    if (document.querySelector(".chat-input.is-hidden")) {
      return;
    }

    const goDownButton = document.querySelector(
      ".btn-circle.btn-corner.z-depth-1.bubbles-corner-button.chat-secondary-button.bubbles-go-down.tgico-arrow_down.rp"
    )! as HTMLButtonElement;
    goDownButton.click();
  }, [companion, updatedUrl]);

  useEffect(() => {
    console.log(selectedMessage);
  }, [selectedMessage]);

  return (
    <ChatObserverContext.Provider
      value={{ contextMessages: [], selectedMessage: null }}
    >
      {children}
    </ChatObserverContext.Provider>
  );
};
