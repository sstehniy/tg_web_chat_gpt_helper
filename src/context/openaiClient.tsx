import { OpenAIApi, Configuration } from "openai";
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

export const baseApiOptions = {
  model: "gpt-3.5-turbo",
  top_p: 0.7,
  temperature: 0.5,
  max_tokens: 250
};

type OpenaiClientContextType = {
  isAuthorized: boolean;
  client: OpenAIApi;
  handleSetToken: (token: string) => void;
};

const OpenaiClientContext = createContext<OpenaiClientContextType>(
  null as unknown as OpenaiClientContextType
);

export const useOpenaiClient = () => useContext(OpenaiClientContext);

export const OpenaiClientProvider: FC<PropsWithChildren<unknown>> = ({
  children
}) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [token, setToken] = useState("");
  const clientInitialized = useRef(false);
  const client = useRef<OpenAIApi>(null as unknown as OpenAIApi);

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
      client.current = new OpenAIApi(config);
      clientInitialized.current = true;
      try {
        const models = await client.current.listModels();
        setIsAuthorized(true);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [token]);

  return (
    <OpenaiClientContext.Provider
      value={{
        isAuthorized,
        client: client.current,
        handleSetToken
      }}
    >
      {children}
    </OpenaiClientContext.Provider>
  );
};
