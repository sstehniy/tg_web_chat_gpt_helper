import {
  FC,
  PropsWithChildren,
  createContext,
  useEffect,
  useState
} from "react";
import { BackgroundMessage, BackgroundMessageEnum } from "../types";

type UrlContextType = {
  isTelegramOpened: boolean;
};
const UrlContext = createContext<UrlContextType>({ isTelegramOpened: false });

const UrlContextProvider: FC<PropsWithChildren<unknown>> = ({ children }) => {
  const [isTelegramOpened, setIsTelegramOpened] = useState(false);
  useEffect(() => {
    chrome.runtime.onMessage.addListener((request: BackgroundMessage) => {
      if (request.message === BackgroundMessageEnum.UrlUpdate) {
        const url = request.url;
        const isUrlMatched = url.match(/^https:\/\/web\.telegram\.org\/[kz]\//);
        setIsTelegramOpened(!!isUrlMatched);
      }
    });
  }, []);

  return (
    <UrlContext.Provider value={{ isTelegramOpened }}>
      {children}
    </UrlContext.Provider>
  );
};

export { UrlContext, UrlContextProvider };
