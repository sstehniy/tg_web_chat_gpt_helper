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
import { useTheme } from "./themeProvider";

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
  const theme = useTheme();

  useEffect(() => {
    const handleOnMessage = (message: any) => {
      if (message.url !== updatedUrl) {
        setUpdatedUrl(message.url);
      }
    };
    chrome.runtime.onMessage.addListener(handleOnMessage);
  }, [updatedUrl]);

  const handleUpdateContextMessages = useCallback(() => {
    const flatBubbles = Array.from(
      document.querySelectorAll(theme.selectors.bubble)
    );

    const bubblesWithTextWrappers = flatBubbles.flatMap((bubble) => {
      const isOwn = bubble.classList.contains(theme.classNames.isOut);
      return Array.from(
        bubble.querySelectorAll(theme.selectors.bubblesWithTextWrappers)
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
  }, [theme]);

  useEffect(() => {
    const titleObserver = new MutationObserver(() => {
      if (document.querySelector(theme.selectors.userTitle)?.firstChild) {
        setCompanion(
          document.querySelector(theme.selectors.userTitle)!.firstChild!
            .textContent
        );
        titleObserver.disconnect();
      }
    });
    titleObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }, [updatedUrl, theme]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isHelperActive = document.querySelector(
        theme.selectors.helperActive
      );
      if (!isHelperActive) {
        setSelectedMessage(null);
        return;
      } else {
        const replyToPeer = document.querySelector(
          theme.selectors.replyToPeer
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
          theme.selectors.replyContent
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
  }, [companion, selectedMessage, updatedUrl, theme]);

  useEffect(() => {
    const chatObserver = new MutationObserver(() => {
      if (!companion) return;
      handleUpdateContextMessages();
    });
    chatObserver.observe(document.querySelector(theme.selectors.bubbles)!, {
      childList: true,
      subtree: true
    });
  }, [handleUpdateContextMessages, updatedUrl, companion, theme]);

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
