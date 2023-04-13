import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import { Configuration, OpenAIApi } from "openai";

type GptApiContextType = {
  isAuthorized: boolean;
  handleSetToken: (token: string) => void;
};

const GptApiContext = createContext<GptApiContextType>(
  null as unknown as GptApiContextType
);

export const useGptApi = () => useContext(GptApiContext);

export const GptApiProvider: FC<PropsWithChildren<unknown>> = ({
  children
}) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [token, setToken] = useState("");
  const client = useRef();

  const handleSetToken = useCallback((token: string) => {
    chrome.storage.local.set({ tg_gpt_helper_openai_token: token }, () => {
      setToken(token);
    });
  }, []);

  useEffect(() => {
    chrome.storage.local.get("tg_gpt_helper_openai_token", (result) => {
      if (typeof result.tg_gpt_helper_openai_token === "string")
        setToken(result.tg_gpt_helper_openai_token);
    });
  }, []);

  useEffect(() => {
    if (!token) return;
    (async () => {
      const config = new Configuration({
        apiKey: token
      });
      console.warn(JSON.stringify(config));
      const client = new OpenAIApi(config);
      try {
        const models = await client.listModels();
        setIsAuthorized(true);
        console.log(models);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [token]);

  return (
    <GptApiContext.Provider value={{ isAuthorized, handleSetToken }}>
      {children}
    </GptApiContext.Provider>
  );
};
