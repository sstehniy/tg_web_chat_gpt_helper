import { FC, PropsWithChildren, createContext } from "react";
import { ContextMessage } from "../types";

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
  return (
    <ChatObserverContext.Provider
      value={{ contextMessages: [], selectedMessage: null }}
    >
      {children}
    </ChatObserverContext.Provider>
  );
};
