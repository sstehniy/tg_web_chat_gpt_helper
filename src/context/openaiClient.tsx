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
  top_p: 0.7,
  temperature: 0.5,
  max_tokens: 500
};

export const availableModels = [
  { label: "GPT 4o", value: "gpt-4o" },
  { label: "GPT 4o Mini", value: "gpt-4o-mini" }
] as const;

type OpenAiClientContextType = {
  isAuthorized: boolean;
  client: OpenAIApi;
  handleSetToken: (token: string) => void;
  selectedModel: (typeof availableModels)[number];
  setSelectedModel: (model: (typeof availableModels)[number]) => void;
};

const OpenaiClientContext = createContext<OpenAiClientContextType>(
  null as unknown as OpenAiClientContextType
);

export const useOpenaiClient = () => useContext(OpenaiClientContext);

export const OpenaiClientProvider: FC<PropsWithChildren<unknown>> = ({
  children
}) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [token, setToken] = useState("");
  const clientInitialized = useRef(false);
  const client = useRef<OpenAIApi>(null as unknown as OpenAIApi);
  const [selectedModel, setSelectedModel] = useState<
    (typeof availableModels)[number]
  >(availableModels[0]);

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
        handleSetToken,
        selectedModel,
        setSelectedModel
      }}
    >
      {children}
    </OpenaiClientContext.Provider>
  );
};
